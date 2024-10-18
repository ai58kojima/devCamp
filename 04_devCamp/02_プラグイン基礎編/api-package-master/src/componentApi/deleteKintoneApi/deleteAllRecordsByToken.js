/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを全件削除するXMLHttpRequest
 *
 * @param {object} body リクエストボディ
 * @param {string} token 削除先のAPIトークン（任意）
 * @return {Promise<argument>} 引数：（削除成功時）空のJSONデータが入ったobject、（エラー発生時）ERRORオブジェクト
 */
const deleteAllRecordsByToken = (body, token = '') => {
    // body.idsが指定されている場合は、指定されているレコードを全件削除
    if (body.ids) {
        return deleteAllRecordsByTokenCorefunc(body, token);
    }

    // 削除先のレコードを全件取得
    let allRecordsToDelete = [];
    const idsToDelete = [];
    allRecordsToDelete = getAllRecordsByTokenForDelete(
        {
            app: body.app,
            fields: ['$id'],
        },
        token
    );

    // getAllRecordsByTokenの返り値がエラーオブジェクトだった場合
    if (!(allRecordsToDelete instanceof Array)) {
        const errorMessage = allRecordsToDelete;
        return kintone.Promise.reject(
            new Error(errorMessage)
        );
    }
    if (!allRecordsToDelete.length) {
        return kintone.Promise.reject(
            new Error('削除先にレコードが存在しません。')
        );
    }

    allRecordsToDelete.forEach((record) => {
        idsToDelete.push(record.$id.value);
    });
    body.ids = idsToDelete;
    return deleteAllRecordsByTokenCorefunc(body, token);
};

/**
 * deleteAllRecordsByToken関数において、
 * 再帰呼び出しのために分割した関数。
 *
 * @param {object} body リクエストボディ
 * @param {string} token 削除先のAPIトークン
 */
const deleteAllRecordsByTokenCorefunc = (body, token) => {
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

    // リクエストの設定
    bodyLimitedRecords.__REQUEST_TOKEN__ = kintone.getRequestToken();
    const url = kintone.api.url('/k/v1/records', true);
    const xhr = new XMLHttpRequest();

    // XMLHttpRequest実行
    xhr.open('DELETE', url, false);
    xhr.setRequestHeader(
        'X-Requested-With',
        'XMLHttpRequest'
    );
    if (token) {
        xhr.setRequestHeader('X-Cybozu-API-Token', token);
    }
    xhr.setRequestHeader(
        'Content-Type',
        'application/json'
    );
    xhr.send(JSON.stringify(bodyLimitedRecords));
    const resp = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
        if (nextRecordsIds.length) {
            bodyLimitedRecords.ids = nextRecordsIds;
            if (body.revisions) {
                bodyLimitedRecords.revisions = nextRecordsRevisions;
            }
            return deleteAllRecordsByTokenCorefunc(
                bodyLimitedRecords,
                token
            );
        }
        return kintone.Promise.resolve(resp);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};

/**
 * deleteAllRecordsByTokenで使う全件取得の関数。
 *
 * @param {object} body リクエストボディ
 * @param {string} token 取得先アプリのAPIトークン（任意）
 * @param {number} recordId 再起呼び出し時に使用する、Xhrレスポンスで取得した次に指定するレコードID。(getAllRecordsByXhrを使用する際は指定不要)
 * @param {array}  records 再起呼び出し時に使用する、Xhrレスポンスで取得したレコードが入った配列。(getAllRecordsByXhrを使用する際は指定不要)
 * @return {Promise} 引数：レコードが入った配列
 */
const getAllRecordsByTokenForDelete = (
    body,
    token = '',
    recordId = -1,
    records = []
) => {
    let respRecords = records;
    const bodyAddedQuery = Object.assign({}, body);

    // 次に取得する500件をcopiedBodyに設定。再起呼び出しされた場合は、recordIdにはid番号が入り-1ではなくなる。
    bodyAddedQuery.query =
        recordId === -1
            ? 'order by $id asc limit 500'
            : `$id > ${recordId} order by $id asc limit 500`;

    // リクエストの設定
    const urlWithQuery = kintone.api.urlForGet(
        '/k/v1/records',
        bodyAddedQuery,
        true
    );
    const xhr = new XMLHttpRequest();

    // XMLHttpRequestを実行
    xhr.open('GET', urlWithQuery, false);
    xhr.setRequestHeader(
        'X-Requested-With',
        'XMLHttpRequest'
    );
    if (token) {
        xhr.setRequestHeader('X-Cybozu-API-Token', token);
    }
    xhr.send(null);
    const resp = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
        respRecords = respRecords.concat(resp.records);
        if (resp.records.length === 500) {
            return getAllRecordsByTokenForDelete(
                body,
                token,
                resp.records[499].$id.value,
                respRecords
            );
        }
        return respRecords;
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return resp;
};
