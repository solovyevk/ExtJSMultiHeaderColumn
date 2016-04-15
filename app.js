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
      name: 'cost', type: 'float', convert: function (v, record) {
      return record.get('estimate') * record.get('rate');
    }
    },
    {name: 'testDate', type: 'date', dateFormat: 'm/d/Y'},
    {name: 'dueDate', type: 'date', dateFormat: 'm/d/Y'},
    {name: 'startDate', type: 'date', dateFormat: 'm/d/Y'}
  ]
});

Ext.define('TestSortStore', {
  extend: 'Ext.data.Store',
  sort: function () {
    var me = this;
    Ext.log('sort call');
    me.callParent(arguments);
  }

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
        store: Ext.create('TestSortStore', {
          model: 'Task',
         data:[
           {
             "projectId": 100,
             "employee":"Kirill Solovyev",
             "project": "Ext Forms - New Layouts",
             "taskId": 112,
             "description": "Integrate 2.0 Forms with 2.0 Layouts",
             "estimate": 6,
             "rate": 200,
             "testDate": "05/15/2007",
             "startDate": "03/13/2007",
             "dueDate": "06/24/2007"
           },
           {
             "projectId": 101,
             "employee":"John Smith",
             "project": "Field Anchoring",
             "taskId": 113,
             "description": "Implement AnchorLayout",
             "estimate": 5,
             "rate": 150,
             "testDate": "06/01/2007",
             "startDate": "03/10/2007",
             "dueDate": "06/25/2007"
           },
           {
             "projectId": 102,
             "employee":"Michael Kong",
             "project": "Extension of Field Anchoring",
             "taskId": 114,
             "description": "Add support for multiple types of anchors",
             "estimate": 4,
             "rate": 150,
             "startDate": "02/21/2007",
             "dueDate": "06/27/2007"
           },
           {
             "projectId": 103,
             "employee":"Tom Hawkins",
             "project": "Test new features",
             "taskId": 115,
             "description": "Testing and debugging",
             "estimate": 10,
             "rate": 75,
             "startDate": "01/04/2007",
             "dueDate": "06/29/2007"
           },
           {
             "projectId": 104,
             "employee":"John Doe",
             "project": "Maven Integration",
             "taskId": 116,
             "description": "Automatic build and deployment task",
             "estimate": 8,
             "rate": 105,
             "startDate": "01/09/2007",
             "dueDate": "08/29/2007"
           }
         ]
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
            renderer: function (value, metaData, record) {
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