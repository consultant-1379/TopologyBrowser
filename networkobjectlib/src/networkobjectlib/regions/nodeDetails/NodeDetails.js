define([
    'jscore/core',
    './NodeDetailsView',
    'widgets/InlineMessage',
], function(core, NodeDetailsView, InlineMessage) {
    'use strict';

    return core.Region.extend({

        View: NodeDetailsView,

        init: function() {
            this.widgets = [];
        },

        showWidgets: function(widgets) {
            this.clearWidgets();

            widgets.forEach(function(w) {
                this.widgets.push(w);
                w.attachTo(this.view.getAttributes());
            }.bind(this));
        },

        clearWidgets: function() {
            while (this.widgets.length > 0) {
                var elem = this.widgets.pop();
                elem.destroy();
            }
        },

        showError: function(header, description) {
            this.showWidgets([
                new InlineMessage({
                    header: header,
                    description: description
                })
            ]);
        }
    });
});
