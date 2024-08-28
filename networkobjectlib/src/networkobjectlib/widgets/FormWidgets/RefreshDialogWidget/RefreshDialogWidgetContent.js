define([
    'widgets/WidgetCore',
    './RefreshDialogWidgetContentView',
    'tablelib/plugins/ResizableHeader',
    'tablelib/Table',
    'widgets/Accordion',
    'i18n!networkobjectlib/dictionary.json'
], function(WidgetCore, ContentView, ResizableHeader, Table, Accordion, i18n) {
    'use strict';

    return WidgetCore.extend({

        View: ContentView,

        setData: function(data) {
            if (this.table && this.accordion) {
                this.table.destroy();
                this.accordion.destroy();
            }
            this.view.setRefreshMessage();
            var table = new Table({
                plugins: [
                    new ResizableHeader()
                ],
                modifiers: [
                    {name: 'striped'}
                ],
                data: data,
                columns: [
                    {title: i18n.refreshInfo.table.label, attribute: 'label', width: '223px', resizable: true},
                    {title: i18n.refreshInfo.table.type, attribute: 'type', width: '224px', resizable: true},
                ],
            });

            var accordion = new Accordion({
                title: i18n.refreshInfo.tableTitle + ' (' + data.length + ')',
                content: table
            });

            accordion.attachTo(this.getElement());

            this.accordion = accordion;
            this.table = table;
        }
    });
});
