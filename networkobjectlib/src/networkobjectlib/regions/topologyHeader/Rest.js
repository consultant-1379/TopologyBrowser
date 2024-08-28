define([
    'jscore/core',
    '../../utils/net',
    'networkobjectlib/utils/customError',
], function(core, net, customError) {

    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     *  {Object} - config - configuration object (ex: to identify the request)
     */
    return {
        getDropdown: function() {
            return this.getCustomTopologiesOptionsV4();
        },

        getCustomTopologiesOptionsV4: function() {
            return net.ajax({
                url: '/object-configuration/collections/search/v4',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    clauses: [{
                        negate: false,
                        type: 'CUSTOM_TOPOLOGY'
                    }]
                })
            }).then(function(response) {
                var customTopologyOption = [];
                response.data.forEach(function(topology) {
                    var objTopology =  {
                        name: topology.name,
                        value: topology.id,
                        title: topology.name,
                        disabled: false,
                        type: 'CustomTopology'
                    };
                    customTopologyOption.push(objTopology);
                });
                return customTopologyOption;
            }.bind(this)).catch(function(error) {
                var statusCode = error.xhr && error.xhr.getStatus();
                if (statusCode === 404 || statusCode === 429 || statusCode === 500) {
                    return this.getCustomTopologiesOptions();
                }
                else {
                    throw new customError.getError(error.data.internalErrorCode);
                }
            }.bind(this));
        },

        getCustomTopologiesOptions: function() {
            return net.ajax({
                url: '/object-configuration/custom-topology/v2?customTopology=true',
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                var customTopologyOption = [];
                response.data.forEach(function(topology) {
                    if (topology.level === 0) {
                        var objTopology =  {
                            name: topology.name,
                            value: topology.id,
                            title: topology.name,
                            disabled: false,
                            type: 'CustomTopology'
                        };
                        customTopologyOption.push(objTopology);
                    }
                });
                return customTopologyOption;
            })
                .catch(function(response) {
                    throw customError.getError(response.data.errorCode);
                });
        }
    };
});
