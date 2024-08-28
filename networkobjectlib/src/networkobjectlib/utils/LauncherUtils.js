define([
    'applib/LaunchContext',
    'container/api',
    'actionlibrary/ActionLibrary',
    'actionlibrary/RecentActions',
    'widgets/Dialog',
    'networkobjectlib/utils/TopologyUtility',
    'i18n!networkobjectlib/dictionary.json',
    './LauncherUtilsRest'
], function(LaunchContext, container, ActionLibrary, RecentActions, Dialog, TopologyUtility, Dictionary, LauncherUtilsRest) {
    var LauncherUtils = function(defaultActions, actionCallback) {
        this.defaultActionList = defaultActions;
        this.actionCallback = actionCallback;
    };

    LauncherUtils.prototype = {
        createLauncherAction: function(selection, updateActionBarCallback) {
            this.hasUnVsn = false;
            for (var i = 0; i < selection.length; i++) {
                if (selection[i].neType === 'VirtualSubnetwork' || selection[i].neType === 'Unmanaged') {
                    this.hasUnVsn = true;
                    break;
                }
            }
            var actions = this.defaultActionList ? JSON.parse(JSON.stringify(this.defaultActionList)) : [];
            for (var t = 0; t < actions.length; t++) {
                actions[t].action = this.defaultActionList[t].action;
            }

            if (selection[0].enableRemoveNodeButton) {
                var removeNodesActionButton = this.createRemoveNodesAction(selection);
                actions.push({type: 'separator'}, removeNodesActionButton);
            }

            if (selection[0].enableMoveToCollectionButton && selection.length >= 1 && selection.length <=10) {
                var moveToCollectionActionButton = this.createMoveToCollectionAction(selection);
                actions.push(moveToCollectionActionButton);
            }

            var metaObject = this.getMetaObject(selection);
            return ActionLibrary.getAvailableActions(metaObject)
                .then(function(actions) {
                    this.removeActionsForUnVsn(actions);
                    return this.createActionButtons(actions, selection, updateActionBarCallback);
                }.bind(this))
                .then(function(nodeActions) {
                    this.availableActions = this.getAvailableActions(nodeActions, actions);
                    return RecentActions.getRecentActions('topologybrowser', this.availableActions)
                        .then(function(res) {
                            this.removeActionsForUnVsn(res.actionList);
                            return {
                                availableActions: this.availableActions,
                                actionBarActions: RecentActions.getRecentActionDropdown(res.actionList).concat(this.availableActions),
                                contextMenuActions: this.getContextMenuActions(res.actionList).concat(this.availableActions)
                            };
                        }.bind(this));
                }.bind(this));
        },

        /**
         * Get all available actions and add separators
         * @param {Array} nodeActions
         * @param {Array} actions
         * @method getAvailableActions
         * return {Array} actions
         */
        getAvailableActions: function(nodeActions, actions) {
            if (nodeActions.length > 0 && actions.length > 0) {
                actions.push({type: 'separator'});
            }
            var currentCategory;
            nodeActions.forEach(function(action) {
                if (action.category !== currentCategory && currentCategory !== undefined) {
                    actions.push({
                        type: 'separator'
                    });
                }
                currentCategory = action.category;
                actions.push(action);
            });
            return actions;
        },

        /**
         * gets recent context menu actions and formats them for the expandable right click menu.
         * @param {Array} actionList - the actions to be visualized.
         * @method contextMenuActions
         * return {Array} contextMenuActions
         */
        getContextMenuActions: function(actionList) {
            var contextMenuActions = [];
            if (actionList.length > 0) {
                contextMenuActions = RecentActions.getRecentActionGroup(actionList);
                contextMenuActions[0].expandable = true;
            }
            return contextMenuActions;
        },

        /**
         * Create array of buttons that launch applications
         * with selected objects.
         * @param actions {Array} of of actions that can be consumed by topologybrowser.
         * @param selection {Array} of selected objects.
         * @param updateActionBarCallback
         * @returns Array of buttons.
         */
        createActionButtons: function(actions, selection, updateActionBarCallback) {
            return actions.map(function(action) {
                var uisdkAction = {
                    type: 'button',
                    name: action.defaultLabel,
                    category: action.category,
                    action: function() {
                        RecentActions.updateRecentActions('topologybrowser', action.defaultLabel)
                            .then(function() {
                                this.launchAction(action, selection);
                                updateActionBarCallback(selection);
                            }.bind(this)).catch(function(err) {
                                console.log('Error ' + err);
                            }.bind(this)
                            );
                    }.bind(this)
                };
                if (action.icon) {
                    uisdkAction.icon = action.icon;
                }
                return uisdkAction;
            }.bind(this));
        },

        removeActionsForUnVsn: function(actions) {
            if (this.hasUnVsn) {
                for (var x = 0; x < actions.length; x++) {
                    var actionName = actions[x].defaultLabel ? actions[x].defaultLabel : actions[x].name;
                    if (actionName !== 'Add Node' && actionName !== 'Set Location' && actionName !== 'Select Related Objects' && actionName !== 'Locate in Topology' &&
                        actionName !== 'Add to a Collection' && actionName !== 'Manage Links' && actionName !== 'Create Link' && actionName !== 'Delete All Links' &&
                        actionName !== 'Delete Node' && actionName !== 'Search for an Object' && actionName !== 'Browse to FDN') {
                        actions.splice(x, 1);
                        x--;
                    }
                }
            }
        },

        /**
         * Create metaObject based on selection
         * @param selection {Array} of selected objects
         * @returns {Object} metaObject
         */
        getMetaObject: function(selection) {
            selection = this.formatSelection(selection);
            var dataType = TopologyUtility.isCollection(selection[0]) ? 'Collection' : 'ManagedObject';
            return ActionLibrary.createMetaObject(
                'topologybrowser',
                dataType,
                selection
            );
        },

        /**
         * Collections returned from the v4 endpoint will not have a subType.
         * The ActionLibrary needs a subtype to create a metaObject so change the payload to match the ActionLibrary format
         * @param selection {Array} of selected objects
         * @returns {Array} selection - formatted array
         */
        formatSelection: function(selection) {
            selection = this.formatHybrid(selection);
            selection.forEach(function(selectedItem) {
                if (selectedItem.query) {
                    selectedItem.subType = 'SEARCH_CRITERIA';
                    selectedItem.type = 'NESTED';
                }
                else if (selectedItem.type) {
                    if (selectedItem.type === 'LEAF' || selectedItem.type === 'BRANCH') {
                        selectedItem.subType = selectedItem.type;
                        selectedItem.type = 'NESTED';
                    }
                }
            });
            return selection;
        },

        /**
         * The ActionLibrary needs a hybrid status to create a metaObject so change the payload to match the ActionLibrary format
         * @param selection {Array} of selected objects
         * @returns {Array} selection - formatted array
         */
        formatHybrid: function(selection) {
            selection.forEach(function(selectedItem) {
                if (selectedItem.hybrid === undefined || selectedItem.hybrid === null) {
                    selectedItem.hybrid = false;
                }
            });
            return selection;
        },

        /**
         * Perform pre-action checks.
         * Return false if ActionLibrary execution does not need to be halted.
         * Return true if ActionLibrary execution needs to be halted.
         * Returns false by default.
         * @param action - ActionLibrary action
         * @param objects - Object info based on what was selected
         * @returns {Promise<{objects: boolean}>|Promise<boolean>}
         */
        preActionCheck: function(action, objects) {
            var isCollection = TopologyUtility.isCollection(objects[0]);
            if (action.name === 'alarmmonitor-remote-show' && isCollection) {
                var collectionIds = objects.map(function(object) {
                    return object.id;
                });
                return LauncherUtilsRest.checkCollectionHasNodes(collectionIds)
                    .then(function(data) {
                        if (!data.objects) {
                            this.showDialog('error', Dictionary.get('emptyCollectionError.title'), Dictionary.get('emptyCollectionError.body'));
                        }
                        return data.objects !== true;
                    }.bind(this))
                    .catch(function(error) {
                        throw error;
                    }.bind(this));
            }
            return Promise.resolve(false);
        },

        /**
         * Executes Action i.e. Launches application.
         * @param action - Action to execute.
         * @param objects - Selected objects.
         */
        launchAction: function(action, objects) {
            function getButtons(dialog) {
                return [{
                    caption: 'OK',
                    action: function() {
                        dialog.hide();
                    }.bind(this)
                }];
            }
            this.preActionCheck(action, objects)
                .then(function(stopAction) {
                    if (!stopAction) {
                        ActionLibrary.executeAction(action, objects,
                            {
                                onReady: function() {
                                    console.log('onReady: Action loaded');
                                },
                                onProgress: function(progress) {
                                    console.log('onProgress: Action in progress [' + Math.ceil(progress.percentage) + ']');
                                },
                                onComplete: function(result) {
                                    if (result.success) {
                                        console.log('onComplete: Action Clicked');
                                    }
                                    if (result.afterUseCase) {
                                        result.afterUseCase
                                            .then(this.actionCallback.successCallBack, this.actionCallback.failureCallBack)
                                            .catch(function(error) {
                                                console.log('Error in executing action : ' + error);
                                            });
                                    }
                                }.bind(this),
                                onFail: function(e) {
                                    console.log('onFail: Action failed to complete and gracefully returned with an ActionResult in an Error state: ' + JSON.stringify(e));
                                    var dialog = new Dialog({
                                        header: 'Action complete',
                                        content: 'The Action was unable to launch successfully',
                                        optionalContent: 'Reason: ' + e.message
                                    });
                                    dialog.setButtons(getButtons(dialog));
                                    dialog.show();
                                }
                            });
                    }
                }.bind(this))
                .catch(function(error) {
                    this.showDialog('error', error.title, error.body);
                }.bind(this));
        },

        /**
         * Create the 'Move to Collection' action button"
         * @param selection - Selected objects.
         * converts the @param to array of objects expected for this action:
         * EXPECTED CONVERTED PARAMETERS
         # [{ id: 'parentId', objects: [{ id: 'nodeId' }] }]
         * @param selection
         * @return - a 'Move to Collection' action
         */
        createMoveToCollectionAction: function(selection) {
            var moveToCollectionAction = [{
                defaultLabel: Dictionary.actions.MoveToCollection.defaultLabel,
                name: 'networkexplorer-move-to-collection',
                type: 'button',
                category: 'Collection Modification Actions',
                plugin: 'networkexplorer/networkexplorer-move-to-collection'
            }];

            var parentId = selection[0].parentId;
            var objectList = [];
            selection.forEach(function(element) {
                objectList.push({id: element.id});
            });
            var objectsToMove = [{
                id: parentId,
                objects: objectList
            }];

            var moveToCollectionActionButton = moveToCollectionAction.map(function(action) {
                var uisdkAction = {
                    type: 'button',
                    name: action.defaultLabel,
                    category: action.category,
                    action: function() {
                        this.launchAction(action, objectsToMove);
                    }.bind(this)
                };
                if (action.icon) {
                    uisdkAction.icon = action.icon;
                }
                return uisdkAction;
            }.bind(this));

            return moveToCollectionActionButton[0];
        },

        /**
         * Create the action button from "Remove Nodes From This Collection"
         * @param selection - Selected objects.
         * converts the @param to array of objects expected for this action:
         * EXPECTED CONVERTED PARAMETERS
         # [{ id: 'parentId', objects: [{ id: 'nodeId' }] }]
         * @return a action button with "Remove Nodes From This Collection" action
         */
        createRemoveNodesAction: function(selection) {
            var removeNodesAction = [{
                defaultLabel: Dictionary.actions.RemoveTopologyData.defaultLabel,
                name: 'networkexplorer-remove-from-this-collection',
                type: 'button',
                category: 'Collection Modification Actions',
                plugin: 'networkexplorer/networkexplorer-remove-from-this-collection'
            }];
            var parentId = selection[0].parentId;
            var objectList = [];
            selection.forEach(function(element) {
                objectList.push({id: element.id});
            });
            var objectsToRemoval = [{
                id: parentId,
                objects: objectList
            }];

            var removeNodesActionButton = removeNodesAction.map(function(action) {
                var uisdkAction = {
                    type: 'button',
                    name: action.defaultLabel,
                    category: action.category,
                    action: function() {
                        this.runRemoveNodesAction(action, objectsToRemoval);
                    }.bind(this)
                };
                if (action.icon) {
                    uisdkAction.icon = action.icon;
                }
                return uisdkAction;
            }.bind(this));

            return removeNodesActionButton[0];
        },

        /*
        *
        * function to generate the Dialog Box to confirm the removal
        * @parans action, objectsToRemoval
        *
        */
        runRemoveNodesAction: function(action, objectsToRemoval) {
            var removeNodesDialog = new Dialog({
                header: Dictionary.get('removeNodesDialog.confirmHeader'),
                content: Dictionary.get('removeNodesDialog.confirmContent'),
                buttons: [
                    {
                        caption: Dictionary.get('removeNodesDialog.ok'),
                        action: function() {
                            this.launchAction(action, objectsToRemoval);
                            removeNodesDialog.hide();
                        }.bind(this)
                    },
                    {
                        caption: Dictionary.get('removeNodesDialog.cancel'),
                        action: function() {
                            removeNodesDialog.hide();
                        }
                    }
                ]
            });
            removeNodesDialog.show();
        },

        showDialog: function(type, header, content) {
            if (this.dialog) {
                this.dialog.detach();
                this.dialog.destroy();
            }
            this.dialog = new Dialog({
                header: header,
                content: content,
                buttons: [{
                    caption: Dictionary.get('buttons.ok'),
                    action: function() {
                        this.dialog.hide();
                        this.dialog.destroy();
                    }.bind(this)
                }],
                type: type
            });
            this.dialog.show();
        }


    };
    return LauncherUtils;
});
