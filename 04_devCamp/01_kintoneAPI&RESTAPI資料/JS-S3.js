(() => {
  'use strict';

  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], () => {
    // ボタンを生成して、スペースフィールドに配置する
    const button = document.createElement('button');
    button.textContent = '追加';
    kintone.app.record.getSpaceElement('space').appendChild(button);

    button.onclick = () => {
      // レコードを取得する
      const record = kintone.app.record.get();
      const startDate = dayjs(record.record.開始日.value) || dayjs();
      record.record.table.value = [];

      const maxLength = 7;
      for (let i = 0; i < maxLength; i++) {
        record.record.table.value.push({
          value: {
            作業日: {
              type: 'DATE',
              // startDate に i 日を足して、日付フォーマットを 'YYYY-MM-DD' に変更する
              value: startDate.add(i, 'day').format('YYYY-MM-DD'),
            },
            作業内容: { type: 'MULTI_LINE_TEXT', value: '' },
          },
        });
      }

      // レコードを更新する
      kintone.app.record.set(record);
    };
  });
})();
