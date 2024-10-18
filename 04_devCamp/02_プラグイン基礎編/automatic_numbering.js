(() => {
  'use strict';

  kintone.events.on('app.record.create.submit', async (event) => {
    const resp = await kintone.api(kintone.api.url('/k/v1/records.json', true), 'GET', {
      app: kintone.app.getId(),
      query: 'order by 社員番号 desc limit 1',
      fields: '社員番号',
    });
    if (resp.records.length > 0) {
      event.record.社員番号.value = (Number(resp.records[0].社員番号.value) + 1)
        .toString()
        .padStart(4, '0');
    } else {
      event.record.社員番号.value = '0001';
    }
    return event;
  });

  kintone.events.on(
    ['app.record.index.edit.show', 'app.record.create.show', 'app.record.edit.show'],
    (event) => {
      event.record.社員番号.disabled = true;
      return event;
    }
  );
})();
