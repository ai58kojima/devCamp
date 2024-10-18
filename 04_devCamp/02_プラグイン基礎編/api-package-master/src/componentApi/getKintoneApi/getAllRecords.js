/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを全件取得するAPI
 *
 * @param {object} body リクエストボディ
 * @param {number} recordId 再起呼び出し時に使用する、APIレスポンスで取得した次に指定するレコードID。(getAllRecordsを使用する際は指定不要)
 * @param {array}  records 再起呼び出し時に使用する、APIレスポンスで取得したレコードが入った配列。(getAllRecordsを使用する際は指定不要)
 * @return {Promise<argument>} 引数：（取得成功時）レコードが入った配列、（エラー発生時）ERRORオブジェクト
 */
const getAllRecords = (
    body,
    recordId = -1,
    records = []
) => {
    let respRecords = records;

    // body.fieldsに$idが入っていない、かつ空配列でない場合に、再起呼び出しで使用する$idを追加する。
    if (recordId === -1 && body.fields) {
        if (
            !body.fields.includes('$id') &&
            body.fields.length !== 0
        ) {
            body.fields.push('$id');
        }
    }

    // 次に取得する500件を設定。再起呼び出しされた場合は、recordIdにはid番号が入り-1ではなくなる。
    const bodyAddedQuery = Object.assign({}, body); // bodyは再起呼び出しで再利用するためbodyを複製
    if (recordId === -1) {
        bodyAddedQuery.query = bodyAddedQuery.query
            ? `${bodyAddedQuery.query} order by $id asc limit 500`
            : 'order by $id asc limit 500';
    } else {
        bodyAddedQuery.query = bodyAddedQuery.query
            ? `(${bodyAddedQuery.query}) and $id > ${recordId} order by $id asc limit 500`
            : `$id > ${recordId} order by $id asc limit 500`;
    }

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
                return getAllRecords(
                    body,
                    resp.records[499].$id.value,
                    respRecords
                );
            }
            return respRecords;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
