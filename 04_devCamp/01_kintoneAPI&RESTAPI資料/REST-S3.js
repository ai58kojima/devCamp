(() => {
  'use strict';

  // 案件管理アプリID
  const CASE_APP_ID = kintone.app.getId() + 1;

  // 顧客名
  let customer = '';

  // 編集画面-表示時、一覧画面-インライン編集開始時
  kintone.events.on(['app.record.edit.show', 'app.record.index.edit.show'], (event) => {
    // 表示時点の顧客名を取得
    customer = event.record.顧客名.value;
    return event;
  });

  // 編集画面・一覧画面-更新完了（成功）後
  kintone.events.on(['app.record.edit.submit.success', 'app.record.index.edit.submit.success'], async (event) => {
    // 顧客名に変更がない場合：早期リターン
    if (customer === event.record.顧客名.value) return event;

    try {
      // 更新対象取得
      const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', {
        app: CASE_APP_ID,
        query: `顧客管理レコード番号_関連レコード紐付け用 = "${event.record.$id.value}"`,
      });

      // 案件が0件の場合：早期リターン
      if (resp.records.length === 0) return event;

      // 更新用パラメータ作成
      const updateRecords = resp.records.map((record) => {
        return {
          id: record.$id.value,
          record: {
            顧客名: {
              value: event.record.顧客名.value,
            },
          },
        };
      });

      // 更新処理
      await kintone.api(kintone.api.url('/k/v1/records.json', true), 'PUT', {
        app: CASE_APP_ID,
        records: updateRecords,
      });
      window.alert('案件管理アプリの更新処理が完了しました。');
      return event;
    } catch (error) {
      // エラー表示をする

      window.alert('案件管理アプリの更新処理でエラーが発生しました。');
      console.error(error.message);
      return event;
    }
  });
})();
