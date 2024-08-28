define([
    'actionlibrary/ActionLibrary',
    'jscore/core',
    'jscore/ext/net',
    'widgets/Dialog',
    'container/api',
    'networkobjectlib/EditStateRegion',
    'networkobjectlib/ProgressRegion',
    'networkobjectlib/utils/ErrorHandler',
    'i18n!networkobjectlib/dictionary.json'
], function(ActionLibrary, core, net, Dialog, Container, EditStateRegion, ProgressRegion, ErrorHandler, Dictionary) {
    'use strict';

    /**
     * EditState
     * ===
     * id: topologybrowser-edit-state
     *
     * This action launches a UI that allows the user to edit a management state of a node between 'Normal' and 'In Maintenance'
     *
     * Expected parameters:
     * # Array of data
     *
     * Expected contents
     * * If not empty, the first item must be an object with a persistent object id property
     */
    return ActionLibrary.Action.extend({
        run: function(callbackObject, data) {
            var lifecycle = new ActionLibrary.ActionLifecycle(callbackObject);
            new Promise(function(resolve, reject) {
                var poList = validateData(data, reject);
                fetchNetworkElements(poList, reject);
                resolve();
            }).then(function() {
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
            return lifecycle;
        }
    });

    // private functions
    function fetchNetworkElements(poList, reject) {

        // Show processing
        Container.getEventBus().publish('container:loader', {
            content: Dictionary.get('actions.processingRequest'),
        });

        // Get NetworkElements
        net.ajax({
            url: '/persistentObject/rootAssociations/',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                poList: poList
            }),
            success: function(data) {
                Container.getEventBus().publish('container:loader-hide');
                showEditDialog(data);
            },
            error: function(msg, xhr) {
                Container.getEventBus().publish('container:loader-hide');
                var error = ErrorHandler.getErrorFromResponse(xhr);
                var failDialog = new Dialog({
                    header: error.title,
                    content: error.body,
                    buttons: [{
                        caption: Dictionary.get('buttons.ok'),
                        action: function() {
                            failDialog.destroy();
                        }
                    }],
                    type: 'error'
                });
                failDialog.show();
                reject();
            }
        });
    }

    function validateData(initialData, reject) {
        if (!initialData || initialData.length === 0) {
            reject();
            return;
        }

        var poList = initialData.filter(function(object) {
            return object.id !== undefined;
        }).map(function(object) {
            return object.id;
        });

        if (poList.length === 0) {
            reject();
            return;
        }

        return poList;
    }

    function showEditDialog(data) {
        // Create the shared Context
        var progressEventBus = new core.EventBus();
        // Shared Context for Action instance
        var ActionContext = core.AppContext.extend({
            eventBus: progressEventBus
        });

        // Create the starting content of the Dialog
        var editStateRegion = new EditStateRegion({
            data: data
        });

        // Create the Dialog
        var dialog = new Dialog({
            header: Dictionary.get('editStateRegion.header'),
            content: editStateRegion,
            buttons: [{
                caption: Dictionary.get('actions.EditState.reviewChanges'),
                color: 'blue',
                enabled: false, // disabled attributes removed with radio button selection in EditManagementState.js
                action: function() {
                    showProgressDialog(editStateRegion.getManagementStateRadio());
                }
            }, {
                caption: Dictionary.get('buttons.cancel'),
                color: 'grey',
                action: function() {
                    dialog.hide();
                }
            }]
        });

        dialog.show();

        function showProgressDialog(state) {

            // param: stateDefinitions
            // User creates definitions, pass to constructor of Region
            var stateDefinitions = [{
                state: 'TOTAL',
                label: Dictionary.get('ProgressRegion.counters.TOTAL.label'),
                value: data.length
            }, {
                state: 'NOT_STARTED',
                label: Dictionary.get('ProgressRegion.counters.NOT_STARTED.label'),
                description: Dictionary.get('ProgressRegion.states.' + state),
                initialState: true
            }, {
                state: 'UPDATING',
                label: Dictionary.get('ProgressRegion.counters.UPDATING.label')
            }, {
                state: 'UPDATED',
                label: Dictionary.get('ProgressRegion.counters.UPDATED.label'),
                description: Dictionary.get('ProgressRegion.counters.UPDATED.description'),
                icon: 'tick',
                goalState: true
            }, {
                state: 'FAILED',
                label: Dictionary.get('ProgressRegion.counters.FAILED.label'),
                icon: 'error',
                goalState: true
            }];
            var progressRegion = new ProgressRegion({
                data: data,
                stateDefinitions: stateDefinitions,
                initialState: 'NOT_STARTED',
                context: new ActionContext(),
                dictionary:
                {
                    name: Dictionary.get('ProgressRegion.columns.name'),
                    result: Dictionary.get('ProgressRegion.columns.managementState')
                }
            });
            var requestCapacity = 10;
            var remainingRequests = data.length;

            var nodeNameList = data.map(function(node) {
                return node.name;
            });

            var idData = data.map(function(node) {
                return node.id;
            });

            progressRegion.view.getDetailsFooter().setText('');
            dialog.setContent(progressRegion);
            dialog.setButtons([{
                caption: Dictionary.get('actions.EditState.executeChanges'),
                color: 'blue',
                action: startUpdate
            }, {
                caption: Dictionary.get('buttons.cancel'),
                color: 'grey',
                action: function() {
                    dialog.hide();
                }
            }]);

            function startUpdate() {
                dialog.setButtons([{
                    caption: Dictionary.get('buttons.stop'),
                    color: 'orange',
                    action: function() {
                        clearInterval(progressInterval);
                        dialog.setButtons([{
                            caption: Dictionary.get('buttons.resume'),
                            color: 'blue',
                            action: startUpdate
                        }, {
                            caption: Dictionary.get('buttons.cancel'),
                            color: 'grey',
                            action: function() {
                                dialog.hide();
                                Container.getEventBus().publish('topologyTree:sync');
                            }
                        }]);
                    }
                }
                ]);

                var progressInterval = setInterval(function() {
                    if (requestCapacity > 0) {
                        editManagementState(state, nodeNameList.shift(), idData.shift());
                        if (nodeNameList.length === 0) {
                            clearInterval(progressInterval);
                        }
                    }
                }, 100);

                function editManagementState(state, nodeName, id) {
                    requestCapacity--;
                    // update 'UPDATING' counter
                    progressEventBus.publish(progressRegion.events.PROGRESS_REGION_UPDATE, {
                        name: nodeName,
                        state: 'UPDATING'
                    });
                    net.ajax({
                        url: '/persistentObject/' + id,
                        type: 'PUT',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            poId: id,
                            fdn: 'NetworkElement=' + nodeName,
                            attributes: [{
                                key: 'managementState',
                                value: state,
                                datatype: 'ENUM_REF'
                            }]
                        }),
                        success: function() {
                            requestCapacity++;
                            setEditManagementStateSuccessStatus(nodeName);
                        },
                        error: function(msg, xhr) {
                            requestCapacity++;
                            setEditManagementStateFailureStatus(nodeName, ErrorHandler.getErrorFromResponse(xhr).body);
                        }
                    });
                }

                function setEditManagementStateFailureStatus(nodeName, errorMessage) {
                    // update 'FAILED' counter
                    var eventMessage = {
                        name: nodeName,
                        state: 'FAILED'
                    };
                    if (errorMessage) {
                        eventMessage.detail = errorMessage;
                    }
                    progressEventBus.publish(progressRegion.events.PROGRESS_REGION_UPDATE, eventMessage);
                    if (--remainingRequests === 0) {
                        actionComplete();
                    }

                }

                function setEditManagementStateSuccessStatus(nodeName) {
                    // update 'UPDATED' counter
                    progressEventBus.publish(progressRegion.events.PROGRESS_REGION_UPDATE, {
                        name: nodeName,
                        state: 'UPDATED'
                    });

                    if (--remainingRequests === 0) {
                        actionComplete();
                    }
                }

                function actionComplete() {
                    clearInterval(progressInterval);
                    dialog.setButtons([{
                        caption: Dictionary.get('buttons.ok'),
                        color: 'blue',
                        action: function() {
                            dialog.hide();
                            Container.getEventBus().publish('topologyTree:sync');
                        }
                    }]);
                }
            }
        }
    }
});
