((PLUGIN_ID) => {
  'use strict';

  //「保存する」ボタンをクリックしたときの処理
  document.getElementById('submit').addEventListener('click', () => {
    //プラグインの設定情報(アプリID)を保存する -https://cybozu.dev/ja/id/db07deb5730bc862595b708b/#set-config
    kintone.plugin.app.setConfig({
      appId: document.getElementById('appId').value,
    });
  });

  //「キャンセル」ボタンをクリックしたときの処理
  document.getElementById('cancel').addEventListener('click', () => {
    //前のページに遷移する
    history.back();
  });

  //すでに設定されている情報があれば、設定画⾯読み込み時に表⽰する
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) {
    window.alert('プラグインの設定の読み込みに失敗しました。');
    window.location.href = `/k/admin/app/${kintone.app.getId()}/plugin/`;
  }
  document.getElementById('appId').value = config.appID || '';
})(kintone.$PLUGIN_ID);
