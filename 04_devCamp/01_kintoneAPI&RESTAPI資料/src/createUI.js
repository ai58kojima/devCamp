(() => {
  'use strict';
  // 受講者の「アルバイト一覧」アプリのidの定義
  const STAFF_APP_ID = kintone.mobile.app.getId() + 1;

  /**
   * 社員番号のドロップダウンと出退勤ボタンを作成し、ヘッダーの下側に追加する
   */
  const createUI = async () => {
    // ドロップダウンとボタンを格納するdiv要素の作成
    const div = document.createElement('div');
    div.className = 'div';
    div.id = 'attendanceUIArea';

    // 社員番号のドロップダウンの作成
    const staffNumberList = document.createElement('select');
    staffNumberList.id = 'staffNumber';

    // ドロップダウンのタイトルの作成
    const titleOption = document.createElement('option');
    titleOption.textContent = '社員番号を選択してください';
    titleOption.disabled = true;
    titleOption.selected = true;
    staffNumberList.add(titleOption);

    // 「アルバイト一覧」アプリから社員番号の取得
    const resp = await kintone.api('/k/v1/records.json', 'GET', {
      app: STAFF_APP_ID,
      query: 'order by 社員番号 asc',
      fields: ['社員番号', '氏名'],
    });

    // ドロップダウンの選択肢の作成と取得した社員番号を選択肢へ代入
    resp.records.forEach((record) => {
      const option = document.createElement('option');
      option.value = record.社員番号.value;
      option.text = `【${record.社員番号.value}】 ${record.氏名.value}`;
      staffNumberList.add(option);
    });

    // ドロップダウンをdiv要素へ格納
    div.appendChild(staffNumberList);

    // 出勤ボタンの作成
    const startWorkButton = document.createElement('button');
    startWorkButton.id = 'startWork';
    startWorkButton.className = 'button';
    startWorkButton.textContent = '出勤';
    div.appendChild(startWorkButton);

    // 退勤ボタンの作成
    const finishWorkButton = document.createElement('button');
    finishWorkButton.id = 'finishWork';
    finishWorkButton.className = 'button';
    finishWorkButton.textContent = '退勤';
    div.appendChild(finishWorkButton);

    // div要素をモバイルのレコード一覧画面のヘッダーの下側へ追加
    kintone.mobile.app.getHeaderSpaceElement().appendChild(div);
  };

  kintone.events.on('mobile.app.record.index.show', async (event) => {
    // 増殖バグを防ぐ
    if (document.getElementById('attendanceUIArea') !== null) return;

    // 社員番号を選択するためのドロップダウンと出退勤ボタンの作成
    await createUI();

    return event;
  });
})();
