/* eslint-disable no-unused-vars */

/* ****************************************
 * 開発中API関数です。使用はお控えください。
 *************************************** */

/**
 * 100件以上のグループの情報を取得するAPI
 *
 * @param {object} body リクエストボディ
 * @param {number} maxId idsとcodesを指定しない場合、取得するidの最大値
 * @return {Promise<argument>} 引数：（取得成功時）グループの情報が入った配列、（エラー発生時）ERRORオブジェクト
 */
const getAllGroups = (body, maxId = 500) => {
    if (body.ids) return getGroupsWithId();
    if (body.codes) return getGroupsWithCodes();
    return getGroupsToMaxId();

    function getGroupsWithId(
        recursiveBody = body,
        result = []
    ) {
        const islengthUnderLimit =
            recursiveBody.ids.length <= 100;
        const copiedBody = { ids: [...recursiveBody.ids] };
        if (!islengthUnderLimit) {
            copiedBody.ids.splice(100);
        }

        return kintone
            .api(
                kintone.api.url('/v1/groups', true),
                'GET',
                copiedBody
            )
            .then((resp) => {
                result.push(...resp.groups);
                if (islengthUnderLimit) return result;

                const nextCopiedBody = {
                    ids: [...recursiveBody.ids],
                };
                nextCopiedBody.ids.splice(0, 100);
                return getGroupsWithId(
                    nextCopiedBody,
                    result
                );
            })
            .catch((error) => {
                console.log(error);
                return kintone.Promise.reject(error);
            });
    }

    function getGroupsWithCodes(
        recursiveBody = body,
        result = []
    ) {
        /** NOTICE: 現状53以上の長さの配列だとエラーになるため52に設定 */
        const islengthUnderLimit =
            recursiveBody.codes.length <= 52;
        const copiedBody = {
            codes: [...recursiveBody.codes],
        };
        if (!islengthUnderLimit) {
            copiedBody.codes.splice(52);
        }

        return kintone
            .api(
                kintone.api.url('/v1/groups', true),
                'GET',
                copiedBody
            )
            .then((resp) => {
                result.push(...resp.groups);
                if (islengthUnderLimit) return result;

                const nextCopiedBody = {
                    codes: [...recursiveBody.codes],
                };
                nextCopiedBody.codes.splice(0, 52);
                return getGroupsWithCodes(
                    nextCopiedBody,
                    result
                );
            })
            .catch((error) => {
                console.log(error);
                return kintone.Promise.reject(error);
            });
    }

    function getGroupsToMaxId() {
        const serialIdsArrayToMaxId = Array(maxId)
            .fill(1)
            .map((value, index) => index + 1);

        return getGroupsWithId({
            ids: serialIdsArrayToMaxId,
        });
    }
};
