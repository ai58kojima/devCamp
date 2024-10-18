/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを複数件更新するAPI
 * 一回のPUTリクエストで最大100件更新可能。
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} 引数：（更新成功時）PUTしたレコードの情報を持つobject、（エラー発生時）ERRORオブジェクト
 */
const putRecords = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'PUT',
            body
        )
        .then((resp) => {
            return resp.records;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
