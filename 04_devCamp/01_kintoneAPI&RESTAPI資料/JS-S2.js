(() => {
  'use strict';
  kintone.events.on(
    ['app.record.create.submit', 'app.record.edit.submit'],
    (event) => {
      if (Number(event.record.プラン費用.value) > 3000000) {
        event.record.案件規模.value[0] = '大規模案件';
      }
      return event;
    }
  );
})();
