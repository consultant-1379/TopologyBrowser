define([
    'jscore/core',
    './NodeDetails',
], function(core, NodeDetails) {
    'use strict';

    return core.Widget.extend({

        View: core.View.extend({
            getTemplate: function() {
                return '<div style="height: 100%"></div>';
            }
        }),

        onViewReady: function() {
            this.nodeDetails = new NodeDetails({
                context: this.options.context,
            });

            this.nodeDetails.start(this.getElement());
        },

        showWidgets: function(attributes) {
            return this.nodeDetails.showWidgets(attributes);
        },

        showError: function(header, description) {
            return this.nodeDetails.showError(header, description);
        }
    });
});
