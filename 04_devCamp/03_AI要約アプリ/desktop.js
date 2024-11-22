(() => {
  'use strict';

  kintone.events.on('app.record.detail.show', (event) => {
    // KUC のボタンを作成してスペースフィールドに追加する
    const requestButton = new Kuc.Button({
      text: '要約する',
      type: 'submit',
    });
    kintone.app.record.getSpaceElement('request').appendChild(requestButton);
    // スピナーのインスタンス生成
    const spinner = new Kuc.Spinner({
      text: '要約中…',
    });
    // ボタンを押すとAPIを実行する
    requestButton.onclick = async () => {
      try {
        spinner.open();
        // kintone.proxy を使って外部 API を実行する
        const [body, ...rest] = await kintone.proxy(
          'https://asia-northeast2-alert-tine-442405-a2.cloudfunctions.net/kintone-openAi',
          'POST',
          { 'Content-Type': 'application/json' },
          { prompt: event.record.プロンプト.value }
        );
        const parsedBody = JSON.parse(body);

        // 外部APIを実行したレスポンスをもとにレコードを更新する
        await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', {
          app: kintone.app.getId(),
          id: kintone.app.record.getId(),
          record: {
            結果: {
              value: parsedBody.response,
            },
            入力トークン: {
              value: parsedBody.usage.prompt_tokens,
            },
            出力トークン: {
              value: parsedBody.usage.completion_tokens,
            },
          },
          revision: event.record.$revision.value,
        });
        spinner.close();
        location.reload();
      } catch (error) {
        console.error(error);
        window.alert('リクエストに失敗しました。');
        spinner.close();
      }
    };
    return event;
  });
})();
