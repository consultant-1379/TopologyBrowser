/*global define,Promise */
define([
    'jscore/core',
    'jscore/ext/net',
    'i18n!networkobjectlib/dictionary.json',
    '../../utils/customError'
], function(core, net, i18n, customError) {

    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     */
    return {
        pendingRequests: [],

        cancelRequestsByTypes: function(types) {
            this.pendingRequests.forEach(function(request) {
                if (types.indexOf(request.type) > -1) {
                    request.xhr.abort();
                }
            });
        },

        getModelInfo: function(neType, neVersion, namespace, type, version, includeNonPersistent) {
            var resetEasyCodes = ['RESTEASY001185'];
            var urlBuilder = ['', 'persistentObject', 'model'];
            namespace = namespace.replace(/\//g, '._.');
            if (neType === null || neType === '') {
                urlBuilder.push('null');
            } else {
                urlBuilder.push(neType);
            }

            if (neVersion === null || neVersion === '') {
                urlBuilder.push('null');
            } else {
                urlBuilder.push(neVersion);
            }

            urlBuilder.push(namespace, type, version, 'attributes');

            return ajax.call(this, 'getModelInfo', {
                url: urlBuilder.join('/') + '?includeNonPersistent=' + includeNonPersistent,
                type: 'GET',
                dataType: 'json'
            }).catch(function(response) {
                if (isRestEasyCodeExistInError(response.xhr, resetEasyCodes)) {
                    return this.getModelInfoFromLegacyApi(neType, namespace, type, version);
                } else {
                    var errorCode = getErrorCodesFromResponse(response);
                    throw customError.getError(errorCode, null, {
                        neType: neType,
                        neVersion: neVersion,
                        namespace: namespace,
                        type: type,
                        version: version
                    });
                }
            }.bind(this));
        },

        getModelInfoFromLegacyApi: function(neType, namespace, type, version) {
            var urlBuilder = ['', 'modelInfo', 'model'];
            if (neType) {
                urlBuilder.push(neType);
            }
            urlBuilder.push(namespace, type, version, 'attributes');

            return ajax.call(this, 'getModelInfo', {
                url: urlBuilder.join('/') + '?stringifyLong=true',
                type: 'GET',
                dataType: 'json'
            }).catch(function(response) {
                var errorCode = getErrorCodesFromResponse(response);
                throw customError.getError(errorCode, null, {
                    neType: neType,
                    namespace: namespace,
                    type: type,
                    version: version
                });
            });
        },

        getAttributes: function(poid, includeNonPersistent) {
            var urlBuilder = ['', 'persistentObject', poid];

            return ajax.call(this, 'getAttributes', {
                url: urlBuilder.join('/') + '?includeNonPersistent=' + includeNonPersistent + '&stringifyLong=true',
                type: 'GET',
                dataType: 'json',
                timeout: 120000,
            }).then(function(response) {
                response.data.poId = response.data.id || response.data.poId;
                response.data.networkDetails = response.data.networkDetails.map(function(property) {
                    if (property.key === 'syncStatus') {
                        property.key = 'CM syncStatus';
                    }
                    return property;
                });
                return response;
            }).catch(function(response) {
                var errorCode = getErrorCodesFromResponse(response);
                throw customError.getError(errorCode, response.data.title, { poid: poid });
            });
        },

        saveAttributes: function(poid, data) {
            var urlBuilder = ['', 'persistentObject', poid];

            return ajax.call(this, 'saveAttributes', {
                url: urlBuilder.join('/'),
                type: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data),
                timeout: 30000,
            }).catch(function(response) {
                // FIXME xhr is being inserted here because is needed in handleAttributeSaveError.
                // FIXME The function pointed above must be refactored to not need xhr
                var errorCode = response.data.errorCode === customError.Timeout.code ? customError.SaveTimeout.code : response.data.errorCode;
                throw customError.getError(errorCode, null, { poid: poid, xhr: response.xhr });
            });
        }
    };

    function ajax(type, options) {
        return new Promise(function(resolve, reject) {
            options.success = function(data, xhr) {
                // remove request from pending list
                this.pendingRequests.splice(this.pendingRequests.indexOf({type: type, xhr: xhr}), 1);

                resolve({data: data, xhr: xhr});
            }.bind(this);

            options.error = function(data, xhr) {
                // remove request from pending list
                this.pendingRequests.splice(this.pendingRequests.indexOf({type: type, xhr: xhr}), 1);

                // overwrite data with response body because jscore net component send different data for errors
                try {
                    data = xhr.getResponseJSON();
                } catch (e) {
                    data = { errorCode: -1 };
                }

                reject({data: data, xhr: xhr});
            }.bind(this);

            options.onTimeout = function(xhr) {
                var data = { errorCode: -2 };
                reject({data: data, xhr: xhr});
            }.bind(this);

            var xhr = net.ajax(options);
            this.pendingRequests.push({type: type, xhr: xhr});
        }.bind(this));
    }

    function getErrorCodesFromResponse(response) {
        var defaultErrorCode = -999;
        var errorCode;
        if (response.data && response.data.errorCode) {
            errorCode = response.data.errorCode;
        } else if (response.xhr) {
            errorCode = getErrorFromResponseStatus(response.xhr);
        }
        return errorCode ? errorCode : defaultErrorCode;
    }
    
    function getErrorFromResponseStatus(xhr) {
        var errorCode;
        switch (xhr.getStatus()) {
        case 404:
            errorCode = customError.PersistentObjectNotFound.code;
            break;                
        case 403:
            errorCode = customError.AccessDenied.code;
            break;            
        case 401:
            errorCode = customError.Unauthorized.code ;
            break;
        case 500: case 503:
            var json;
            try {
                json = xhr.getResponseJSON();
            } catch (e) {
                console.error(e);
            }
            errorCode = (json && json.body && json.body.indexOf('status: RetryFailed') > -1) ?
            customError.DatabaseUnavailable.code : customError.ServerRetrieveError.code;
            break;   
        case 504:
            errorCode = customError.ServiceUnavailable.code ;
            break;
        default:
            errorCode = customError.ServerRetrieveError.code ;
            break;
        }                
        return errorCode;
    }

    function isRestEasyCodeExistInError(xhr, restEasyCodes) {
        return restEasyCodes.some(function(code) {
            return xhr.getResponseText().indexOf(code) !== -1;
        });
    }

});

