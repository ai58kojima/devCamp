/* eslint-disable no-unused-vars */

/**
 * 所属グループの情報を取得するAPI
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（取得成功時）所属グループの情報が入った配列、（エラー発生時）ERRORオブジェクト
 */
const getUserGroups = (body) => {
    return kintone
        .api(
            kintone.api.url('/v1/user/groups', true),
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
