define([
    'test/resources/BitUtils'
], function(promises) {

    var TIMEOUT = 500;

    /**
     * Helper methods for the Collection Selector Region
     * Extends bitPromises.js
     */
    return {

        getNodeRootItems: function() {
            return promises.waitForElementVisible('.elDataviz-Item', TIMEOUT);
        },

        expandItem: function(index) {
            document.querySelectorAll('.elDataviz-Item-expander')[index].click();
        },

        getSelectedNodeRootItems: function() {
            return promises.waitForElementVisible('.elDataviz-Item_selected', TIMEOUT);
        },

        getTreeItems: function() {
            return promises.waitForElementVisible('.elNetworkObjectLib-NodeItem', TIMEOUT);
        },

        getActionsErrorDialog: function() {
            return promises.waitForElementVisible('.ebDialogBox', TIMEOUT);
        },

        getActionsErrorDialogText: function() {
            return promises.waitForElementVisible('.ebDialogBox-primaryText', TIMEOUT);
        },

        getSelectedObjectCount: function() {
            return promises.waitForElementVisible('.elNetworkObjectLib-rTopologyHeader-selected', TIMEOUT);
        }

    };
});
