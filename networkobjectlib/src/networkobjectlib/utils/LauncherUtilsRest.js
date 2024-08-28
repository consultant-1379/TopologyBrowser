define([
    'jscore/core',
    './net',
    './customError'
], function(core, net, customError) {

    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     *  {Object} - config - configuration object (ex: to identify the request)
     */
    return {

        /**
         * Checks if the collection(s) have children before proceeding with the alarmmonitor-remote-show action.
         * @param collectionIds - list of ids of the selected collections e.g. ['1000', '1001', '1002']
         * @returns {Promise<{objects: boolean}>}
         */
        checkCollectionHasNodes: function(collectionIds) {
            return net.ajax({
                url: 'object-configuration/collections/v4/contain-node',
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(collectionIds)
            }).then(function(response) {
                return response.data;
            }).catch(function(error) {
                throw new customError.getError(error.data.internalErrorCode, error.data.title);
            });
        },

    };
});
