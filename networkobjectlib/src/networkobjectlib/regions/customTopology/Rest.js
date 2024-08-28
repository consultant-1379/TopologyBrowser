/*global define*/
define([
    'jscore/core',
    '../../utils/net',
    'networkobjectlib/utils/customError',
    'networkobjectlib/utils/UserSettings'
], function(core, net, customError, UserSettings) {
    'use strict';
    var baseUrl = '/object-configuration/custom-topology/v2';
    return {
        getCustomTopologyById: function(id) {
            return net.ajax({
                url: baseUrl + '/' + id,
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }).catch(function(response) {
                throw new customError.getError(response.data.internalErrorCode);
            });
        },

        getCustomTopologyByIdV4: function(collectionId) {
            return net.ajax({
                url: '/object-configuration/collections/v4/' + collectionId,
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }).catch(function(error) {
                var statusCode = error.xhr && error.xhr.getStatus();
                if (statusCode === 404 || statusCode === 429 || statusCode === 500) {
                    UserSettings.saveDropdownSettings('networkData', 'NetworkData');
                    return this.getCustomTopologyById(collectionId);
                }
                else {
                    throw new customError.getError(error.data.internalErrorCode);
                }
            }.bind(this));
        },

        getChildren: function(id) {
            return net.ajax({
                url: baseUrl + '?parentId=' + id,
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                return response.data;
            }).catch(function(error) {
                if (error.data.internalErrorCode === 10007) {
                    throw new customError.NetworkObjectNotFound();
                } else {
                    throw new customError.getError(error.data.internalErrorCode);
                }

            });
        },

        getChildrenV4: function(parentId, showNodeCount) {
            return net.ajax({
                url: '/object-configuration/collections/search/v4',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    parentId: parentId,
                    fetchNodeCount: showNodeCount
                })
            }).then(function(response) {
                return response.data;
            }).catch(function(error) {
                var statusCode = error.xhr && error.xhr.getStatus();
                if (statusCode === 404 || statusCode === 429 || statusCode === 500) {
                    return this.getChildren(parentId);
                }
                else throw new customError.getError(error.data.internalErrorCode);
            }.bind(this));
        },

        getLeafCollectionChildren: function(collectionId) {
            return net.ajax({
                url: '/object-configuration/collections/v3/' + collectionId,
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                var poids = [];
                if (Array.isArray(response.data.objects)) {
                    poids = Object.keys(response.data.objects).map(function(key) {
                        return response.data.objects[key].id;
                    });
                }
                return poids;
            }).catch(function(response) {
                throw customError.getError(response.data.internalErrorCode);
            });
        },

        getLeafCollectionChildrenV4: function(collectionId) {
            return net.ajax({
                url: '/object-configuration/collections/v4/' + collectionId + '?includeContents=true',
                type: 'GET',
                dataType: 'json'
            }).then(function(response) {
                var poids = [];
                if (Array.isArray(response.data.contents)) {
                    poids = Object.keys(response.data.contents).map(function(key) {
                        return response.data.contents[key].id;
                    });
                }
                return poids;
            }).catch(function(error) {
                var statusCode = error.xhr && error.xhr.getStatus();
                if (statusCode === 404 || statusCode === 429 || statusCode === 500) {
                    return this.getLeafCollectionChildren(collectionId);
                }
                else {
                    throw new customError.getError(error.data.internalErrorCode);
                }
            }.bind(this));
        }
    };
});
