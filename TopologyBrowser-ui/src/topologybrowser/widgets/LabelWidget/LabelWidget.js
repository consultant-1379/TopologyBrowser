define([
    'jscore/core',
    './LabelWidgetView'
], function(core, View) {
    'use strict';
    return core.Widget.extend({
        View: View,

        init: function(options) {
            this.options = options;
        },

        onViewReady: function() {
            this.setLabel(this.options.label);
            this.setWidth(this.options.width);
        },

        setLabel: function(label) {
            this.view.getLabel().setText(label);
        },

        setWidth: function(width) {
            this.view.setWidth(width);
        }
    });
});
