define([
    'jscore/core',
    '../../utils/net',
    'networkobjectlib/utils/customError'
], function(core, net, customError) {
    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     *  {Object} - config - configuration object (ex: to identify the request)
     */
    return {
        getPOByQueryStringCustomTopology: function(selectedTopologyId, queryStr) {
            return net.ajax({
                url: '/object-configuration/collections/v4/search/' + selectedTopologyId + '?query=' + queryStr,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json'
            }).then(function(response) {
                return response.data.objects;
            }).catch(function(response) {
                throw new customError.getError(response.data.internalErrorCode, response.data.title);
            });
        },

        getPOByQueryStringNetworkData: function(queryStr) {
            return net.ajax({
                url: '/managedObjects/find',
                data: {searchQuery: queryStr, isCaseSensitive: true},
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json'
            }).then(function(response) {
                return response.data;
            }).catch(function(response) {
                throw new customError.getError(response.data.internalErrorCode, response.data.title);
            });
        }
    };
});
