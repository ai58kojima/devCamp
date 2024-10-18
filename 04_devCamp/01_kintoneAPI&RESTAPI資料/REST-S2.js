(() => {
  'use strict';

  kintone.events.on('app.record.create.show', (event) => {
    // 顧客管理アプリに登録するボタンを作成
    const space = kintone.app.record.getSpaceElement('space');
    const button = document.createElement('button');
    button.textContent = '顧客管理アプリに登録';

    // ボタンクリックで顧客管理アプリにレコード登録
    button.onclick = async () => {
      const customerRecord = kintone.app.record.get(); // 表示している案件管理アプリのレコードを取得
      const customerName = customerRecord.record.顧客名.value;

      // 顧客名が空の場合はアラートを表示して処理終了
      if (!customerName) {
        window.alert('顧客名を入力してください');
        return;
      }

      try {
        // 顧客管理アプリへレコードを登録
        await kintone.api(kintone.api.url('/k/v1/record.json', true), 'POST', {
          app: kintone.app.getId() - 1, // 顧客管理のアプリID
          record: {
            顧客名: {
              value: customerName,
            },
          },
        });

        customerRecord.record.顧客名.lookup = true; // 案件に紐づく顧客を自動ルックアップ
        kintone.app.record.set(customerRecord); // レコードに値をセット

        window.alert('顧客管理アプリに登録しました');
      } catch (error) {
        console.log(error.message);
      }
    };

    space.appendChild(button);
  });
})();
