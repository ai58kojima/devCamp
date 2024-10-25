((PLUGIN_ID) => {
  'use strict';

  //すでに設定されている情報があれば、設定画⾯読み込み時に表⽰する
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  if (!config) {
    window.alert('フラグインの設定の読み込みに失敗しました。');
    window.location.href = `/k/admin/app/${kintone.app.getId()}/plugin/`;
  }
  document.getElementById('appId').value = config.appId || '';

  // 秘匿情報を取得する API kintone.plugin.app.getProxyConfig(url, method)
  //設定情報がある場合は API トークンを表⽰
  const proxyConfig = kintone.plugin.app.getProxyConfig(
    kintone.api.url('/k/v1/record.json'),
    'PUT'
  );
  document.getElementById('token').value = proxyConfig
    ? proxyConfig.headers['X-Cybozu-API-Token']
    : '';

  //「保存する」ボタンをクリックしたときの処理
  document.getElementById('submit').addEventListener('click', () => {
    kintone.plugin.app.setProxyConfig(
      //秘匿情報を保存する API kintone.plugin.app.setProxyConfig(url, method, headers, data, successCallback)
      kintone.api.url('/k/v1/record.json'),
      'PUT',
      { 'X-Cybozu-API-Token': document.getElementById('token').value },
      {},
      () => {
        kintone.plugin.app.setConfig({
          appId: document.getElementById('appId').value,
        });
      }
    );
  });

  //「キャンセル」ボタンをクリックしたときの処理
  document
    .getElementById('cancel')
    .addEventListener('click', () => history.back());
})(kintone.$PLUGIN_ID);
