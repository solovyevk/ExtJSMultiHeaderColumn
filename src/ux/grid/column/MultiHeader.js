Ext.define('Ext.ux.grid.column.MultiHeader', {
  extend: 'Ext.plugin.Abstract',
  alias: 'plugin.multiheadercolumn',

  hoverMultipleHeaderCls: Ext.baseCSSPrefix + 'column-header-text-multipleHeader-over',

  /**
     * @cfg {Array} headers
     * Array of config objects: header text and model data index to sort on
     */

  /**
     * @cfg {String} emptyMarker
     * Default output for empty value
     */


  init: function (column) {
    var me = this,
        emptyMarker = me.emptyMarker || '-';
    me.column = column;
    column.on('render', me.onColumnRender, me, {single: true});
    column.onTitleElClick = Ext.Function.createInterceptor(column.onTitleElClick, function (e, t, sortOnClick) {
      var target = me.getMultiHeaderDomByEvent(e);
      if (sortOnClick !== false && target) {
        var allHeaders = this.textEl.query('div.x-column-header-text-multipleHeader'),
            i;
        for (i = 0; i < allHeaders.length; i++) {
          var obj = allHeaders[i],
              objSpanElement = Ext.fly(obj.lastChild);
          objSpanElement.removeCls('x-column-header-text-inner');
          if (obj === target) {
            this.dataIndex = objSpanElement.getAttribute('data-index');
            objSpanElement.addCls('x-column-header-text-inner');
          }
          objSpanElement = null;
        }
      }
      return true;
    }, column);
    //setup renderer
    if(!column.renderer || column.usingDefaultRenderer){
      column.renderer =  function(value, metadata, record){
        var i, currentValue, ret='';
        for (i = 0; i < me.headers.length; i++) {
          currentValue = record.get(me.headers[i].dataIndex);
          if(currentValue === undefined || currentValue === null || currentValue ===''){
            currentValue = emptyMarker;
          }else if(column.defaultRenderer && column.defaultRenderer.call){
            currentValue = column.defaultRenderer.call(column, currentValue);
          }
          ret = ret + currentValue + '<br/>'
        }
        return ret;
      }
    }
  },

  onColumnRender: function () {
    var me = this, listeners, column = me.column;
    listeners = {
      destroyable: true,
      mouseover: me.onMultiHeaderMouseEnter,
      mouseout: me.onMultiHeaderMouseLeave,
      scope: me
    };
    me.listeners = column.mon(column.textEl, listeners);
    column.textEl.empty();
    me.multipleHeadersCmp = Ext.create('Ext.Component', {
      renderTo: column.textEl,
      renderTpl: [
        '<tpl for="multipleHeaders">',
        '<div role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-multipleHeader">',
        '<span data-index="{dataIndex}" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-text-inner">{text}</span>',
        '</div>',
        '</tpl>'
      ],
      renderData: {
        multipleHeaders: me.headers
      }
    });
    //delete me.headers;
  },

  destroy: function () {
    var me = this;
    Ext.destroy(me.listeners, me.multipleHeadersCmp);
    me.column = me.listeners = me.multipleHeadersCmp = null;
    me.callParent();
  },

  getMultiHeaderDomByEvent: function (e) {
    return e.getTarget('div.x-column-header-text-multipleHeader');
  },

  onMultiHeaderMouseEnter: function (event) {
    this.onMultipleHeaderMouseOverOut(event, true);
  },

  onMultiHeaderMouseLeave: function (event) {
    this.onMultipleHeaderMouseOverOut(event, false);
  },

  onMultipleHeaderMouseOverOut: function (event, over) {
    var me = this,
        target = me.getMultiHeaderDomByEvent(event);
    if (target) {
      if (over) {
        Ext.fly(target).addCls(me.hoverMultipleHeaderCls);
      } else {
        Ext.fly(target).removeCls(me.hoverMultipleHeaderCls);
      }
    }
  }
});
