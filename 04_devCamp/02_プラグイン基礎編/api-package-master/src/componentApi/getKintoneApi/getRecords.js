/* eslint-disable no-unused-vars */

/**
 * アプリのレコードを複数件取得するAPI
 * 一回のGETリクエストで最大500件取得可能。
 *
 * @param {object} body リクエストボディ
 * @return {Promise<argument>} totalCountを指定した場合の引数：（取得成功時）レコードのObjectが入った配列
 *                   totalCountを指定しなかった場合の引数：（取得成功時）レコードが入った配列と取得件数をプロパティとしたobject
 *                   いずれの場合もエラー発生時の引数：ERRORオブジェクト
 */
const getRecords = (body) => {
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'GET',
            body
        )
        .then((resp) => {
            // prettier-ignore
            return body.totalCount
                ? resp
                : resp.records;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
