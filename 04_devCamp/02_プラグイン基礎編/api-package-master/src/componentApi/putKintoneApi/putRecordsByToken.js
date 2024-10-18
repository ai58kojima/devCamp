/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを複数件更新するXMLHttpRequest
 * 一回のPUTリクエストで最大100件更新可能。
 *
 * @param {object} body リクエストボディ
 * @param {string} token 更新先のAPIトークン（任意）
 * @return {Promise<argument>} 引数：（更新成功時）PUTしたレコードの情報を持つobject、（エラー発生時）ERRORオブジェクト
 */
const putRecordsByToken = (body, token = '') => {
    // リクエストの設定
    body.__REQUEST_TOKEN__ = kintone.getRequestToken();
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
    xhr.send(JSON.stringify(body));
    const resp = JSON.parse(xhr.responseText);
    if (xhr.status === 200) {
        return kintone.Promise.resolve(resp.records);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
