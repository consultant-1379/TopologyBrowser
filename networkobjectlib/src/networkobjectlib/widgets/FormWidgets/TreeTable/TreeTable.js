/*global define*/
define([
    'jscore/core',
    './TreeTableView',
    'tablelib/Table',
], function(core, View, Table) {
    'use strict';

    return core.Widget.extend({

        View: View,

        onViewReady: function(options) {
            var table = new Table(options);

            if (options.columns[3] && options.columns[3].title === 'Disturbance') {
                this.view.getElement().getNative().style.width = '750px';
            }
            else {
                this.view.getElement().getNative().style.width = '450px';
            }

            table.addEventHandler('tree-table-cell:expand', this.onRowExpand.bind(this));
            table.addEventHandler('tree-table-cell:collapse', this.onRowCollapse.bind(this));

            table.attachTo(this.getElement());
            this.table = table;
        },

        onRowExpand: function(row) {
            if (row.data.children) {
                expandChildren.call(this, row.data, row.index);
            }
        },

        onRowCollapse: function(row) {
            recursiveCollapseChildren.call(this, row.data, row.index);
        }
    });

    function expandChildren(data, index) {
        /* jshint validthis:true */

        function recursiveExpandChildren(data) {
            data.children.forEach(function(child) {

                this.table.addRow(child, ++index);

                if (child.children && child.expanded) {
                    recursiveExpandChildren.call(this, child);
                }
            }.bind(this));
        }

        recursiveExpandChildren.call(this, data);
    }

    function recursiveCollapseChildren(data, index) {
        /* jshint validthis:true */

        data.children.forEach(function(child) {
            this.table.removeRow(index + 1);

            if (child.children && child.expanded) {
                recursiveCollapseChildren.call(this, child, index);
            }
        }.bind(this));
    }

});
