define([
    'jscore/core',
    'template!./ListWidgetContainer.html',
    'styles!./ListWidgetContainer.less',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, style,i18n) {

    return core.View.extend({

        getTemplate: function() {
            return template({
                newEntry: i18n.addNewEntry
            });
        },

        getStyle: function() {
            return style;
        },

        getContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-listWidgetContainer-container');
        },

        getPlusButton: function() {
            return this.getElement().find('.elNetworkObjectLib-listWidgetContainer-button');
        }
    });
});




