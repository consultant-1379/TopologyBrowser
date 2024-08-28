define([
    'jscore/core',
    './ProgressDetailsTableView',
    'tablelib/Table',
    'tablelib/plugins/SmartTooltips',
    '../IconCell/IconCell'
], function(core, View, Table, SmartTooltips, IconCell) {
    'use strict';
    /*jshint validthis:true */
    return core.Widget.extend({

        events: {
            PROGRESS_DETAILS_UPDATE: 'progress-details:update'
        },

        view: function() {
            return new View(this.options);
        },

        init: function(options) {
            // From options
            this.dictionary = options.dictionary;
            this.items = options.items;
            this.stateDefinitions = options.stateDefinitions;
            // Internal state objects
            this.lookupRow = {}; // populate when adding to table
            this.lookupIcons = {};
            Object.keys(this.stateDefinitions).forEach(function(key) {
                this.lookupIcons[key] = this.stateDefinitions[key].icon;
            }.bind(this));
            // Handlers
            this.addEventHandler(this.PROGRESS_DETAILS_UPDATE, this.onProgressDetailsUpdate, this);
        },

        onViewReady: function() {

            this.table = new Table({
                columns: [
                    {
                        title: this.dictionary.name,
                        attribute: 'name',
                        width: '150px',
                        resizable: true
                    },
                    {
                        title: this.dictionary.result,
                        attribute: 'result',
                        resizable: true,
                        cellType: IconCell
                    }
                ],
                modifiers: [
                    {name: 'borderTop', value: 'none'},
                    {name: 'verticalBorders', value: 'none'}
                ],
                plugins: [
                    new SmartTooltips()
                ]
            });
            this.items.forEach(function(item, i) {
                var name = item.name;
                this.table.addRow({
                    name: name,
                    result: {
                        ebIconClass: item.icon,
                        caption: item.message
                    }
                });
                this.lookupRow[name] = i;
            }.bind(this));
            this.table.attachTo(this.view.getTable());
        },

        /**
         * When the parent region sends an update, update the table rows
         *
         * @param progressEvent
         */
        onProgressDetailsUpdate: function(progressEvent) {
            var icon = this.lookupIcons[progressEvent.state];
            if (icon) {
                progressEvent.icon = 'ebIcon_' + icon;
            } else {
                progressEvent.icon = '';
            }
            updateRow.call(this, progressEvent);
        }

    });

    function updateRow(event) {
        var tableRows = this.table.getRows();
        var rowToUpdate = tableRows[this.lookupRow[event.name]];
        var rowCells = rowToUpdate.getCells();
        rowCells[1].setValue({
            ebIconClass: event.icon,
            caption: event.message
        });
    }
});
