define([
    'jscore/ext/net',
    'networkobjectlib/utils/customError'
], function(net, customError) {
    'use strict';

    return {

        deleteNotifyData: function(payload) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/network-visualization/v1/network-elements/clear-current-notifications',
                    type: 'POST',
                    dataType: 'application/json',
                    data: JSON.stringify(payload),
                    contentType: 'application/json',
                    success: function(data) {
                        resolve(data);
                    },
                    error: function(data) {
                        reject(new customError.getError(data));
                    }
                });
            });
        },

        getPOByQueryStringCustomTopology: function(selectedTopologyId, queryStr) {
            return new Promise(function(resolve, reject) {
                net.ajax({
                    url: '/object-configuration/collections/v4/search/' + selectedTopologyId + '?query=' + queryStr,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        if (data && data.objects) {
                            resolve(data.objects);
                        }
                    },
                    error: function(data) {
                        reject(new customError.getError(data));
                    }
                });
            });
        }
    };
});
