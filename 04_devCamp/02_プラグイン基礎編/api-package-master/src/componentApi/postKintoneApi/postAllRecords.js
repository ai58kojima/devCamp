/* eslint-disable no-unused-vars */

/**
 * アプリへレコードを全件登録するAPI
 *
 * @param {object} body リクエストボディ
 * @param {number} Ids 再起呼び出し時に使用する、APIレスポンスで取得した登録済みのレコードidが入った配列。(postAllRecordsを使用する際は指定不要)
 * @return {Promise<argument>} 引数：（登録成功時）POSTしたレコードidが入った配列、（エラー発生時）ERRORオブジェクト
 */
const postAllRecords = (body, ids = []) => {
    // 次に登録する100件を設定
    let respIds = ids;
    const toPostRecords = body.records.slice(0, 100);
    const nextRecords = body.records.slice(100);
    const bodyLimitedRecords = Object.assign({}, body);
    bodyLimitedRecords.records = toPostRecords;

    // APIを実行
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'POST',
            bodyLimitedRecords
        )
        .then((resp) => {
            respIds = respIds.concat(resp.ids);
            if (nextRecords.length) {
                bodyLimitedRecords.records = nextRecords;
                return postAllRecords(
                    bodyLimitedRecords,
                    respIds
                );
            }
            return respIds;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
