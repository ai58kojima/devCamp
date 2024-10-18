/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを全件取得するXMLHttpRequest
 *
 * @param {object} body リクエストボディ
 * @param {string} token 取得先アプリのAPIトークン（任意）
 * @param {number} recordId 再起呼び出し時に使用する、Xhrレスポンスで取得した次に指定するレコードID。(getAllRecordsByXhrを使用する際は指定不要)
 * @param {array}  records 再起呼び出し時に使用する、Xhrレスポンスで取得したレコードが入った配列。(getAllRecordsByXhrを使用する際は指定不要)
 * @return {Promise<argument>} 引数：（取得成功時）レコードが入った配列、（エラー発生時）ERRORオブジェクト
 */
const getAllRecordsByToken = (
    body,
    token = '',
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

    // 次に取得する500件をbodyAddedQueryに設定。再起呼び出しされた場合は、recordIdにはid番号が入り-1ではなくなる。
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
            return getAllRecordsByToken(
                body,
                token,
                resp.records[499].$id.value,
                respRecords
            );
        }
        return kintone.Promise.resolve(respRecords);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
