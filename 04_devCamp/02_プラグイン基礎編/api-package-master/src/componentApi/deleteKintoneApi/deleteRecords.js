/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを複数件削除するAPI
 * 一回のdeleteリクエストで最大100件削除可能です。
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（削除成功時）空のJSONデータが入ったobject、（エラー発生時）ERRORオブジェクト
 */
const deleteRecords = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'DELETE',
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
