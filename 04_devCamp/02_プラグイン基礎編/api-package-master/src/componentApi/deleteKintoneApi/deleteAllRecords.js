/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを全件削除するAPI
 * 全件取得するgetAllRecords関数と、分割したdeleteAllRecordsCorefunc関数を使用
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（削除成功時）空のJSONデータが入ったobject、（エラー発生時）ERRORオブジェクト
 */
const deleteAllRecords = (body) => {
    // body.idsが指定されている場合は、指定されているレコードを全件削除
    if (body.ids) {
        return deleteAllRecordsCorefunc(body);
    }

    // 削除先のレコードを全件取得し、削除先アプリの全レコードを削除
    return getAllRecordsForDelete({
        app: body.app,
        fields: ['$id'],
    })
        .then((resp) => {
            if (resp.length === 0) {
                return kintone.Promise.reject(
                    new Error(
                        '削除先にレコードが存在しません。'
                    )
                );
            }

            // 取得した削除先アプリのレコードidをbody.idsに設定
            const idsToDelete = [];
            resp.forEach((record) => {
                idsToDelete.push(record.$id.value);
            });
            body.ids = idsToDelete;

            return deleteAllRecordsCorefunc(body);
        })
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};

/**
 * deleteAllRecords関数において、
 * 再帰呼び出しのために分割した関数。
 *
 * @param {object} body リクエストボディ
 */
const deleteAllRecordsCorefunc = (body) => {
    // 次に削除する100件を設定
    const bodyLimitedRecords = Object.assign({}, body);
    const toDeleteRecordsIds = body.ids.slice(0, 100);
    const nextRecordsIds = body.ids.slice(100);
    bodyLimitedRecords.ids = toDeleteRecordsIds;

    let toDeleteRecordsRevisions = [];
    let nextRecordsRevisions = [];
    if (body.revisions) {
        // prettier-ignore
        toDeleteRecordsRevisions = body.revisions.slice(0, 100);
        nextRecordsRevisions = body.revisions.slice(100);
        bodyLimitedRecords.revisions = toDeleteRecordsRevisions;
    }

    // APIを実行
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'DELETE',
            bodyLimitedRecords
        )
        .then((resp) => {
            if (nextRecordsIds.length) {
                bodyLimitedRecords.ids = nextRecordsIds;
                if (body.revisions) {
                    bodyLimitedRecords.revisions = nextRecordsRevisions;
                }
                return deleteAllRecordsCorefunc(
                    bodyLimitedRecords
                );
            }
            return resp;
        });
};

/**
 * deleteAllRecordsで使用する、全件取得関数。
 *
 * @param {object} body リクエストボディ
 * @param {number} recordId 再起呼び出し時に使用する、APIレスポンスで取得した次に指定するレコードID。(getAllRecordsを使用する際は指定不要)
 * @param {array}  records 再起呼び出し時に使用する、APIレスポンスで取得したレコードが入った配列。(getAllRecordsを使用する際は指定不要)
 * @return {Promise} 引数：レコードが入った配列
 */
const getAllRecordsForDelete = (
    body,
    recordId = -1,
    records = []
) => {
    // 次に取得する500件を設定
    let respRecords = records;
    const bodyAddedQuery = Object.assign({}, body); // bodyは再起呼び出しで再利用するためbodyを複製
    bodyAddedQuery.query =
        recordId === -1
            ? 'order by $id asc limit 500'
            : `$id > ${recordId} order by $id asc limit 500`;

    // APIを実行
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'GET',
            bodyAddedQuery
        )
        .then((resp) => {
            respRecords = respRecords.concat(resp.records);
            if (resp.records.length === 500) {
                return getAllRecordsForDelete(
                    body,
                    resp.records[499].$id.value,
                    respRecords
                );
            }
            return respRecords;
        });
};
