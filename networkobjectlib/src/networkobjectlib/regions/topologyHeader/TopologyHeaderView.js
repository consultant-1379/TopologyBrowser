/* global define */
define([
    'jscore/core',
    'template!./_topologyHeader.html',
    'styles!./_topologyHeader.less'
], function(core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getDropdown: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-selected-dropdown');
        },

        getLinebar: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-selected-bar').setText('\xa0\xa0'+'|'+'\xa0');
        },

        getSelectedText: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-selected-text');
        },

        getSelectedNum: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-selected-num');
        },

        getClearSelectionLink: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-clearSelection-Link');
        },

        getClearSelection: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-clearSelection');
        },

        showClearSelection: function() {
            this.getClearSelection().removeStyle('display');
        },

        hideClearSelection: function() {
            this.getClearSelection().setStyle('display', 'none');
        },

        getFindButton: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-find-button');
        },

        getRefreshButton: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-refresh-button');
        },

        getFindSpan: function() {
            return this.getElement().find('.elNetworkObjectLib-rTopologyHeader-find');
        }
    });
});
