/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを一件取得するXMLHttpRequest
 *
 * @param {object} body リクエストボディ
 * @param {string} token 取得先のAPIトークン（任意）
 * @return {Promise<argument>} 引数：（取得成功時）レコードの情報が入ったobject、（エラー発生時）ERRORオブジェクト
 */
const getRecordByToken = (body, token = '') => {
    // リクエストの設定
    const urlWithQuery = kintone.api.urlForGet(
        '/k/v1/record',
        body,
        true
    );
    const xhr = new XMLHttpRequest();

    // XMLHttpRequest実行
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
        return kintone.Promise.resolve(resp.record);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
