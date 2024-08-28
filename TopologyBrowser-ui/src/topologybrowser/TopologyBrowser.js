define([
    'jscore/core',
    'jscore/ext/locationController',
    'applib/LaunchContext',
    'container/api',
    'webpush/main',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'widgets/Dialog',
    'widgets/Notification',
    './TopologyBrowserView',
    'i18n!topologybrowser/app.json',
    'networkobjectlib/AttributesRegion',
    './regions/main/Main',
    './ext/locationState',
    './widgets/Supervision/SupervisionWidget',
    'networkobjectlib/utils/LauncherUtils',
    'networkobjectlib/utils/customError',
    'networkobjectlib/utils/AccessControl',
    'networkobjectlib/utils/TopologyUtility',
    'networkobjectlib/TopologyFDN',
    'networkobjectlib/utils/Constants',
    './utils/Rest',
    './utils/Utils'
], function(core, LocationController, LaunchContext, container, WebPush, TopSection, MultiSlidingPanels, Dialog, Notification,
    View, i18n, AttributesRegion, Main, LocationState, Supervision, LauncherUtils, customError, AccessControl, TopologyUtility,
    TopologyFDN, Constants, Rest, Utils) {

    return core.App.extend({

        View: View,

        allSubnetworksNetworkPoId: '-2',
        appName: Constants.TOPOLOGY_BROWSER,
        rightPanelExpanded: true,

        // regex to extract first poid value from url. Example: extracts 'x' from (?poid=x || &poid=x || ?poid=x& || ?poid=x&poid=y)
        poidParamRegex: /[\?|&]poid=([^&]+)/,

        // regex to extract first launch context value from url.
        launchContextIdParamRegex: /[\?|&]launchContextId=([^&]+)/,

        // regex to extract first topology poid value from url. Example: extracts 'x' from (?topology=x || &topology=x || ?topology=x& || ?topology=x&topology=y)
        topologyParamRegex: /[\?|&]topology=([^&]+)/,

        // regex to extract first topology poid value from url. Example: extracts 'x' from (?object=x || &object=x || ?object=x& || ?object=x&object=y)
        fullPathParamRegex: /[\?|&]fullpath=([^&]+)/,

        /*
         entry point method
         */
        onStart: function() {
            this.poidParam = this.getPOIdParam(location.href);
            this.topologyParam = this.getTopologyParam(location.href);
            if (this.topologyParam) {
                this.options.topologyParam = this.topologyParam;
            }
            this.previousPoid = null;
            this.previousTopology = null;
            this.previousFullPath = null;
            this.currentActions = undefined;
            this.currentFDN = '';
            this.fdnDialog = '';

            this.selectedNodeProperties = this.createNewSelectedNodeRegion();
            this.mainRegion = this.createMainRegion();
            this.locationController = this.createLocationController();
            this.topologyFDN = new TopologyFDN({context: this.getContext() });
            this.userName = Utils.getCurrentUser();
            this.addNavLayout();

            if (!this.supervisionWidget) {
                this.supervisionWidget = new Supervision({
                    eventbus: this.getEventBus()
                });
                this.supervisionWidget.topologyDropdownValue = this.mainRegion.topologyVisualisation.topologyHeader.topologyDropdown.getValue();
            }

            var accessControl = new AccessControl();
            accessControl.getResources('topologyBrowser').then(function() {
                this.defaultActions = [];

                if (accessControl.isAllowed(
                    ['topologySearchService', 'read'],
                    ['searchExecutor', 'read']
                )) {
                    this.defaultActions = [
                        {
                            name: i18n.actionSearchWithNetworkExplorer,
                            type: 'button',
                            color: 'darkBlue',
                            actionBarOnly: true,
                            action: function() {
                                this.launchNetworkExplorer();
                            }.bind(this)
                        },
                        {
                            type: 'separator',
                            actionBarOnly: true,
                        },
                        {
                            name: i18n.enterFDN.header,
                            type: 'button',
                            actionBarOnly: true,
                            action: function() {
                                this.openTopologyFDN();
                            }.bind(this)
                        }
                    ];
                }

                this.initApp();
            }.bind(this)).catch(function() {
                this.defaultActions = [];
                this.initApp();
            }.bind(this));
            reloadCss.call(this);

            WebPush.subscribe('/supervision-status:SUPERVISION_NOTIFICATION', function(obj) {
                this.handleWebPushEvent(obj);
            }.bind(this));
        },

        handleWebPushEvent: function(obj) {
            if (obj.USER_NAME === this.userName) {
                if (obj.STATUS === 'FAIL') {
                    obj.ERROR = i18n.get('NOTIFICATION_PANEL.ERROR_TIMEDOUT');
                }
                if (obj.STATUS !== 'DELETE') {
                    this.showToastForOperation(i18n.get('MESSAGE_NOTIFICATION.MESSAGE'),true, this.getElement());
                }
                obj.eventbus = this.getEventBus();
                this.getEventBus().publish('supervision:setWebPushData', obj);
            }
        },

        showToastForOperation: function(message, autoDismiss, element) {
            if (this.supervisionToast) {
                this.supervisionToast.destroy();
            }
            this.supervisionToast = new Notification({
                label: message,
                icon: 'tick',
                color: 'green',
                showCloseButton: true,
                showAsToast: true,
                autoDismiss: autoDismiss,
                autoDismissDuration: 10000
            });
            this.supervisionToast.attachTo(element);
        },

        //initialize application
        initApp: function() {
            var actionCallback = {
                successCallBack: this.onActionSuccessCallBack,
                failureCallBack: this.onActionFailureCallBack
            };
            this.launcherUtils = new LauncherUtils(this.defaultActions, actionCallback);
            this.updateActionBar();
            this.locationController.start();

            this.subscribeToEvents();
        },

        //TODO need to check for topology and object
        onResume: function() {
            WebPush.enable();
            if (this.getPoid() === null) {
                this.updateActionBar();
            }
            reloadCss.call(this);
        },

        onPause: function() {
            WebPush.disable();
        },

        /*
         @desc create the layout and attach it to the dom
         */
        addNavLayout: function() {

            var layout = new TopSection({
                context: this.getContext(),
                title: i18n.title,
                breadcrumb: this.options.breadcrumb
            });

            layout.attachTo(this.view.getNavigation());
            layout.setContent(new MultiSlidingPanels({
                context: this.getContext(),
                resizeable: true,
                rightWidth: 320,
                rightMinWidth: 320,
                main: {
                    label: 'Main',
                    content: this.mainRegion
                },
                right: [
                    {
                        label: i18n.get('SUPERVISION.LABEL'),
                        value: i18n.get('SUPERVISION.VALUE'),
                        icon: 'mail',
                        type: 'external'
                    },
                    {
                        label: i18n.details,
                        value: 'details',
                        icon: 'info',
                        content: this.selectedNodeProperties,
                        expanded: this.rightPanelExpanded,
                        primary: true
                    }
                ]
            }));
        },

        handleNotificationPanel: function(e) {
            this.getNotifications(this.user);
            if (e === 'Supervisions') {
                this.supervisionWidget.topologyDropdownValue = this.mainRegion.topologyVisualisation.topologyHeader.topologyDropdown.getValue();
                container.getEventBus().publish('flyout:show', {
                    header: i18n.get('SUPERVISION.LABEL'),
                    content: this.supervisionWidget
                });
            }
        },

        getNotifications: function() {
            this.getEventBus().publish('supervision:showLoader');
            return Rest.fetchNotifications(this.userName)
                .then(function(res) {
                    var tmp = [];
                    for (var key in res) {
                        if (res[key].STATUS === 'FAIL') {
                            res[key].ERROR = i18n.get('NOTIFICATION_PANEL.ERROR_TIMEDOUT');
                        }
                        res[key].eventbus = this.getEventBus();
                        tmp.push(res[key]);
                    }
                    this.getEventBus().publish('supervision:setWebPushData', tmp);
                    this.getEventBus().publish('supervision:hideLoader');
                }.bind(this)
            ).catch(function(error) {
                this.getEventBus().publish('supervision:hideLoader');
                Utils.showDialog('error', error.message, error.body);
            }.bind(this));
        },

        /*
         @desc remove the location listener when the application has been unloaded/stopped
         */
        onStop: function() {
            this.locationController.removeLocationListener(this.locationListenerId);
        },

        /*
         @desc method to group events that the presenter needs to subscribe to
         */
        subscribeToEvents: function() {
            if (this.getEventBus() && this.getEventBus().subscribe) {
                this.getEventBus().subscribe('attributesRegion:save:success', this.handleAttributeChange, this);
                this.getEventBus().subscribe(Constants.CustomEvent.NODE_OBJECT_SELECT, this.onNodeSelect, this);
                this.getEventBus().subscribe('layouts:rightpanel:afterchange', this.onRightPanelToggle, this);
                this.getEventBus().subscribe('topologyTree:fetch:subtree:error:closed', this.navigateToPreviousPoid, this);
                this.getEventBus().subscribe('topologyTree:contextMenu:show', this.onContextMenu, this);
                this.getEventBus().subscribe('topologyBrowser:change:url', this.changeLocation, this);
                this.getEventBus().subscribe('attributesRegion:updateCurrentFDN', this.updateCurrentFDN, this);
                this.getEventBus().subscribe(Constants.CustomEvent.REFRESH_COMPLETE, this.onTreeRefreshCompleted, this);
                this.getEventBus().subscribe('topologybrowser:reload-actions', this.updateActionBar, this);
                this.getEventBus().subscribe('layouts:panelaction', this.handleNotificationPanel, this);
                this.getEventBus().subscribe('supervision:resultCell:removeCell', this.removeRow.bind(this));
            }
        },

        changeLocation: function(location) {
            if (location.previousTopology) {
                location.locationParamObject.topology = this.previousTopology;
                this.getEventBus().subscribe(Constants.CustomEvent.LOADER_SHOW, this.showLoader, this);
                this.getEventBus().publish('topologyHeader:topologyDropdown:change', {topologyState: {}, select: Constants.NETWORK_DATA});
            } else {
                this.setLocation(location.locationParamObject, location.preventListeners, location.redirect);
            }


        },

        setLocation: function(locationObject, preventListeners, redirect) {
            preventListeners = !!preventListeners;
            redirect = !!redirect;
            var locationParamObject = locationObject ? locationObject : {};
            var location = Constants.TOPOLOGY_BROWSER;
            this.currentTopology = Constants.NETWORK_DATA;

            if (locationParamObject.poid && !this.isRootPoId(locationParamObject.poid)) {
                location = Constants.POID_URL + locationParamObject.poid;
                this.currentTopology = Constants.NETWORK_DATA;
            }
            else if (locationParamObject.topology && locationParamObject.topology !== Constants.NETWORK_DATA) {
                if (locationParamObject.fullPath) {
                    location = Constants.TOPOLOGY_URL + locationParamObject.topology + '&fullpath=' + locationParamObject.fullPath;
                    this.isFullPath = true;
                } else {
                    location = Constants.TOPOLOGY_URL + locationParamObject.topology;
                    this.isFullPath = false;
                }
                this.currentTopology = Constants.TOPOLOGY;

            }
            else if (this.poidParam && locationParamObject.topology === Constants.NETWORK_DATA) {
                location = Constants.POID_URL + this.poidParam;
                this.currentTopology = Constants.NETWORK_DATA;
                this.isFullPath = false;
            }
            this.locationController.setLocation(location, preventListeners, redirect);
            this.poidParam = null;
            this.topologyParam = null;

            if (!redirect) {
                this.previousPoid = locationParamObject.poid;
                this.previousTopology = locationParamObject.topology;
                this.previousFullPath = locationParamObject.fullPath;
            }
        },

        launchNetworkExplorer: function() {
            var networkExplorerLink = 'networkexplorer/?goto=' + this.getTopologyBrowserGotoParams(location.hash) + this.getTopologyBrowserSingleSelectionParams();
            if (this.currentTopology === Constants.TOPOLOGY) {
                networkExplorerLink = 'networkexplorer/?goto=topologybrowser' + this.getTopologyBrowserSingleSelectionParams();
                showConfirmDialog(
                    i18n.searchForObject.dialog.title,
                    i18n.searchForObject.dialog.content + ' ' + i18n.searchForObject.dialog.secondaryContent,
                    onOkClicked.bind(this, networkExplorerLink),
                    onCancelClicked.bind(this),
                    i18n.searchForObject.dialog.optionalContent
                );
            } else {
                location.hash = networkExplorerLink;
            }

        },

        /*
         @desc method to enable the Topology FDN in a Dialog pop-up
         */
        openTopologyFDN: function() {
            //Create TopologyFDN
            this.topologyFDN = new TopologyFDN({
                context: this.getContext()
            });


            createDialogFDN.call(this, this.view.getSelectedTopologyText());

            if (this.currentFDN.length > 0) {
                this.topologyFDN.pathWidget.setText(this.currentFDN);
            }
            if (this.topologyFDN.pathWidget.text.length > 0) {
                this.topologyFDN.pathWidget.setText(this.currentFDN);
                this.fdnDialog.getElement().getNative().getElementsByClassName('ebBtn')[0].disabled = false;
            } else {
                this.fdnDialog.getElement().getNative().getElementsByClassName('ebBtn')[0].disabled = true;
            }

            this.topologyFDN.pathWidget.view.getInput().addEventHandler('keyup', function() {
                if (this.topologyFDN.pathWidget.view.getInputValue().length > 0) {
                    this.fdnDialog.getElement().getNative().getElementsByClassName('ebBtn')[0].disabled = false;
                } else {
                    this.fdnDialog.getElement().getNative().getElementsByClassName('ebBtn')[0].disabled = true;
                }
            }, this);

            this.topologyFDN.pathWidget.view.getInput().addEventHandler('keydown', function(e) {
                if (e.originalEvent.key === 'Enter' && !this.fdnDialog.getElement().getNative().getElementsByClassName('ebBtn')[0].disabled) {
                    e.stopPropagation();
                    e.preventDefault();

                    this.fdnDialog.getElement().getNative().getElementsByClassName('ebBtn')[0].click();
                }
            }, this);

            this.fdnDialog.show();
        },

        onTreeRefreshCompleted: function(lastSelectedId) {
            if (lastSelectedId) {
                this.getContext().eventBus.publish('attributesRegion:load', TopologyUtility.getChildPoid(lastSelectedId));
            }
        },

        /*
         This function provides encoding of the url
         Needed to for return poid entry point if NE search is cancelled
         */
        getTopologyBrowserGotoParams: function(hash) {
            var locationState = new LocationState(this.appName);
            locationState.updateFromHash(hash);
            return encodeURIComponent(locationState.toUrl());
        },

        getTopologyBrowserSingleSelectionParams: function() {
            var locationState = new LocationState(this.appName);
            locationState.set('returnType', 'singleObject');
            return locationState.toUrl();
        },

        handleAttributeChange: function(data) {
            var changesToBeSaved = data.attributes.length > 1 ? i18n.atrributesChanged.replace('$1', data.attributes.length) : i18n.atrributeChanged;

            this.successNotification = new Notification({
                color: 'green',
                icon: 'ebIcon ebIcon_tick',
                label: changesToBeSaved,
                content: 'success',
                showCloseButton: true,
                showAsToast: true,
                autoDismiss: true,
                autoDismissDuration: 2000
            });

            this.successNotification.attachTo(this.getElement());
        },

        showErrorMessage: function(error) {
            var header = error.title || 'Unknown Error';
            var content = error.message || 'Check the server';

            showErrorDialog(header, content, function() {
                if (this.currentTopology === Constants.TOPOLOGY && !this.isFullPath) {
                    this.navigateToPreviousTopology();
                }
                else if (this.currentTopology === Constants.TOPOLOGY && this.isFullPath) {
                    this.navigateToPreviousFullPath();
                }
                else {
                    this.navigateToPreviousPoid();
                }

            }.bind(this));
        },

        /*
         @desc method to add location awareness
         */
        createLocationController: function() {
            var locationController = new LocationController({
                namespace: Constants.TOPOLOGY_BROWSER
            });
            this.locationListenerId = locationController.addLocationListener(this.onLocationChange, this);

            return locationController;
        },

        /*
         * @desc called when url is changed manually
         */
        onLocationChange: function(hash) {
            // extract values after slash ...
            var poidParam = this.getPOIdParam(hash);
            var launchContextId = this.getLaunchContextIdParam(hash);
            var topologyParam = this.getTopologyParam(hash);
            var fullPathParam = this.getFullPathParam(hash);

            if (topologyParam) {
                if (this.isValidPoId(topologyParam)) {
                    //url contain topology, custom topology
                    var topologyState;
                    this.topologyParam = topologyParam;
                    this.currentTopology = Constants.TOPOLOGY;

                    if (!this.previousTopology) {
                        this.previousTopology = topologyParam;
                    }

                    var ids = separateIds(fullPathParam);
                    ids[0] = this.topologyParam;
                    var transformIds = transformId(ids);
                    var lastSelectedId = transformIds.pop();

                    if (fullPathParam) {
                        if (validateIds.call(this, ids)) {
                            if (!this.previousFullPath) {
                                this.previousFullPath = fullPathParam;
                            }
                            this.isFullPath = true;
                            topologyState = {
                                expansion: {},
                                selection: {},
                                lastSelectionId: lastSelectedId,
                                selectionIds: [lastSelectedId],
                                expansionIds: transformIds,
                                isHardRefresh: true
                            };

                            this.getEventBus().publish('topologyHeader:topologyDropdown:change', {topologyState: topologyState, select: topologyParam});
                        }
                        else {
                            setTimeout(function() {
                                this.showErrorMessage(new customError.NetworkObjectNotFound());
                            }.bind(this), 100);
                        }

                    } else {
                        this.getEventBus().publish('topologyHeader:topologyDropdown:change', {topologyState: {}, select: topologyParam});
                    }
                }
                else {
                    setTimeout(function() {
                        this.showErrorMessage(new customError.NetworkObjectNotFound());
                    }.bind(this), 100);
                }
            }
            else {
                //url for default
                if (this.currentTopology === Constants.TOPOLOGY) {
                    showConfirmDialog(
                        i18n.customTopologyWarning.dialog.title,
                        i18n.customTopologyWarning.dialog.content,
                        function() { proceedNetworkDataUrl.call(this, poidParam, launchContextId); }.bind(this),
                        function() { this.navigateToPreviousTopology(); }.bind(this),
                        i18n.customTopologyWarning.dialog.optionalContent
                    );
                } else {
                    proceedNetworkDataUrl.call(this, poidParam, launchContextId);
                }
            }
        },

        navigateToPreviousPoid: function() {
            this.setLocation({poid: this.previousPoid}, false, true);
        },

        navigateToPreviousTopology: function() {
            this.setLocation({topology: this.previousTopology}, false, true);
        },

        navigateToPreviousFullPath: function() {
            this.setLocation({topology: this.previousTopology, fullPath: this.previousFullPath}, false, true);
        },

        /*
         * @desc event called when a node is selected
         */
        onNodeSelect: function(selection) {
            var objects = selection.networkObjects.concat(selection.nestedCollections);
            var poid = selection && selection.lastSelectedObject ? selection.lastSelectedObject.id : undefined;
            var lastObject = selection && selection.lastSelectedObject ? selection.lastSelectedObject : undefined;
            var topology = '';
            var isCustomCollection = false;
            var fullPath = '';

            //Update actions
            delete this.currentActions;
            var objs = objects
                .map(function(o) {
                    return {
                        id: o.id,
                        moType: o.type,
                        neType: o.neType,
                        type: o.type,
                        subType: o.subType,
                        query: o.query,
                        parentId: o.parent,
                        level: o.level,
                        name: o.label,
                        category: o.category,
                        enableRemoveNodeButton: o.enableRemoveNodeButton,
                        enableMoveToCollectionButton: o.enableMoveToCollectionButton,
                        hybrid: o.hybrid,
                        selectedTopologyName: this.mainRegion ? this.mainRegion.topologyVisualisation.topologyHeader.topologyDropdown.getValue().name : undefined
                    };
                }.bind(this));
            this.updateActionBar(objs);

            //handle custom topology selection
            if (lastObject && TopologyUtility.isCollection(lastObject)) {

                lastObject.parents.forEach(function(parent) {
                    fullPath = fullPath ? parent + '>' + fullPath : parent;
                });
                fullPath = fullPath ?  (fullPath + '>' + lastObject.id) : lastObject.id;

                // prevent reselect
                // if last selection is equal to previous one we don't want to reload attributes region and fdn
                if (this.previousFullPath === fullPath) { return false; }

                //FDN and details
                if (fullPath === '') {
                    this.getEventBus().publish('updateFDNPath');
                    this.getEventBus().publish('attributesRegion:clear');
                } else {
                    this.getEventBus().publish(Constants.CustomEvent.LOAD_COLLECTION_DETAILS, lastObject.id);
                }

                topology = lastObject.parents.length > 0 ? lastObject.parents.pop() : lastObject.id;
                poid = undefined;
            }

            //handle Network Data Selection
            else if (lastObject && !TopologyUtility.isCollection(lastObject)) {
                if (poid === this.allSubnetworksNetworkPoId) { poid = undefined; }
                if (poid === undefined) { this.topologyFDN.pathWidget.setText(''); }
                // prevent reselect
                // if last selection is equal to previous one we don't want to reload attributes region and fdn
                if (this.previousPoid === poid) { return false; }

                //FDN and details
                if (this.isRootPoId(poid)) {
                    this.getEventBus().publish('updateFDNPath');
                    this.getEventBus().publish('attributesRegion:clear');
                } else {
                    this.getEventBus().publish('attributesRegion:load', poid);
                }
            }

            //handle clear selection
            else if (objects.length <= 0) {
                this.getEventBus().publish('clearFDNInput');
                this.getEventBus().publish('updateFDNPath');
                this.getEventBus().publish('attributesRegion:clear');
                if (this.currentTopology === 'topology') {
                    topology = this.previousTopology;
                }
            }

            // change location on url without triggering onLocationChange
            this.setLocation({
                poid: poid,
                topology: topology,
                fullPath: fullPath,
                isCustomCollection: isCustomCollection
            }, true);
        },

        /**
         * Passes selected objects to launcher utils in order to fetch actions.
         *
         * @private
         * @method updateActionBar
         * @param {Array} objects: selected tree object items
         */
        updateActionBar: function(objects) {
            objects = objects || [];
            if (objects.length > 0) {
                this.launcherUtils.createLauncherAction(objects, this.updateActionBar.bind(this))
                    .then(function(actions) {
                        this.getEventBus().publish('topsection:contextactions', actions.actionBarActions);
                        this.currentActions = actions;
                        this.displayContextMenu(actions);
                    }.bind(this))
                    .catch(this.showActionsErrorDialog);
            } else {
                this.getEventBus().publish('topsection:contextactions', this.defaultActions);
            }
        },

        /**
         * Sets current context menu event and shows context menu if actions are already fetched.
         *
         * @private
         * @method onContextMenu
         * @param {Event} e: right click event
         * @param {Boolean} fetchActions: whether or not actions should be fetched
         */
        onContextMenu: function(e, fetchActions) {
            this.contextMenuEvent = e;
            if (!fetchActions) {
                this.displayContextMenu(this.currentActions);
            }
        },

        /**
         * Populates context menu with current actions.
         *
         * @private
         * @method displayContextMenu
         * @param {Array} actions: actions fetched from Action Library
         */
        displayContextMenu: function(actions) {
            if (this.contextMenuEvent) {
                if (actions && actions.contextMenuActions && actions.contextMenuActions.length > 0) {
                    actions = actions.contextMenuActions.filter(function(action) {
                        return action.actionBarOnly !== true;
                    });
                    container.getEventBus().publish('contextmenu:show', this.contextMenuEvent, actions, { persistent: true });
                }
                delete this.contextMenuEvent;
            }
        },

        /**
         * Shows error dialog if actions cannot be fetched.
         *
         * @private
         * @method showActionsErrorDialog
         */
        showActionsErrorDialog: function() {
            showErrorDialog(i18n.errors.actionsFetchError.title, i18n.errors.actionsFetchError.body);
            container.getEventBus().publish('contextmenu:hide');
        },

        updateCurrentFDN: function(fdn) {
            if (typeof fdn === 'string') {
                this.currentFDN = fdn;
            }
        },

        onRightPanelToggle: function(expanded) {
            this.rightPanelExpanded = expanded;
        },

        getPoidFromLaunchContext: function(launchContextId) {
            LaunchContext.get(launchContextId, function(context) {
                var poid = context.contents[0].id;
                this.setLocation({poid: poid}, false, true);
            }.bind(this), function() {
            });
        },

        /*
         @desc Returns the correctness of url
         */
        getPOIdParam: function(string) {
            var match = string ? string.match(this.poidParamRegex):null;
            return (match) ? match[1] : undefined;
        },

        /*
         @desc Returns the correctness of topology
         */
        getTopologyParam: function(string) {
            var match = string ? string.match(this.topologyParamRegex):null;
            return (match) ? match[1] : undefined;
        },

        /*
         @desc Returns the correctness of object
         */
        getFullPathParam: function(string) {
            var match = string ? string.match(this.fullPathParamRegex):null;
            return (match) ? match[1] : undefined;
        },

        /*
         @desc Returns the correctness of url
         */
        getLaunchContextIdParam: function(string) {
            var match = string.match(this.launchContextIdParamRegex);
            return (match) ? match[1] : null;
        },

        /*
         @desc utility method to validate the poid
         @param poid input to validate
         */
        isValidPoId: function(poid) {
            return (poid !== null && this.isNumeric(poid));
        },
        /*
         @desc utility method to validate the poid
         @param poid input to validate
         */
        isRootPoId: function(poid) {
            return (poid === null || typeof poid === 'undefined' || poid === '');
        },

        /*
         @desc utility method to validate the launch context
         @param launch context input to validate
         */
        isValidLaunchContextId: function(launchContextId) {
            return (launchContextId !== null && this.isNumeric(launchContextId));
        },

        /*
         @desc utility method to check if an input is numeric
         @param n input to check
         */
        isNumeric: function(n) {
            return !isNaN(n) && isFinite(n) && n !== '';
        },

        createMainRegion: function() {
            return new Main({
                context: this.getContext(),
                selectedTopology: this.topologyParam
            });
        },

        createNewSelectedNodeRegion: function() {
            return new AttributesRegion({
                context: this.getContext()
            });
        },

        getPoid: function() {
            return this.poidParam ? this.poidParam : null;
        },

        onActionSuccessCallBack: function(object) {
            if (object && object.action === 'networkexplorer-set-to-public') {
                container.getEventBus().publish('topologybrowser:reload-action-bar',  object.data.id);
            }
            return container.getEventBus().publish('topologybrowser:action-successful', object);
        },

        onActionFailureCallBack: function() {
            return container.getEventBus().publish('topologybrowser:action-failed');
        },

        getTopology: function() {
            return this.topologyParam ? this.topologyParam : null;
        },

        removeRow: function(data) {
            this.supervisionWidget.removeRowData(data);
        },

    });

    function showErrorDialog(header, body, dialogOnClickOK) {
        var dialog = TopologyUtility.createDialog('error', header, body, dialogOnClickOK);
        dialog.show();
    }

    function showConfirmDialog(header, body, dialogOnClickOK, dialogOnClickCCancel, optionalContent) {
        var dialog = TopologyUtility.createDialog('warning', header, body, dialogOnClickOK, dialogOnClickCCancel, optionalContent);
        dialog.show();
    }

    function proceedNetworkDataUrl(poidParam, launchContextId) {
        if (this.isValidLaunchContextId(launchContextId)) {
            this.getPoidFromLaunchContext(launchContextId);
        }
        else if (this.isValidPoId(poidParam) || this.isRootPoId(poidParam)) {
            this.poidParam = poidParam;

            //this.getEventBus().publish('topologyTree:load', this.getPoid());
            this.getEventBus().publish('topologyHeader:topologyDropdown:change', {
                select: Constants.NETWORK_DATA,
                poid: this.getPoid()
            });

            if (this.isRootPoId(poidParam)) {
                this.getEventBus().publish('attributesRegion:clear');
            }
        }
        else {
            this.poidParam = undefined;

            // we show the dialog with a delay
            // because VirtualScrollbar (from dataviz) hides the dialog for some reason
            setTimeout(function() {
                this.showErrorMessage(new customError.NetworkObjectNotFound());
            }.bind(this), 100);
        }
    }

    function onOkClicked(networkExplorerLink) {
        location.hash = networkExplorerLink;
        this.currentTopology = Constants.NETWORK_DATA;
    }

    function onCancelClicked() {
        this.currentTopology = Constants.TOPOLOGY;
    }

    function separateIds(fullPath) {
        if (typeof fullPath === 'string') {
            return fullPath.split('>');
        } else {
            return [];
        }

    }

    function transformId(ids) {
        return ids.map(function(element, index, array) {
            if (index === 0) {
                return 'null:' + element;
            } else {
                return array[index - 1] + ':' + element;
            }
        });
    }

    function validateIds(ids) {
        var isValid = true;
        ids.forEach(function(id) {
            isValid = isValid && this.isValidPoId(id);
        }.bind(this));
        return isValid;
    }

    function createDialogFDN(currentTopology) {
        //Create FDN dialog for user
        if (this.fdnDialog) {
            this.fdnDialog.destroy();
        }

        var inputText;
        this.fdnDialog = new Dialog({
            header: i18n.enterFDN.header,
            content: this.topologyFDN,
            buttons: [{
                caption: i18n.enterFDN.browse,
                modifiers: [{
                    disabled: 'true'
                }],
                action: function() {
                    inputText = this.topologyFDN.pathWidget.getText();
                    if (currentTopology !== Constants.NETWORK_DATA_VIEW && inputText.length > 0) {
                        this.fdnDialog.hide();
                        showConfirmDialog(
                            i18n.customTopologyWarning.dialog.title,
                            i18n.customTopologyWarning.dialog.content,
                            function() {
                                this.getContext().eventBus.publish('updateFDNPath');
                                this.topologyFDN.pathWidget.setText('');
                            }.bind(this),
                            function() { this.fdnDialog.show(); }.bind(this),
                            i18n.customTopologyWarning.dialog.optionalContent
                        );
                    }
                    else {
                        this.getContext().eventBus.publish('updateFDNPath');
                        this.fdnDialog.hide();
                        this.topologyFDN.pathWidget.setText('');
                    }
                }.bind(this)
            }, {
                caption: i18n.enterFDN.cancel,
                action: function() {
                    this.fdnDialog.destroy();
                    this.topologyFDN.pathWidget.setText('');
                }.bind(this)
            }],
            type: 'default'
        });
    }

    //Hack to force reload of css to overcome bug on chrome
    function reloadCss() {
        this.view.setMainViewStyle('width', '100%');
        this.view.setMainViewStyle('width', 'inherit');
    }

});
