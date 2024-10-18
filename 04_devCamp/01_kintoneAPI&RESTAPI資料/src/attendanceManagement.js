//即時関数・strictモード
(() => {
  'use strict';
  kintone.events.on('mobile.app.record.index.show', (event) => {
    const ATTENDANCE_APP_ID = kintone.mobile.app.getId(); //定数的な定義

    //◆出勤ボタンを押したとき、時刻を取得する
    document.getElementById('startWork').addEventListener('click', async () => {
      // レコードを登録するAPI
      await kintone.api('/k/v1/record.json', 'POST', {
        app: ATTENDANCE_APP_ID,
        record: {
          社員番号: {
            value: document.getElementById('staffNumber').value,
          },
          出勤時刻: {
            value: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
          },
        },
      });
      // console.log('レコード登録成功');
      location.reload();
    });

    //◆退勤ボタンを押したとき、複数レコードから対象レコードを取得
    document
      .getElementById('finishWork')
      .addEventListener('click', async () => {
        const response = await kintone.api('/k/v1/records.json', 'GET', {
          app: ATTENDANCE_APP_ID,
          query: `社員番号="${
            //クエリ：社員番号と出勤時刻が今日のとき
            document.getElementById('staffNumber').value
          }" and 出勤時刻=TODAY()`,
        });
        // console.log(response);

        //退勤時刻をレコード1件に更新する
        await kintone.api('/k/v1/record.json', 'PUT', {
          app: ATTENDANCE_APP_ID,
          id: response.records[0].$id.value,
          revision: response.records[0].$revision.value,
          record: {
            退勤時刻: {
              value: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
            },
          },
        });
        location.reload();
      });

    //◆現在時刻を表示する
    const divElement = document.createElement('div');
    console.log(divElement);
    kintone.mobile.app.getHeaderSpaceElement().appendChild(divElement);

    //現在時刻を要素に代入する
    divElement.textContent = dayjs().format('M月D日 HH:mm:ss');
    setInterval(() => {
      divElement.textContent = dayjs().format('M月D日 HH:mm:ss');
    }, 1000);

    return event;
  });
})();
