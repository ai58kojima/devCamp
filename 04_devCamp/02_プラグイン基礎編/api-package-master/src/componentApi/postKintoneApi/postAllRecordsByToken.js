/* eslint-disable no-unused-vars */

/**
 * アプリへレコードを全件登録するXMLHttpRequest
 *
 * @param {object} body リクエストボディ
 * @param {string} token 登録先のAPIトークン（任意）
 * @param {number} Ids 再起呼び出し時に使用する、Xhrレスポンスで取得した登録済みのレコードidが入った配列。(postAllRecordsByXhrを使用する際は指定不要)
 * @return {Promise<argument>} 引数：（登録成功時）POSTしたレコードidが入った配列、（エラー発生時）ERRORオブジェクト
 */
const postAllRecordsByToken = (
    body,
    token = '',
    ids = []
) => {
    // 次に登録する100件を設定
    let respIds = ids;
    const toPostRecords = body.records.slice(0, 100);
    const nextRecords = body.records.slice(100);
    const bodyLimitedRecords = Object.assign({}, body);
    bodyLimitedRecords.records = toPostRecords;

    // リクエストの設定
    bodyLimitedRecords.__REQUEST_TOKEN__ = kintone.getRequestToken();
    const url = kintone.api.url('/k/v1/records', true);
    const xhr = new XMLHttpRequest();

    // XMLHttpRequest実行
    xhr.open('POST', url, false);
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
        respIds = respIds.concat(resp.ids);
        if (nextRecords.length) {
            bodyLimitedRecords.records = nextRecords;
            return postAllRecordsByToken(
                bodyLimitedRecords,
                token,
                respIds
            );
        }
        return kintone.Promise.resolve(respIds);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
