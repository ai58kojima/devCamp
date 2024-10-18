/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを一件更新するAPI
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（更新成功時）PUTしたレコードの情報を持つobject、（エラー発生時）ERRORオブジェクト
 */
const putRecord = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/record', true),
            'PUT',
            body
        )
        .then((resp) => {
            return resp;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
