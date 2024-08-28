define([
    'jscore/core',
    'text!./TopologyTree.html',
    'styles!./TopologyTree.less'
], function(core, template, style) {
    return core.View.extend({

        /* @desc default method to get the html template associated with the view defined above */
        getTemplate: function() {
            return template;
        },

        /* @desc default method to get access to the style defined above */
        getStyle: function() {
            return style;
        },

        getTree: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyTree-treeObject');
        },

        getTopology: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyTree');
        },

        getErrorMessageArea: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyTree-messageArea');
        },

        getItemFromEvent: function(event) {
            return event.originalEvent.target.closest('.elNetworkObjectLib-NodeItem');
        },

        getVisualisation: function() {
            return this.getElement().find('.elDataviz-Tree');
        }
    });
}
);
