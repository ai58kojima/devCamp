/* eslint-disable no-unused-vars */

/**
 * アプリへレコードを複数件登録するAPI
 * 一回のPOSTリクエストで最大100件登録可能。
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（登録成功時）POSTしたレコードの情報を持つobject、（エラー発生時）ERRORオブジェクト
 */
const postRecords = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
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
