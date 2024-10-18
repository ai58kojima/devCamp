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
        window.alert('今日も一日頑張りましょう！！');
      } catch (error) {
        alert('社員番号を選択してください♪');
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
          window.alert('今日も一日お疲れ様でした！！');
        } catch (error) {
          alert('社員番号を選択してください♪');
          console.error(error);
        }
      });

    //◆休憩開始ボタン
    const restStartButton = document.createElement('button');
    attendanceUIArea.appendChild(restStartButton);
    restStartButton.classList.add('button');
    restStartButton.id = 'restStartButton';
    restStartButton.innerText = '休憩開始';

    //休憩開始ボタン押下時のアクション
    document
      .getElementById('restStartButton')
      .addEventListener('click', async () => {
        try {
          const response = await kintone.api('/k/v1/records.json', 'GET', {
            app: ATTENDANCE_APP_ID,
            query: `社員番号="${
              document.getElementById('staffNumber').value
            }" and 出勤時刻=TODAY()`,
          });

          if (
            response.records[0].休憩開始.value == '' &&
            response.records[0].休憩終了.value == '' &&
            response.records[0].退勤時刻.value == ''
          ) {
            await kintone.api('/k/v1/record.json', 'PUT', {
              app: ATTENDANCE_APP_ID,
              id: response.records[0].$id.value,
              revision: response.records[0].$revision.value,
              record: {
                休憩開始: {
                  value: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
                },
              },
            });
            window.alert('休憩いってらっしゃい');
          } else {
            window.alert(
              'レコードを確認してください！\nすでに休憩終了しているか、退勤している可能性があります。'
            );
          }
          location.reload();
        } catch (error) {
          alert('社員番号を選択してください♪');
          console.error(error);
        }
      });

    //◆休憩終了ボタン
    const restFinishButton = document.createElement('button');
    attendanceUIArea.appendChild(restFinishButton);
    restFinishButton.classList.add('button');
    restFinishButton.id = 'restFinishButton';
    restFinishButton.innerText = '休憩終了';

    //休憩終了ボタン押下時のアクション
    document
      .getElementById('restFinishButton')
      .addEventListener('click', async () => {
        try {
          const response = await kintone.api('/k/v1/records.json', 'GET', {
            app: ATTENDANCE_APP_ID,
            query: `社員番号="${
              document.getElementById('staffNumber').value
            }" and 出勤時刻=TODAY()`,
          });

          if (
            response.records[0].休憩終了.value == '' &&
            response.records[0].退勤時刻.value == ''
          ) {
            await kintone.api('/k/v1/record.json', 'PUT', {
              app: ATTENDANCE_APP_ID,
              id: response.records[0].$id.value,
              revision: response.records[0].$revision.value,
              record: {
                休憩終了: {
                  value: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
                },
              },
            });
            window.alert('休憩おかえりなさい');
          } else {
            window.alert(
              'レコードを確認してください！\nすでに退勤している可能性があります。'
            );
          }
          location.reload();
        } catch (error) {
          alert('社員番号を選択してください♪');
          console.error(error);
        }
      });

    //追加機能[1]◆現在時刻を表示する
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
  //追加機能[2]◆出勤・退勤時刻の上書き
  //追加機能[3]◆分かりやすいUIにする
})();
