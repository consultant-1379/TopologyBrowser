define([
    'jscore/core',
    'template!./ResultCell.html',
    'styles!./ResultCell.less'
], function(core, template, style) {
    'use strict';
    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getCaption: function() {
            return this.getElement().find('.eaTopologyBrowser-wResultCell-caption');
        },

        getIcon: function() {
            return this.getElement().find('.eaTopologyBrowser-wResultCell-icon');
        }
    });
});
