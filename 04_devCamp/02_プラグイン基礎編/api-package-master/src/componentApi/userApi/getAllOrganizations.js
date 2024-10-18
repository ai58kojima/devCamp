/* eslint-disable no-unused-vars */

/* ****************************************
 * 開発中API関数です。使用はお控えください。
 *************************************** */

/**
 * 100件以上の組織の情報を取得するAPI
 *
 * @param {object} body リクエストボディ
 * @param {number} maxId idsとcodesを指定しない場合、取得するidの最大値
 * @return {Promise<argument>} 引数：（取得成功時）組織の情報が入った配列、（エラー発生時）ERRORオブジェクト
 */
const getAllOrganizations = (body, maxId = 500) => {
    if (body.ids) return getOrganizationsWithId();
    if (body.codes) return getOrganizationsWithCodes();
    return getOrganizationsToMaxId();

    function getOrganizationsWithId(
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
                kintone.api.url('/v1/organizations', true),
                'GET',
                copiedBody
            )
            .then((resp) => {
                result.push(...resp.organizations);
                if (islengthUnderLimit) return result;

                const nextCopiedBody = {
                    ids: [...recursiveBody.ids],
                };
                nextCopiedBody.ids.splice(0, 100);
                return getOrganizationsWithId(
                    nextCopiedBody,
                    result
                );
            })
            .catch((error) => {
                console.log(error);
                return kintone.Promise.reject(error);
            });
    }

    function getOrganizationsWithCodes(
        recursiveBody = body,
        result = []
    ) {
        /** NOTICE: 現状70以上の長さの配列だとエラーになるため69に設定 */
        const islengthUnderLimit =
            recursiveBody.codes.length <= 69;
        const copiedBody = {
            codes: [...recursiveBody.codes],
        };
        if (!islengthUnderLimit) {
            copiedBody.codes.splice(69);
        }

        return kintone
            .api(
                kintone.api.url('/v1/organizations', true),
                'GET',
                copiedBody
            )
            .then((resp) => {
                result.push(...resp.organizations);
                if (islengthUnderLimit) return result;

                const nextCopiedBody = {
                    codes: [...recursiveBody.codes],
                };
                nextCopiedBody.codes.splice(0, 69);
                return getOrganizationsWithCodes(
                    nextCopiedBody,
                    result
                );
            })
            .catch((error) => {
                console.log(error);
                return kintone.Promise.reject(error);
            });
    }

    function getOrganizationsToMaxId() {
        const serialIdsArrayToMaxId = Array(maxId)
            .fill(1)
            .map((value, index) => index + 1);

        return getOrganizationsWithId({
            ids: serialIdsArrayToMaxId,
        });
    }
};
