(() => {
  'use strict';
  //追加画面・編集画面を表示した後のイベント
  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show'],
    (event) => {
      event.record.案件規模.disabled = true;
      return event;
    }
  );
})();
