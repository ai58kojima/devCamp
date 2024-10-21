((PLUGIN_ID) => {
  'use strict';

  //すでに設定されている情報があれば、設定画⾯読み込み時に表⽰する
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) {
    window.alert('フラグインの設定の読み込みに失敗しました。');
    window.location.href = `/k/admin/app/${kintone.app.getId()}/plugin/`;
  }
  document.getElementById('appId').value = config.appId || '';

  //「保存する」ボタンをクリックしたときの処理
  document.getElementById('submit').addEventListener('click', () => {
    kintone.plugin.app.setConfig({
      appId: document.getElementById('appId').value,
    });
  });

  //「キャンセル」ボタンをクリックしたときの処理
  document
    .getElementById('cancel')
    .addEventListener('click', () => history.back());
})(kintone.$PLUGIN_ID);
