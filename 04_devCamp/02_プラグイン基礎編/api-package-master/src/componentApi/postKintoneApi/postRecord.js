/* eslint-disable no-unused-vars */

/**
 * アプリへレコードを一件登録するAPI
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（登録成功時）POSTしたレコードの情報を持つobject、（エラー発生時）ERRORオブジェクト
 */
const postRecord = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/record', true),
            'POST',
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
