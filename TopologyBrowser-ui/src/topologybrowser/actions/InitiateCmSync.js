define([
    'actionlibrary/ActionLibrary',
    'jscore/core',
    'jscore/ext/net',
    'widgets/Dialog',
    'container/api',
    'networkobjectlib/ProgressRegion',
    'networkobjectlib/utils/ErrorHandler',
    'i18n!networkobjectlib/dictionary.json'
], function(ActionLibrary, core, net, Dialog, Container, ProgressRegion, ErrorHandler, Dictionary) {
    'use strict';

    var REST_EASY_RESOURCE_NOT_FOUND_ERROR_CODE = 998;

    /**
     * InitiateCmSync
     * ===
     * id: topologybrowser-initiate-cm-sync
     *
     * This action launches a UI that allows the user to initiate a node sync
     *
     * Expected parameters:
     * # Array of data
     *
     * Expected contents
     * * If not empty, the first item must be an object with a persistent object id property
     */
    return ActionLibrary.Action.extend({
        run: function(callbackObject, data) {
            // Create new lifecycle
            var lifecycle = new ActionLibrary.ActionLifecycle(callbackObject);
            // Defer execution
            new Promise(function(resolve, reject) {
                // 1. Create a dialog for the user to confirm they wish to perform a sync
                var confirmationDialog = new Dialog({
                    header: Dictionary.get('actions.InitiateCmSync.confirmHeader'),
                    content: Dictionary.get('actions.InitiateCmSync.confirmContent'),
                    buttons: [{
                        caption: Dictionary.get('actions.InitiateCmSync.sync'),
                        action: function() {
                            confirmationDialog.destroy();
                            fetchNetworkElements(data, reject);
                        }
                    }, {
                        caption: Dictionary.get('buttons.cancel'),
                        action: function() {
                            confirmationDialog.destroy();
                        }
                    }],
                    type: 'warning'
                });
                confirmationDialog.show();
                resolve();
            }).then(function() {
                // Finish successfully
                var actionResult = new ActionLibrary.ActionResult({
                    success: true
                });
                lifecycle.onComplete(actionResult);
            }).catch(function() {
                // Catch all errors
                var actionResult = new ActionLibrary.ActionResult({
                    success: false,
                    message: Dictionary.error
                });
                lifecycle.onFail(actionResult);
            });
            // Return lifecycle immediately
            return lifecycle;
        }
    });

    // private functions
    function fetchNetworkElements(initialData, reject) {
        // Show processing
        Container.getEventBus().publish('container:loader', {
            content: Dictionary.get('actions.processingRequest')
        });
        // Get NetworkElements
        net.ajax({
            url: '/persistentObject/rootAssociations/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                poList: initialData.map(function(object) {
                    return object.id;
                })
            }),
            success: function(data) {
                Container.getEventBus().publish('container:loader-hide');
                synchronizeNodes(data);
            },
            error: function() {
                Container.getEventBus().publish('container:loader-hide');
                reject();
            }
        });
    }

    function synchronizeNodes(initialData) {
        // throttle simultaneous sync initiation requests
        var MAX_SIMULTANEOUS_SYNC_INITIATION_REQUESTS = 4;

        var nodeNameList = [], neData = [];
        initialData.forEach(function(object) {
            if (nodeNameList.indexOf(object.name) === -1) {
                nodeNameList.push(object.name);
                neData.push(object);
            }
        });
        // param: stateDefinitions
        // User creates definitions, pass to constructor of Region
        var stateDefinitions = [{
            state: 'TOTAL',
            label: Dictionary.get('ProgressRegion.counters.TOTAL.label'),
            value: neData.length
        }, {
            state: 'NOT_STARTED',
            label: Dictionary.get('ProgressRegion.counters.NOT_STARTED.label'),
            initialState: true
        }, {
            state: 'INITIATING',
            label: Dictionary.get('ProgressRegion.counters.INITIATING.label')
        }, {
            state: 'SUCCESSFUL',
            label: Dictionary.get('ProgressRegion.counters.SUCCESSFUL.label'),
            description: Dictionary.get('ProgressRegion.counters.SUCCESSFUL.description'),
            icon: 'tick',
            goalState: true
        }, {
            state: 'FAILED',
            label: Dictionary.get('ProgressRegion.counters.FAILED.label'),
            icon: 'error',
            goalState: true
        }];
        // Create the shared Context
        var progressEventBus = new core.EventBus();
        // Shared Context for Action instance
        var ActionContext = core.AppContext.extend({
            eventBus: progressEventBus
        });
        // Create the content of the Dialog
        var progressRegion = new ProgressRegion({
            data: neData,
            stateDefinitions: stateDefinitions,
            initialState: 'NOT_STARTED',
            context: new ActionContext()
        });
        // Create the Dialog
        var progressDialog = new Dialog({
            header: Dictionary.get('ProgressRegion.header.labelStart'),
            content: progressRegion,
            buttons: [{
                caption: Dictionary.get('buttons.abort'), color: 'orange', action: function() {
                    setDialogOkButton(progressDialog);
                }
            }]
        });

        // Sync MO action
        var initiatingCount = 0, scriptEngineResponseQueue = [], scriptEngineSyncCommandStringMap = {};

        var initNodeSync = function(nodeName) {
            // update 'INITIATING' counter
            progressEventBus.publish(progressRegion.events.PROGRESS_REGION_UPDATE, {
                name: nodeName,
                state: 'INITIATING'
            });
            initiatingCount++;
            net.ajax({
                url: '/persistentObject/v1/perform-mo-action/NetworkElement=' + nodeName + ',CmFunction=1?actionName=sync',
                type: 'POST',
                contentType: 'application/json',
                success: function() {
                    setSyncSuccessStatus(nodeName);
                },
                error: function(msg, xhr) {
                    handlePersistentObjectServiceResponseError(xhr, nodeName);
                }
            });
        };

        /**
         * Handle error generated using persistent object service perform action end point.
         * Backwards compatibility: If Persistent Object Service perform action REST resource doesn't exist on server
         *                          then fall back to old implementation using Script Engine.
         * Other errors: handle as before by parsing JSON if available, or using ErrorHandler if not.
         *
         * @param xhr
         * @param nodeName
         */
        var handlePersistentObjectServiceResponseError = function(xhr, nodeName) {
            try {
                var jsonResponse = xhr.getResponseJSON();
                if (xhr.getStatus() === 404 && xhr.getResponseJSON().errorCode === REST_EASY_RESOURCE_NOT_FOUND_ERROR_CODE) {
                    console.error('Did not find persistent object service perform action REST resource. Retrying with Script Engine');
                    retryInitiateSyncWithScriptEngine(nodeName);
                } else {
                    setSyncFailureStatus(nodeName, getXhrResponseBody(jsonResponse));
                }
            } catch (e) {
                setSyncFailureStatus(nodeName, ErrorHandler.getErrorFromResponse(xhr).body);
            }
        };

        var getXhrResponseBody = function(jsonResponse) {
            if (jsonResponse.errorCode === 10106) {
                return Dictionary.get('errors.memoryProtectionDataRetrievalError.body');
            } else {
                return parseFailedXhrResponseBody(jsonResponse.body);
            }
        };


        var retryInitiateSyncWithScriptEngine = function(nodeName) {
            scriptEngineSyncCommandStringMap[nodeName] = {
                command: 'cmedit action NetworkElement=' + nodeName + ',CmFunction=1 sync'
            };
            var formData = new FormData();
            formData.append('command', scriptEngineSyncCommandStringMap[nodeName].command);
            net.ajax({
                url: '/script-engine/services/command/',
                type: 'POST',
                contentType: false,
                processData: false,
                headers: {
                    'Skip-Cache': 'true',
                    'streaming': 'true',
                    'tabId': 'do_not_use',
                    'confirmation': 'true'
                },
                data: formData,
                success: function(emptyBody, xhr) {
                    // track id
                    scriptEngineSyncCommandStringMap[nodeName].process_id = xhr.getResponseHeader('process_id');
                    // request an update at some future time
                    scriptEngineResponseQueue.push(nodeName);
                },
                error: function(msg, xhr) {
                    setSyncFailureStatus(nodeName, ErrorHandler.getErrorFromResponse(xhr).body);
                }
            });
        };

        var setSyncFailureStatus = function(nodeName, errorMessage) {
            // update 'FAILED' counter
            var eventMessage = {
                name: nodeName,
                state: 'FAILED'
            };
            if (errorMessage) {
                eventMessage.detail = errorMessage;
            }
            progressEventBus.publish(progressRegion.events.PROGRESS_REGION_UPDATE, eventMessage);
            initiatingCount--;
        };
        var setSyncSuccessStatus = function(nodeName) {
            // update 'SUCCESSFUL' counter
            progressEventBus.publish(progressRegion.events.PROGRESS_REGION_UPDATE, {
                name: nodeName,
                state: 'SUCCESSFUL'
            });
            initiatingCount--;
        };

        var checkNodeSyncResponse = function(nodeName) {
            net.ajax({
                url: '/script-engine/services/command/output/' + scriptEngineSyncCommandStringMap[nodeName].process_id,
                type: 'GET',
                dataType: 'json',
                contentType: false,
                processData: false,
                headers: {
                    'Skip-Cache': 'true',
                    'streaming': 'true',
                    'tabId': 'do_not_use',
                    'confirmation': 'true'
                },
                success: function(data) {
                    var dataString = JSON.stringify(data);
                    if (dataString.indexOf('SUCCESS FDN : ') > -1) {
                        setSyncSuccessStatus(nodeName); // expected success
                    } else if (dataString.indexOf('"dtoType":"summary"') > -1) {
                        var summary = data.find(function(obj) {
                            return obj.dtoType === 'summary';
                        });
                        setSyncFailureStatus(nodeName, parseFailedXhrResponseBody(summary.statusMessage));
                    } else {
                        checkNodeSyncResponse(nodeName); // retry
                    }
                },
                error: function(msg, xhr) {
                    setSyncFailureStatus(nodeName, ErrorHandler.getErrorFromResponse(xhr).body); // endpoint failure
                }
            });
        };

        var parseFailedXhrResponseBody = function(xhrBody) {
            if (xhrBody.indexOf(Dictionary.get('errors.initiateCmSyncSupervisionDisabled.rawContentMarker')) > -1) {
                return Dictionary.get('errors.initiateCmSyncSupervisionDisabled.body');
            }
            if (xhrBody.indexOf(Dictionary.get('errors.initiateCmSyncMediationServiceUnavailable.rawContentMarker')) > -1) {
                return Dictionary.get('errors.initiateCmSyncMediationServiceUnavailable.body');
            }
            return xhrBody;
        };

        // * Stop further initiate commands * Flush queue * Set Button to Ok
        var setDialogOkButton = function(dialog) {
            clearInterval(checkProgressId);

            if (initiatingCount) {
                while (scriptEngineResponseQueue.length) {
                    checkNodeSyncResponse(scriptEngineResponseQueue.shift());
                }
                setTimeout(function() {
                    initiatingCount = 0;
                    setDialogOkButton(dialog);
                }, 100);
            } else {
                dialog.setHeader(Dictionary.get('ProgressRegion.header.labelEnd'));
                dialog.setButtons([{
                    caption: Dictionary.get('buttons.ok'), color: 'blue', action: function() {
                        dialog.hide();
                        Container.getEventBus().publish('topologyTree:sync');
                    }
                }]);
            }
        };

        var checkProgressId = setInterval(function() {
            if (nodeNameList.length > 0 || scriptEngineResponseQueue.length > 0) {
                // flush script engine responses if they exist
                if (scriptEngineResponseQueue.length > 0) {
                    checkNodeSyncResponse(scriptEngineResponseQueue.shift());
                }
                // If space is available, add another node sync request
                if (initiatingCount < MAX_SIMULTANEOUS_SYNC_INITIATION_REQUESTS && nodeNameList.length > 0) {
                    initNodeSync(nodeNameList.shift());
                }
            } else if (initiatingCount === 0) {
                setDialogOkButton(progressDialog);
            }
        }, 1000);

        progressDialog.show();
    }
});
