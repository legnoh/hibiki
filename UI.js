Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);


Ext.onReady(function(){
    Ext.QuickTips.init();
    var LivetubeAlert = {name:['ママは小学５年生','八雲紫ちゃん','黒銀月']};

    //通知リストを読込む。無ければ今設定した内容で通知リストのJSONを作る。
    if (localStorage.LivetubeAlert){
      //LivetubeAlert = JSON.parse(localStorage.LivetubeAlert);
      localStorage.LivetubeAlert = JSON.stringify(LivetubeAlert);
    }else {
      localStorage.LivetubeAlert = JSON.stringify(LivetubeAlert);
    }

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

    var store = Ext.create('Ext.data.Store', {
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
    localStorage.LivetubeList = store;

    var grid = Ext.create('Ext.grid.Panel', {
        store: store,
        columns: [{
            text: "タイトル",
            width: 300,
            dataIndex: 'title',
            sortable: true,
            renderer:function(value,p,record) {
              return '<a href="'+record.internalId+'"target="_blank">'+value+'</a>';
            }
        },{
            text: "配信者",
            width: 100,
            dataIndex: 'author',
            sortable: true,
        },{
            menuDisabled: true,
            sortable: true,
            xtype: 'actioncolumn',
            width: 20,
            items: [{
                getClass: function(v, meta, rec) {
                    var flag = 0;
                    for(var i in LivetubeAlert.name){
                      if (rec.data.author == LivetubeAlert.name[i]) {
                        this.items[0].tooltip = 'この配信者をお気に入りから削除';
                        flag = 1;
                        return 'del-col';
                        break;
                      }
                    }
                    if(!flag){
                      this.items[0].tooltip = 'この配信者をお気に入りに追加';
                      return 'add-col';
                    }
                },
                handler: function(grid, rowIndex, colIndex) {
                    var rec = store.getAt(rowIndex);
                    alert((rec.get('change') < 0 ? "Hold " : "Buy ") + rec.get('company'));
                }
            }]
        },{
            text: "日時",
            dataIndex: 'published',
            sortable: true,
            renderer : Ext.util.Format.dateRenderer('m/d G:i:s'),
        }],
        renderTo:'grid',
        width: 600,
        height: 560
    });
});