define([
    'jscore/core',
    'template!./LabelWidget.html',
    'styles!./LabelWidget.less'
], function(core, template, style) {
    'use strict';
    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getLabel: function() {
            return this.getElement().find('.eaTopologyBrowser-wSupervisionLabelWidget-label');
        },

        setWidth: function(width) {
            this.getElement().find('.eaTopologyBrowser-wSupervisionLabelWidget-label').setStyle('width', width);
        }
    });
});
