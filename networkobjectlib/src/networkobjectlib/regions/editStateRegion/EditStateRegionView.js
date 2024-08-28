define([
    'jscore/core',
    'template!./_editStateRegion.html',
    'styles!./_editStateRegion.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getSummaryHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-rEditStateRegion-summary');
        },

        getNodesCount: function() {
            return this.getElement().find('.elNetworkObjectLib-rEditStateRegion-summary-nodes-count');
        },

        setNodesCount: function(count) {
            return this.getNodesCount().setText(count);
        },

        getDetailsHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-rEditStateRegion-details');
        }

    });
});
