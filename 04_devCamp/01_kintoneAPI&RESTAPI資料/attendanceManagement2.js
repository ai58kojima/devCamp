(() => {
  'use strict';
  const ATTENDANCE_APP_ID = kintone.mobile.app.getId();

  kintone.events.on('mobile.app.record.index.show', (event) => {
    //◆出勤ボタンを押したとき、時刻を取得する
    document.getElementById('startWork').addEventListener('click', async () => {
      // [test1]console.log(dayjs());
      try {
        await kintone.api('/k/v1/record.json', 'POST', {
          app: ATTENDANCE_APP_ID, //7
          record: {
            社員番号: {
              value: document.getElementById('staffNumber').value,
            },
            出勤時刻: {
              value: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
            },
          },
        });
        // [test2]console.log('record register completed!!');
        location.reload();
      } catch (error) {
        alert('出勤時刻の登録に失敗しました。');
        console.error(error);
      }
    });

    //◆退勤ボタンを押したとき、複数レコードから対象レコードを取得
    document
      .getElementById('finishWork')
      .addEventListener('click', async () => {
        try {
          const response = await kintone.api('/k/v1/records.json', 'GET', {
            app: ATTENDANCE_APP_ID, //7
            query: `社員番号="${
              document.getElementById('staffNumber').value
            }" and 出勤時刻=TODAY()`,
          });
          // [test3]console.log(response);
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
        } catch (error) {
          alert('退勤時刻の登録に失敗しました。');
          console.error(error);
        }
      });

    //◆現在時刻を表示する
    const divElement = document.createElement('div');
    divElement.classList.add('realtime');
    divElement.textContent = dayjs().format('M月D日 HH:mm:ss');

    const header = kintone.mobile.app.getHeaderSpaceElement();
    const attendanceUIArea = document.getElementById('attendanceUIArea');

    if (header && attendanceUIArea) {
      header.insertBefore(divElement, attendanceUIArea);
    }

    setInterval(() => {
      divElement.textContent = dayjs().format('M月D日 HH:mm:ss');
    }, 1000);

    return event;
  });
})();
