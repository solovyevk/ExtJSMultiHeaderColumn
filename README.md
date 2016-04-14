
ExtJS Plugin for Grid Column to support sortable multiple headers
-----------------------------------------------------------------

**Features:**

* Allow to combine multiple fields in one column with ability to sort on each field.
* Provide default renderer.
* Easily customizable appearance

**Source at GitHub**

[https://github.com/solovyevk/ExtJSMultiHeaderColumn](https://github.com/solovyevk/ExtJSMultiHeaderColumn)



**Demos**

* [Sencha's Fiddle: https://fiddle.sencha.com/#fiddle/18jr](https://fiddle.sencha.com/#fiddle/18jr)
* [Sencha's Fiddle with custom styles: https://fiddle.sencha.com/#fiddle/18ln](https://fiddle.sencha.com/#fiddle/18ln)


**Config object**

* **headers** [Array] array of config objects: header text and model data index to sort on
* **emptyMarker**[String] default output for empty value

**Usage Example**

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
        }
      }

Currently tested with ExtJS 6, 5.1.2



