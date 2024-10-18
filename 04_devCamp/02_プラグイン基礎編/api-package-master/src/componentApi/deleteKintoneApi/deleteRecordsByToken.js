/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを複数件削除するXMLHttpRequest
 * 一回のdeleteリクエストで最大100件削除可能です。
 *
 * @param {object} body リクエストボディ
 * @param {string} token 削除先のAPIトークン（任意）
 * @return {Promise<argument>} 引数：（削除成功時）空のJSONデータが入ったobject、（エラー発生時）ERRORオブジェクト
 */
const deleteRecordsByToken = (body, token = '') => {
    // リクエストの設定
    body.__REQUEST_TOKEN__ = kintone.getRequestToken();
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
    xhr.send(JSON.stringify(body));
    const resp = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
        return kintone.Promise.resolve(resp);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
