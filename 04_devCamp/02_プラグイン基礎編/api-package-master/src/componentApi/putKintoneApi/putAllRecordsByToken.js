/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを全件更新するXMLHttpRequest
 *
 * @param {object} body リクエストボディ
 * @param {string} token 更新先のAPIトークン（任意）
 * @param {array} idsAndRevisions 再起呼び出し時に使用する、Xhrレスポンスで取得した更新済みレコードidとリビジョンが入った配列。(putAllRecordsを使用する際は指定不要)
 * @return {Promise<argument>} 引数：（更新成功時）PUTしたレコードの情報を持つ配列、（エラー発生時）ERRORオブジェクト
 */
const putAllRecordsByToken = (
    body,
    token = '',
    idsAndRevisions = []
) => {
    // 次に更新する100件を設定
    let respIdAndRevisions = idsAndRevisions;
    const toPutRecords = body.records.slice(0, 100);
    const nextRecords = body.records.slice(100);
    const bodyLimitedRecords = Object.assign({}, body);
    bodyLimitedRecords.records = toPutRecords;

    // リクエストの設定
    bodyLimitedRecords.__REQUEST_TOKEN__ = kintone.getRequestToken();
    const url = kintone.api.url('/k/v1/records', true);
    const xhr = new XMLHttpRequest();

    // XMLHttpRequest実行
    xhr.open('PUT', url, false);
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
        respIdAndRevisions = respIdAndRevisions.concat(
            resp.records
        );
        if (nextRecords.length) {
            bodyLimitedRecords.records = nextRecords;
            return putAllRecordsByToken(
                bodyLimitedRecords,
                token,
                respIdAndRevisions
            );
        }
        return kintone.Promise.resolve(respIdAndRevisions);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
