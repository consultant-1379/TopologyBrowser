define([
    'jscore/core',
    './MoTypeDetails'
], function(core, MoTypeDetails) {
    'use strict';

    return core.Widget.extend({

        View: core.View.extend({
            getTemplate: function() {
                return '<div style="height: 100%; width: 100%"></div>';
            }
        }),

        onViewReady: function() {
            this.moTypeDetails = new MoTypeDetails({
                context: this.options.context,
            });
            this.moTypeDetails.start(this.getElement());
        },

        requestMoAttributes: function(poId, includeAllAttributes, nodeClicked) {
            this.moTypeDetails.requestMoAttributes(poId, includeAllAttributes, nodeClicked);
        },

        clearAttributesPanel: function() {
            this.moTypeDetails.clearAttributesPanel();
        },

        showMessage: function(obj, icon) {
            this.moTypeDetails.showMessageArea(obj, icon);
        }
    });
});
