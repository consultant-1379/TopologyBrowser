define([
    'jscore/core',
    'text!./ListWidgetElement.html',
    'styles!./ListWidgetElement.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getDelete: function() {
            return this.getElement().find('.elNetworkObjectLib-formWidgets-listWidgetElement-delete');
        },

        getListWidgetContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-formWidgets-listWidgetElement-widgetContainer');
        }
    });

});
