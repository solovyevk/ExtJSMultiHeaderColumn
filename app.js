Ext.define('Task', {
  extend: 'Ext.data.Model',
  idProperty: 'taskId',
  fields: [
    {name: 'projectId', type: 'int'},
    {name: 'employee', type: 'string'},
    {name: 'project', type: 'string'},
    {name: 'description', type: 'string'},
    {name: 'estimate', type: 'float'},
    {name: 'rate', type: 'float'},
    {
      name: 'cost', type: 'float', calculate: function (data) {
      return data.estimate * data.rate;
    }
    },
    {name: 'testDate', type: 'date', dateFormat: 'm/d/Y'},
    {name: 'dueDate', type: 'date', dateFormat: 'm/d/Y'},
    {name: 'startDate', type: 'date', dateFormat: 'm/d/Y'}
  ]
});

Ext.application({
  name: 'Fiddle',

  launch: function () {
    Ext.create('Ext.container.Viewport', {
      layout: {
        type: 'fit'

      },
      items: {
        xtype: 'grid',
        title: 'Sponsored Projects',
        cls: 'project-grid',
        store: Ext.create('Ext.data.Store', {
          model: 'Task',
          proxy: {
            type: 'ajax',
            url: 'task.json'
          },
          autoLoad: true,
          sorters: {property: 'due', direction: 'ASC'}
        }),
        columns: [
          {
            header: 'ID',
            dataIndex: 'projectId',
            width: 60
          },
          {
            header: 'Employee',
            dataIndex: 'employee',
            flex: 1.5
          },
          {
            plugins: {
              ptype: 'multiheadercolumn',
              headers: [
                {text: 'Project', dataIndex: 'project'},
                {text: 'Description', dataIndex: 'description'}
              ]
            },
            flex: 3,
            width: 180
          },
          {
            xtype: 'datecolumn',
            format: 'm/d/Y',
            plugins: {
              ptype: 'multiheadercolumn',
              headers: [
                {text: 'Start Date', dataIndex: 'startDate'},
                {text: 'Test Date', dataIndex: 'testDate'},
                {text: 'Due Date', dataIndex: 'dueDate'}
              ],
              emptyMarker: '-'
            },
            width: 130
          },
          {
            plugins: {
              ptype: 'multiheadercolumn',
              headers: [
                {text: 'Estimate', dataIndex: 'estimate'},
                {text: 'Rate', dataIndex: 'rate'},
                {text: 'Cost', dataIndex: 'cost'}
              ]
            },
            header: 'Estimate',
            width: 110,
            sortable: true,
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
              var estimate = record.get('estimate') + ' hours',
                  rate = Ext.util.Format.usMoney(record.get('rate')),
                  cost = Ext.util.Format.usMoney(record.get('cost'));
              return estimate + '</br>' + rate + '</br>' + cost
            }
          }
        ]
      }
    });
  }
});