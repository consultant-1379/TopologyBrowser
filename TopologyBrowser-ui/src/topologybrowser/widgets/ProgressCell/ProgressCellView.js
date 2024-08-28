define([
    'jscore/core',
], function(core) {
    'use strict';
    return core.View.extend({
        getLabel: function() {
            return this.getElement().find('.eaTopologyBrowser-wSupervisionLabelWidget-label');
        },

        getButton: function() {
            return this.getElement().find('.ebBtn_color_default');
        },

        getNotification: function() {
            return this.getElement().find('.ebNotification');
        }
    });
});