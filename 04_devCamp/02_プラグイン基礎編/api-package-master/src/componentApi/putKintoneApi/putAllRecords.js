/* eslint-disable no-unused-vars */
/**
 * アプリのレコードを全件更新するAPI
 *
 * @param {object} body リクエストボディ
 * @param {array} idsAndRevisions 再起呼び出し時に使用する、APIレスポンスで取得した更新済みレコードidとリビジョンが入った配列。(putAllRecordsを使用する際は指定不要)
 * @return {Promise<argument>} 引数：（更新成功時）PUTしたレコードの情報を持つ配列、（エラー発生時）ERRORオブジェクト
 */
const putAllRecords = (body, idsAndRevisions = []) => {
    // 次に更新する100件を設定
    let respIdAndRevisions = idsAndRevisions;
    const toPutRecords = body.records.slice(0, 100);
    const nextRecords = body.records.slice(100);
    const bodyLimitedRecords = Object.assign({}, body);
    bodyLimitedRecords.records = toPutRecords;

    // APIを実行
    return kintone
        .api(
            kintone.api.url('/k/v1/records', true),
            'PUT',
            bodyLimitedRecords
        )
        .then((resp) => {
            respIdAndRevisions = respIdAndRevisions.concat(
                resp.records
            );
            if (nextRecords.length) {
                bodyLimitedRecords.records = nextRecords;
                return putAllRecords(
                    bodyLimitedRecords,
                    respIdAndRevisions
                );
            }
            return respIdAndRevisions;
        })
        .catch((error) => {
            console.log(error);
            return kintone.Promise.reject(error);
        });
};
