(() => {
  'use strict';

  kintone.events.on('app.record.index.show', async (event) => {
    try {
      // 案件管理アプリから案件数を取得する
      const resp = await kintone.api(kintone.api.url('/k/v1/records.json'), 'GET', {
        app: kintone.app.getRelatedRecordsTargetAppId('案件一覧'),
      });

      // 顧客管理アプリのレコード一覧メニューの下側に「現在の案件数：〇〇件」を表示する
      const divElement = document.createElement('div');
      divElement.textContent = `現在の案件数：${resp.records.length}件`;
      kintone.app.getHeaderSpaceElement().appendChild(divElement);
      return event;
    } catch (error) {
      console.log(error.message);
    }
  });
})();
