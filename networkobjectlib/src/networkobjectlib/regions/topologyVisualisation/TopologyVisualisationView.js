/* global define */
define([
    'jscore/core',
    'i18n!networkobjectlib/dictionary.json',
    'template!./_topologyVisualisation.html',
    'styles!./_topologyVisualisation.less'
], function(core,i18n, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getHeader: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyVisualisation-header');
        },

        getTree: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyVisualisation-tree');
        },

        getCollectionTree: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyVisualisation-collectionTree');
        },

        toggleTree: function(tabTitle) {
            var mainFrameNetworkTree = this.getElement().find('.elNetworkObjectLib-rTopologyVisualisation-tree');
            var mainFrameCollectionTree = this.getElement().find('.elNetworkObjectLib-rTopologyVisualisation-collectionTree');
            if (tabTitle === i18n.networkdata) {

                mainFrameNetworkTree.setStyle('display', 'block');
                mainFrameCollectionTree.setStyle('display', 'none');
                window.dispatchEvent(new Event('resize'));


            } else if (tabTitle === i18n.transporttopology) {

                mainFrameCollectionTree.setStyle('display', 'block');
                mainFrameNetworkTree.setStyle('display', 'none');
                window.dispatchEvent(new Event('resize'));
            }
        },
        setErrorMode: function(enabled) {
            if (enabled) {
                this.getHeader().setModifier('hidden');
            } else {
                this.getHeader().removeModifier('hidden');
            }
        },

        setBorderedMode: function(enabled) {
            if (enabled) {
                this.getTree().setModifier('bordered');
                this.getCollectionTree().setModifier('bordered');
            } else {
                this.getTree().removeModifier('bordered');
                this.getCollectionTree().removeModifier('bordered');
            }
        }
    });
});
