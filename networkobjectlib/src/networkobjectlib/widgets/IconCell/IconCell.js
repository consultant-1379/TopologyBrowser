define([
    'tablelib/Cell',
    './IconCellView'
], function(Cell, View) {
    'use strict';

    /*
     * An cell with an icon and a description: [x] Hello!
     *
     * To use, import the widget and within a Table widget's column definition object, set cellType to IconCell
     * i.e. {title: 'Icon and Caption', attribute: 'myColumn', cellType: IconCell}
     * Then, whenever you're setting a row's data, pass it an object of this format:
     * {ebIconClass: 'ebIcon_error', caption: 'Hello!'}
     * i.e. this.myTable.addRow({col1: 'some data', myColumn: {ebIconClass: 'ebIcon_error', message: 'Hello!'}});
     */
    return Cell.extend({

        init: function(options) {
            this.options = options;
        },

        View: View,

        setValue: function(value) {
            this.view.setIcon(value.ebIconClass);
            this.view.setCaption(value.caption);
            this.getRow().getData()[this.getColumnDefinition().attribute] = value.caption;
        }
    });
});
