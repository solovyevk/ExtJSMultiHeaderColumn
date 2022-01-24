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
        emptyMarker = me.emptyMarker || '&nbsp;';
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
    if (!column.renderer || column.usingDefaultRenderer) {
      column.renderer = function (value, metadata, record, rowIndex, colIndex, store, view) {
        var i, currentValue, ret = '', header, count = me.headers.length;
        if (me.isEmpty && me.isEmpty(record, rowIndex, colIndex, store, view)) {
          return '';
        }
        if (count > 1) {
          metadata.tdCls = 'multi-value-grid-cell'
        }
        if (me.columnMetadataCustomizer) {
          me.columnMetadataCustomizer(metadata, record, rowIndex, colIndex, store, view);
        }
        for (i = 0; i < count; i++) {
          header = me.headers[i];
          currentValue = record.get(header.dataIndex);
          if (header.renderer) {
            currentValue = header.renderer.call(column, currentValue, metadata, record, rowIndex, colIndex, store, view);
          } else if (column.defaultRenderer && column.defaultRenderer.call) {
            currentValue = column.defaultRenderer.call(column, currentValue);
          }
          if (currentValue === undefined || currentValue === null || currentValue === '') {
            currentValue = emptyMarker;
          }
          // ret = ret + '<div class="multiline-grid-cell' + (i === 0 ? '-first' : i === count - 1 ? '-last' : '') + '">' + currentValue + '</div>'
          if (i > 0) {
            ret = ret + '<br/>';
          }
          ret = ret + currentValue;
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
    //need to replace column sortZone with below after 6 to 7 migration
    column.isSortZone = function(e) {
      var me = this;
      return !me.isAtStartEdge(e) && !me.isAtEndEdge(e);
    };
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
