/* eslint-disable no-unused-vars */

/**
 * 複数のグループの情報を取得するAPI
 * 一回のリクエストで最大100件取得可能。
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（取得成功時）グループの情報が入った配列、（エラー発生時）ERRORオブジェクト
 */
const getGroups = (body) => {
    return kintone
        .api(
            kintone.api.url('/v1/groups', true),
            'GET',
            body
        )
        .then((resp) => {
            return resp.groups;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
