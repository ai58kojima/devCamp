/* eslint-disable no-unused-vars */

/**
 * 複数の組織の情報を取得するAPI
 * 一回のリクエストで最大100件取得可能。
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（取得成功時）組織の情報が入った配列、（エラー発生時）ERRORオブジェクト
 */
const getOrganizations = (body) => {
    return kintone
        .api(
            kintone.api.url('/v1/organizations', true),
            'GET',
            body
        )
        .then((resp) => {
            return resp.organizations;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
