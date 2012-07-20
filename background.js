Ext.require([
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);

Ext.onReady(function(){
  var store;
  var newstore;

  Ext.define('Book',{
    extend: 'Ext.data.Model',
    fields: [
      {name: 'title', type: 'string',defaultValue:'(タイトル無し)'},
      {name: 'id', type:'string'},
      {name: 'published',type:'date'},
      {name: 'author', mapping:'author > name', type:'string'},
      {name: 'notifyCheck',type:'boolean',defaultValue:false}
    ]
  });

  //配信リストを読み込む。無ければ新たに生成する。
  if(localStorage.LivetubeList){
    store = localStorage.LivetubeList;
  }

  notifyBookmarkLive();

  //RSSの更新、並びに新しい配信が来たら更新する
  function notifyBookmarkLive(){

    //新しく更新したstore。当然storeと構造は同一。
    newstore = Ext.create('Ext.data.Store', {
      model: 'Book',
      autoLoad: true,
      proxy: {
        type: 'ajax',
        url:  'http://livetube.cc/index.live.xml',
        reader: {
          type: 'xml',
          record: 'entry'
        }
      }
    });

    //storeとnewstoreを比較して、store内にあるもので通知済みがある場合はnotifyCheckをtrueにして通知を出さないようにする。
    //リストの重複を検出するのは配信開始時間をキーにしておく。多分かぶらないし。

    //localStorageに放り投げておく
    localStorage.LivetubeList = store;

    /**storeの中でお気に入りの対象者＆未通知のものがある場合通知ウィンドウを出す。
    var notification = webkitNotifications.createNotification(
      'icon.png',  // icon url - can be relative
      'Hello!',  // notification title
      'Lorem ipsum...'  // notification body text
    ).show();*/

    //無限ループで10分ごとにstoreを再構築
    //setInterval("notifyBookmarkLive",  0.25*60000);
  }
});