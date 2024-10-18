/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを一件取得するAPI
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（取得成功時）レコードの情報が入ったobject、（エラー発生時）ERRORオブジェクト
 */
const getRecord = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/record', true),
            'GET',
            body
        )
        .then((resp) => {
            return resp.record;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
