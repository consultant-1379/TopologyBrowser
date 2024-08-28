define([
    'jscore/core',
    'template!./SupervisionWidget.html',
    'styles!./SupervisionWidget.less'
], function(core, template, style) {
    'use strict';
    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },
        getStyle: function() {
            return style;
        },
        getInfoValue: function() {
            return this.getElement().find('.eaTopologyBrowser-clear-button');
        },
        getProgress: function() {
            return this.getElement().find('.eaTopologyBrowser-getProgressBar');
        },
        getEmptyMessage: function() {
            return this.getElement().find('.eaTopologyBrowser-getEmptyMessage');
        },
    });
});
