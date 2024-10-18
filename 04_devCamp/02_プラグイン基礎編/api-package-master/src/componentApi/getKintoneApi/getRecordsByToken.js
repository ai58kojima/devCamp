/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを複数件取得するXMLHttpRequest
 * 一回のGETリクエストで最大500件取得可能。
 *
 * @param {object} body リクエストボディ
 * @param {string} token 取得先のAPIトークン（任意）
 * @return {Promise<argument>} totalCountを指定した場合の引数：（取得成功時）レコードのObjectが入った配列
 *                   totalCountを指定しなかった場合の引数：（取得成功時）レコードが入った配列と取得件数をプロパティとしたobject
 *                   いずれの場合もエラー発生時の引数：ERRORオブジェクト
 */
const getRecordsByToken = (body, token = '') => {
    // リクエストの設定
    const urlWithQuery = kintone.api.urlForGet(
        '/k/v1/records',
        body,
        true
    );
    const xhr = new XMLHttpRequest();

    // XMLHttpRequestの実行
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
        return body.totalCount
            ? kintone.Promise.resolve(resp)
            : kintone.Promise.resolve(resp.records);
    }

    // XMLHttpRequestがエラーの場合
    console.log(resp);
    return kintone.Promise.reject(resp);
};
