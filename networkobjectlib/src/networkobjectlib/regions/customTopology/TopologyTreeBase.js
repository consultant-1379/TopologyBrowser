/* eslint-disable no-unused-vars */
define([
    'jscore/core',
    'container/api',
    'jscore/ext/privateStore',
    'jscore/ext/utils',
    'jscore/ext/utils/base/underscore',
    'dataviz/Tree',
    'dataviz/MillerColumns',
    'widgets/Loader',
    'widgets/Dialog',
    'widgets/InlineMessage',
    '../../widgets/NodeItem/NodeItem',
    'i18n!networkobjectlib/dictionary.json',
    './CustomTopologyView',
    '../topologyTree/TreeMemory',
    '../../utils/Constants',
    '../../utils/TopologyUtility',
    'networkobjectlib/widgets/FormWidgets/RefreshDialogWidget/RefreshDialogWidget',
    'networkobjectlib/widgets/RefreshNotification/RefreshNotification',
    '../../utils/customError'
], function(core, container, PrivateStore, utils, _, Tree, MillerColumns, Loader, Dialog, InlineMessage, NodeItem, i18n,
    View, TreeMemory, Constants, Utility, RefreshDialogWidget, RefreshNotification, customError) {

    var Visualisations = {
        'tree': Tree,
        'miller-columns': MillerColumns
    };

    var isRefreshOn = false;
    var store = PrivateStore.create();

    var TopologyTreeBase = core.Region.extend({

        init: function() {
            this.memory = new TreeMemory();
            this.previousMemory = null;
            this.subscribeEvents = {};
            this.containerSubscribeEvents = {};
            this.eventHandlers = {};
            this.errorDashboard = null;
            this.previousSelections = [];
            this.unSelectableTypes = ['noChildrenObject', 'branch'];
            this.permutationSelectTypes = [];
            this.rule = {
                branch: {branch: false, leaf: false, node: false},
                leaf: {leaf: false, branch: false, node: false},
                node: {node: false, branch: false, leaf: false}
            };
            store(this).options = {
                multiselect: false,
                applyRecursively: false
            };

            if (this.options.state) {
                this.setTopologyState(this.options.state);
            }

            utils.extend(store(this).options, _.clone(this.options, true), true);
            store(this).topologyState = {};
            store(this).previousSelection = [];
            store(this).serverCallIds = [];
            store(this).allSelectionWithExpansions = {};
            store(this).dialog = null;

            if (this.options.showHeader && this.options.showHeader.showTopology) {
                this.initSelectOptions(this.options.showHeader.showTopology.selection);
                this.initPermutationOptions(this.options.showHeader.showTopology.selection.combination);
                this.initRules();
                this.onInit();
            }
        },

        setIsRefreshOn: function(refreshOn) {
            isRefreshOn = refreshOn;
        },

        initSelectOptions: function(options) {
            var name = {
                collectionOfCollections: 'branch',
                collectionOfObjects: 'leaf',
                networkObjects: 'node'
            };
            for (var option in options) {
                var index  = this.unSelectableTypes.indexOf(name[option]);
                if (options[option] === 'none') {
                    if (index === -1) {
                        this.unSelectableTypes.push(name[option]);
                    }
                } else {
                    if (options[option] === 'multi') {
                        this.permutationSelectTypes = this.permutationSelectTypes.concat([[name[option], name[option]]]);
                    }
                    //remove any 'none' select
                    if (index > -1) {
                        this.unSelectableTypes.splice(index, 1);
                    }
                }
            }
        },

        initPermutationOptions: function(options) {
            var collection = [
                ['leaf', 'branch'],
                ['branch', 'leaf']
            ];
            var networkObjects = [
                ['node', 'branch'],
                ['branch', 'node'],
                ['leaf', 'node'],
                ['node', 'leaf']
            ];

            if (options.collection && options.networkObjects) {
                this.permutationSelectTypes = this.permutationSelectTypes.concat(collection).concat(networkObjects);
            }
            if (!options.collection && options.networkObjects) {
                this.permutationSelectTypes = this.permutationSelectTypes.concat(networkObjects);
            }
            if (options.collection && !options.networkObjects) {
                this.permutationSelectTypes = this.permutationSelectTypes.concat(collection);
            }
        },

        initRules: function() {
            this.permutationSelectTypes.forEach(function(combination) {
                this.rule[combination[0]][combination[1]] = true;
            }.bind(this));
        },

        onStart: function() {
            this.showLoader();
            this.changeView('tree', 0);
            subscribeEvents.call(this);
            // this.load();
            this.afterStart();
        },

        onStop: function() {
            unSubscribeEvents.call(this);
            this.afterStop();
        },

        /**
         * Load object(s) on tree.
         *
         * @method load
         * @param topologyState - optional
         *
         *  topologyState.selectionIds - list of ids of selection on the tree.
         *  topologyState.expansionIds - list of ids of expansion on the tree.
         *  topologyState.lastSelectionId - last selection id.
         *  topologyState.selection - selection objects as key value representation. key: selection id, value: selection object
         *  topologyState.expansion - expansion objects as key value representation. key: expansion id, value: expansion object
         *
         */
        load: function(topologyState) {
            isRefreshOn = true;
            //1) get the state of topology from either param or topology
            var topology = topologyState ? topologyState : this.getCurrentTopologyState();
            var promises = [];
            this.setTopologyState(topology);
            this.previousMemory = utils.clone(this.memory);
            store(this).allSelectionWithExpansions = {};
            this.selection = {};

            // Prepare selections and expansions
            prepareSelectionsAndExpansions.call(this);

            // Left side of the network
            processLeftSide.call(this, promises);

            // reset some stuff
            this.memory.clearAll();
            store(this).previousSelection = [];
            //TODO after mavericks fix the response of all actions, move this to launcherutils 105 - 111
            var selectedObjects = Object.keys(this.selection);
            if (selectedObjects.length === 1 && this.selection[selectedObjects[0]] !== undefined) {
                if (Utility.isCollection(this.selection[selectedObjects[0]])) {
                    var collectionDetailsPoid = Utility.getChildPoid(this.selection[selectedObjects[0]].id);
                    this.getEventBus().publish(Constants.CustomEvent.LOAD_COLLECTION_DETAILS, collectionDetailsPoid);
                }
            }

            return ProcessPromises.call(this, promises, store);
        },

        /**
         * Load object(s) on tree when event trigger 'topologyTree:load'
         * @method onLoad
         */
        onLoad: function() {

        },

        /**
         * Refresh the topology
         *
         * @method refresh
         */
        refresh: function(topologyState) {
            if (!isRefreshOn) {
                var refreshType = (topologyState && topologyState.isHardRefresh) ?
                    this.hardRefresh(topologyState) :
                    this.load(topologyState);
                return refreshType.then(function() {
                    this.getEventBus().publish(Constants.CustomEvent.REFRESH_COMPLETE);
                }.bind(this));
            }
        },

        /**
         * Hard refresh
         * @param topologyState
         */
        hardRefresh: function(topologyState) {
            isRefreshOn = true;
            //1) get the state of topology from either param or topology
            var topology = topologyState ? topologyState : this.getCurrentTopologyState();
            var promises = [];
            this.setTopologyState(topology);
            this.previousMemory = utils.clone(this.memory);

            //Get Root data
            promises.push(this.getRoots.call(this, this.options.customTopologyId).then(function(obj) {
                if (obj) {
                    obj.children = 1;
                    return obj;
                }
            }.bind(this)));

            var allServerCallIds = utils.clone(store(this).topologyState.expansionIds);

            if (store(this).topologyState.lastSelectionId) {
                allServerCallIds.push(store(this).topologyState.lastSelectionId);
            }

            allServerCallIds.forEach(function(poid) {

                promises.push(this.getChildrenForHardRefresh.call(this, poid).then(function(objects) {
                    return objects;
                }.bind(this)));

            }.bind(this));

            // reset some stuff
            this.memory.clearAll();
            store(this).previousSelection = [];

            return ProcessHardRefreshPromises.call(this, promises, store);
        },

        showRefreshNotification: function(event) {
            var topologyState = this.getCurrentTopologyState();

            // check if at least one collection is expanded and public
            var isIdExpandedAndPublic = topologyState.expansion.some(function(item) {
                return item.id.indexOf(event.collectionId) !== -1 && item.category ? item.category.toLowerCase().trim() === 'public' : false;
            });

            // check if at least one collection is selected and public
            var isIdSelectedAndPublic = topologyState.selection.some(function(item) {
                return item.id.indexOf(event.collectionId) !== -1 && item.category ? item.category.toLowerCase().trim() === 'public' : false;
            });

            if (isIdExpandedAndPublic || isIdSelectedAndPublic) {
                if (this.refreshNotification) {
                    this.refreshNotification.detach();
                    this.refreshNotification.destroy();
                }
                this.refreshNotification = new RefreshNotification({
                    autoDismiss: false,
                    collectionName: event.collectionName
                });
                this.refreshNotification.attachTo(this.getElement());
            }
        },

        getCurrentTopologyState: function() {
            var topologyState = {};
            topologyState.expansion  = this.visualisation.getExpansions();
            topologyState.selection  = this.visualisation.getSelectedIds().map(function(id) { return this.memory.get(id); }.bind(this));
            topologyState.lastSelectionId  = this.visualisation.getLastSelectedId();
            topologyState.selectionIds  = this.visualisation.getSelectedIds();
            topologyState.expansionIds  = this.visualisation.getExpansions().map(function(expansion) { return expansion.id; });
            return topologyState;
        },

        /**
         * Getter method for topologyState.
         * @method getTopologyState
         * @returns {Object} topologyState
         *
         *  topologyState.selectionIds - list of ids of selection on the tree.
         *  topologyState.expansionIds - list of ids of expansion on the tree.
         *  topologyState.lastSelectionId - last selection id.
         *  topologyState.selection - selection objects as key value representation. key: selection id, value: selection object
         *  topologyState.expansion - expansion objects as key value representation. key: expansion id, value: expansion object
         */
        getTopologyState: function() {
            return store(this).topologyState;
        },

        /**
         * Setter method for topologyState
         *
         * @method setTopologyState
         * @param topologyState - without param reset the topologyState
         *
         *  topologyState.selectionIds - list of ids of selection on the tree.
         *  topologyState.expansionIds - list of ids of expansion on the tree.
         *  topologyState.lastSelectionId - last selection id.
         *  topologyState.selection - selection objects as key value representation. key: selection id, value: selection object
         *  topologyState.expansion - expansion objects as key value representation. key: expansion id, value: expansion object
         */
        setTopologyState: function(topologyState) {
            if (topologyState) {
                store(this).topologyState.expansionIds = Array.isArray(topologyState.expansionIds) ? topologyState.expansionIds: [];
                store(this).topologyState.selectionIds =  Array.isArray(topologyState.selectionIds) ? topologyState.selectionIds: [];
                store(this).topologyState.lastSelectionId = topologyState.lastSelectionId ? topologyState.lastSelectionId : '';
                store(this).topologyState.selection = topologyState.selection ? topologyState.selection: {};
                store(this).topologyState.expansion = topologyState.expansion ? topologyState.expansion: {};
            } else {
                store(this).topologyState.expansionIds = [];
                store(this).topologyState.selectionIds = [];
                store(this).topologyState.lastSelectionId = '';
                store(this).topologyState.selection = {};
                store(this).topologyState.expansion = {};
            }
        },

        /**
         * Create visualisation and attach to view.
         *
         * @private
         * @method changeView
         * @param view
         * @param rootItems
         */
        changeView: function(view, rootItems) {
            var totalRootItems = rootItems || 0;
            if (this.visualisation) {
                totalRootItems = totalRootItems || this.visualisation.options.totalRootItems;
                this.visualisation.destroy();
            }

            this.visualisation = createVisualisation.call(this, view, totalRootItems);
            this.visualisation.attachTo(this.view.getTree());
            this.subscribeVisualisationEvents();
            resize.call(this);   // Fix for shortened scrollbar
        },

        /**
         * Show loader
         *
         * @method showLoader
         */
        showLoader: function() {
            if (this.loader) {
                this.loader.destroy();
                this.loader = null;
            }
            this.loader = new Loader();
            this.loader.attachTo(this.view.getTree());
        },

        /**
         * Hide loader
         *
         * @method hideLoader
         */
        hideLoader: function() {
            if (this.loader) {
                this.loader.destroy();
            }
        },

        /**
         * Dataviz will call this method when it needs data.
         *
         * @param queries
         * @param success
         * @param error
         * @param idsOnly
         */
        queryData: function(queries, success, error, idsOnly) {
            var output = [];
            var promises = [];
            var parent;
            var newParentChildren;

            if (queries.length === 1 && queries[0].offset === 0 && queries[0].limit === 0 && queries[0].parent === null) {
                error();
                return;
            }

            function mapObjects(obj) {
                obj.showNodeCount = this.options.showNodeCount;
                return idsOnly ? obj.id : Utility.convertToTreeItem(obj, this.memory);
            }

            queries.forEach(function(query) {
                // If children are not in memory...
                if (!this.memory.hasChildren(query.parent)) {
                    // fetch children from api and add to the memory
                    var promise = this.getChildrenForSoftRefresh.call(this, query.parent)
                        .then(function(objects) {
                            //Save to memory
                            this.memory.addObjects(objects);
                            parent = this.memory.get(query.parent);

                            //If parent doesn't has children then add NoChildrenObject
                            if (parseInt(objects.length) === 0) {
                                newParentChildren = 1;

                                var noChildren = Utility.createNoChildrenObject(parent.id);
                                this.memory.addObject(noChildren.id, noChildren, noChildren.parent);
                            }
                            else if (parent.children !== parseInt(objects.length)) {
                                newParentChildren = parseInt(objects.length);
                            }
                            output.push({
                                parent: query.parent,
                                items: objects
                                    .map(mapObjects.bind(this))
                                    // .splice(query.offset, query.limit)
                            });
                        }.bind(this));

                    promises.push(promise);
                } else {
                    var objects = this.memory.getChildren(query.parent) || [];
                    output.push({
                        parent: query.parent,
                        items: objects
                            .map(function(obj) {
                                obj.showNodeCount = this.options.showNodeCount;
                                return idsOnly ? obj.id : Utility.convertToTreeItem(obj, this.memory);
                            }.bind(this))
                            .splice(query.offset, query.limit)
                    });
                }
            }.bind(this));

            // if everything is in memory, we want to handle it synchronously, otherwise the tree gets lost
            if (promises.length === 0) {
                success(output);
            }
            else {
                // calls success callback after all promises (requests) are successful
                Promise.all(promises).then(function() {
                    success(output);

                    // this is required for servers performance hack
                    if (newParentChildren) {
                        this.visualisation.collapse(parent);
                        parent.children = newParentChildren;
                        this.visualisation.expand(parent);
                    }
                }.bind(this)).catch(function() {
                    error();
                });
            }
        },

        redraw: function() {
            this.visualisation.redraw();
        },

        subscribeVisualisationEvents: function() {
            var scrollIndex = null;
            var selectEventId = this.visualisation.addEventHandler('selectend', this.onNodeSelect.bind(this));
            var expandEventId = this.visualisation.addEventHandler('expand', this.onExpand.bind(this));
            var scrollEventId = this.visualisation.getVirtualScrollBar().addEventHandler('change', function(index) {
                if (scrollIndex !== index) {
                    container.getEventBus().publish('contextmenu:hide');
                }
                scrollIndex = index;
            });

            // replace unsubscribe events function
            this.unsubscribeVisualisationEvents = function() {
                this.visualisation.removeEventHandler('selectend', selectEventId);
                this.visualisation.removeEventHandler('expand', expandEventId);
                this.visualisation.getVirtualScrollBar().removeEventHandler('change', scrollEventId);
            };
        },

        unsubscribeVisualisationEvents: function() {

        },

        /**
         * Hides tree and show dashboard error.
         *
         * @private
         * @method showErrorDashboard
         * @param error
         */
        showErrorDashboard: function(error) {
            if (this.errorDashboard !== null) {
                this.errorDashboard.destroy();
            }

            // reset some stuff
            store(this).previousSelection = [];
            this.memory.clearAll();

            this.view.getTree().setStyle('display', 'none');

            this.errorDashboard = new InlineMessage({
                header: error.title,
                description: error.body,
                icon: 'error'
            });
            this.view.getErrorMessageArea().removeStyle('display');
            this.errorDashboard.attachTo(this.view.getErrorMessageArea());
        },

        /**
         * Hides error dashboard
         *
         * @method hideErrorDashboard
         */
        hideErrorDashboard: function() {
            this.view.getTree().removeStyle('display');
            this.errorDashboard.destroy();
        },

        /**
         * Get root object(s)
         * Pass null (id) to get all root level objects, otherwise get root object by given id
         *
         * @method getRoots
         * @param id
         * @returns {Array<Object>} array of memory objects
         */
        getRoots: function(id) {

        },

        /**
         * Get children objects for given parent
         *
         * @method getChildrenForSoftRefresh
         * @param parentId
         * @returns {Array<Object>} array of memory objects
         */
        getChildrenForSoftRefresh: function(parentId) {

        },

        getChildrenForHardRefresh: function(parentId) {

        },

        /**
         * Unselect all nodes and select the chosen one.
         *
         * @private
         * @method select
         * @param objectIds
         */
        select: function(objectIds) {
            this.visualisation.unselectAll();
            this.visualisation.select(objectIds);
        },

        /**
         * Expand nodes for given ids
         *
         * @param ids
         * @private
         */
        expandNodes: function(ids) {
            ids.forEach(function(id) {
                var obj = this.memory.get(id);
                if (obj) {
                    this.visualisation.expand(obj);
                }
            }.bind(this));
        },

        onActionFinished: function(actionResponse) {
            var parent = null;
            var parents = [];
            var topologyState = {};
            var id = this.visualisation.getLastSelectedId();

            if (id) {
                parent = this.memory.get(id);
            }

            topologyState.selection = this.visualisation.getSelectedIds().map(function(id) {
                return this.memory.get(id);
            }.bind(this));
            topologyState.lastSelectionId = this.visualisation.getLastSelectedId();
            topologyState.selectionIds = this.visualisation.getSelectedIds();
            topologyState.expansion = this.visualisation.getExpansions();
            topologyState.expansionIds = this.visualisation.getExpansions().map(function(expansion) {
                return expansion.id;
            });
            if (parent) {
                if (!parent.isExpanded && Utility.isCollection(parent)) {
                    parent.isExpanded = true;
                } else {
                    parent.isExpanded = false;
                }
            }
            collectAllParentIds.call(this, parent, parents);
            parents.reverse();
            parents.push(id);
            parents.forEach(function(id) {
                topologyState.expansion[id] = this.memory.get(id);
                topologyState.expansionIds.push(id);
            }.bind(this));

            this.refresh(topologyState).then(function() {
                this.publishReloadActionBar(actionResponse, id);
            }.bind(this));
        },

        updateContentAndActionBar: function(id) {
            this.getRootsAndReloadActions(id);
        },

        onActionFailure: function() {
        },

        /**
         * Publish event reload-actions with new collection data.
         *
         * @method publishReloadActionBar
         * @private
         * @param {Object} actionResponse response from the action.
         * @param {String} id  of the selected collection
         */
        publishReloadActionBar: function(actionResponse, id) {
            if (actionResponse && actionResponse.action === 'networkexplorer-edit-search-criteria-collection') {
                var obj = JSON.parse(JSON.stringify(this.memory.get(id)));
                obj.id = Utility.getChildPoid(obj.id);
                obj.parent = Utility.getChildPoid(obj.parent);
                this.getEventBus().publish(Constants.CustomEvent.RELOAD_ACTIONS, [obj]);
            }
        },

        /**
         * Callback executed when a node is selected
         *
         * @method onNodeSelect
         * @private
         * @method onNodeSelect
         * @param {Array} ids
         */
        onNodeSelect: function(ids) {
        },

        /**
         * called whenever a node was expanded on dataviz
         *
         * @method onExpand
         * @private
         * @param object
         */
        onExpand: function(object) {
            var obj = this.memory.get(object.id);
            if (obj) {
                obj.isExpanded = true;
            }
        },

        /**
         * Executes after init
         *
         * @method onInit
         */
        onInit: function() {

        },

        /**
         * Executes after onStart
         *
         * @method afterStart
         */
        afterStart: function() {

        },

        /**
         * Executes after onStop
         *
         * @method afterStop
         */
        afterStop: function() {

        }

    });

    /**
     * Creates the tree visualisation
     *
     * @method createVisualisation
     * @private
     * @param view
     * @param rootItems
     * @returns visualisation
     */
    function createVisualisation(view, rootItems) {
        var visualisation = new Visualisations[view]({
            getData: this.queryData.bind(this),
            getIds: function(query, success, error) {
                this.queryData(query, success, error, true);
            }.bind(this),
            totalRootItems: rootItems,
            checkboxes: false,
            selectable: true,
            multiselect: store(this).options.multiselect,
            applyRecursively: store(this).options.applyRecursively,
            bindselect: false,
            itemType: NodeItem
        });

        return visualisation;
    }

    function resize() {
        if (this.visualisation) {
            requestAnimationFrame(function() {
                //If device is iPad, resize accordingly for Main application and Scoping Panel
                if (core.Window.isTouch()) {
                    //Embedded Scoping Panel
                    if (!!document.querySelector('.elScopingPanel-rScopingPanel') && !document.querySelector('.elScopingPanel-rManualScopingPanel')) {
                        this.view.getVisualisation().setStyle('height', (core.Window.getProperty('innerHeight') - 270) + 'px');
                    }
                    //Manual Scoping Panel
                    else if (!!document.querySelector('.elScopingPanel-rScopingPanel') && !!document.querySelector('.elScopingPanel-rManualScopingPanel')) {
                        this.view.getVisualisation().setStyle('height', (core.Window.getProperty('innerHeight') - 210) + 'px');
                    }
                    //Topology Browser Application
                    else {
                        this.view.getVisualisation().setStyle('height', (core.Window.getProperty('innerHeight') - 230) + 'px');
                    }
                }
                this.visualisation.redraw();
            }.bind(this));
        }
    }

    function subscribeEvents() {
        this.eventHandlers[Constants.RESIZE] = core.Window.addEventHandler(Constants.RESIZE, resize.bind(this));
        this.eventHandlers[Constants.MOUSE_DOWN] = core.Window.addEventHandler(Constants.MOUSE_DOWN, function(e) {
            // if left click && clicked outside contextmenu
            if (e.originalEvent.which === 1 && !e.originalEvent.target.closest('.elWidgets-ComponentList')) {
                container.getEventBus().publish('contextmenu:hide');
            }
        });
        this.eventHandlers[Constants.HASH_CHANGE] = core.Window.addEventHandler(Constants.HASH_CHANGE, function() {
            container.getEventBus().publish('contextmenu:hide');
        });
        this.rightClickHandlerId = this.getElement().addEventHandler('contextmenu', onRightClick.bind(this));
        this.subscribeEvents[Constants.CustomEvent.CUSTOM_TOPOLOGY_START] = this.getEventBus().subscribe(Constants.CustomEvent.CUSTOM_TOPOLOGY_START, this.hardRefresh, this);
        // this.subscribeEvents[Constants.CustomEvent.LOAD] = this.getEventBus().subscribe(this.CustomEvent.LOAD, this.load, this);
        // this.subscribeEvents[Constants.CustomEvent.LOADER_SHOW] = this.getEventBus().subscribe(Constants.CustomEvent.LOADER_SHOW, this.showLoader, this);
        // this.subscribeEvents[Constants.CustomEvent.LOADER_HIDE] = this.getEventBus().subscribe(Constants.CustomEvent.LOADER_HIDE, this.hideLoader, this);
        this.subscribeEvents[Constants.CustomEvent.SELECT] = this.getEventBus().subscribe(Constants.CustomEvent.SELECT, this.select, this);
        this.containerSubscribeEvents[Constants.CustomEvent.ACTION_SUCCESSFUL] = container.getEventBus().subscribe(Constants.CustomEvent.ACTION_SUCCESSFUL, this.onActionFinished, this);
        this.subscribeEvents[Constants.CustomEvent.REFRESH] = this.getEventBus().subscribe(Constants.CustomEvent.REFRESH, this.refresh, this);
        this.containerSubscribeEvents[Constants.CustomEvent.ACTION_FAILED] = container.getEventBus().subscribe(Constants.CustomEvent.ACTION_FAILED, this.onActionFailure, this);
        this.containerSubscribeEvents[Constants.CustomEvent.REFRESH] = container.getEventBus().subscribe(Constants.CustomEvent.REFRESH, this.refresh, this);
        this.containerSubscribeEvents[Constants.CustomEvent.RELOAD_ACTION_BAR] = container.getEventBus().subscribe(Constants.CustomEvent.RELOAD_ACTION_BAR, this.updateContentAndActionBar, this);
        this.containerSubscribeEvents[Constants.CustomEvent.SHOW_REFRESH_NOTIFICATION] =  this.getEventBus().subscribe(Constants.CustomEvent.SHOW_REFRESH_NOTIFICATION, this.showRefreshNotification, this);
    }

    function unSubscribeEvents() {
        Object.keys(this.subscribeEvents).forEach(function(key) {
            if (this.subscribeEvents[key]) {
                this.getEventBus().unsubscribe(key, this.subscribeEvents[key]);
            }
        }.bind(this));

        Object.keys(this.containerSubscribeEvents).forEach(function(key) {
            if (this.containerSubscribeEvents[key]) {
                container.getEventBus().unsubscribe(key, this.containerSubscribeEvents[key]);
            }
        }.bind(this));

        Object.keys(this.eventHandlers).forEach(function(key) {
            if (this.eventHandlers[key]) {
                core.Window.removeEventHandler(this.eventHandlers[key]);
            }
        }.bind(this));
        this.getElement().removeEventHandler(this.rightClickHandlerId);
    }

    function onRightClick(e) {
        var tableItem = this.view.getItemFromEvent(e);
        if (tableItem) {
            var tableItemId = tableItem.getAttribute('data-id');
            var obj = this.memory.get(tableItemId);
            e.originalEvent.preventDefault();
            if (!Utility.isNoChildrenObject(tableItemId) && !(obj && this.unSelectableTypes.indexOf(Utility.getObjectType(obj).toLowerCase()) !== -1)) {
                var fetchActions = false;
                var selectedIds = this.visualisation.getSelectedIds();
                if (selectedIds.indexOf(tableItemId) === -1) {
                    fetchActions = true;
                    this.select([tableItemId]);
                }
                this.getEventBus().publish(Constants.CustomEvent.SHOW_CONTEXT_MENU, e, fetchActions);
            }
        }
    }

    /**
     * Prepare selections and expansions for refresh
     *
     * @private
     */
    function prepareSelectionsAndExpansions() {
        var allIds = [];

        // Prepare selection nodes for compare with server nodes
        store(this).topologyState.selectionIds.forEach(function(selectionId) {
            var obj = this.memory.get(selectionId);
            var allParentIds = [];
            collectAllParentIds.call(this, obj, allParentIds); // needed for get all expand ids with selection
            allParentIds.reverse();
            allIds = allIds.concat(allParentIds);
            this.selection[selectionId] = obj;
        }.bind(this));

        allIds = store(this).topologyState.expansionIds.concat(allIds);
        store(this).serverCallIds = allIds.filter(function(el, i, arr) {
            return arr.indexOf(el) === i;
        });

        // Prepare expansion nodes for compare with server nodes
        store(this).serverCallIds.forEach(function(id) {
            var obj = this.memory.get(id);
            store(this).allSelectionWithExpansions[id] = obj;
            return obj;
        }.bind(this));

        store(this).allSelectionWithExpansions = Object.assign(store(this).allSelectionWithExpansions, this.selection);
    }



    /**
     * Process left side of the network
     *
     * @param promises
     * @private
     */
    function processLeftSide(promises) {
        //Get Root data
        promises.push(this.getRoots.call(this, this.options.customTopologyId).then(function(obj) {
            if (obj) {
                obj.children = 1;
                return obj;
            }
        }.bind(this)));

        // Get all data for selections and expansions
        store(this).serverCallIds.forEach(function(poid) {

            promises.push(this.getChildrenForSoftRefresh.call(this, poid).then(function(objects) {
                return objects;
            }.bind(this)));
            //TODO handle error
            //     .catch(function(error) {
            //     if (error.code === 1000) {
            //         return [];
            //     }
            //     else {
            //         throw error;
            //     }
            // }.bind(this)));

        }.bind(this));
    }

    /**
     * Collect parents for given node
     *
     * @private
     * @param node
     * @param array
     * @returns {Array}
     */
    function collectAllParentIds(node, array) {
        var parent = node ? this.memory.get(node.parent) : null;
        if (parent) {
            array.push(parent.id);
            collectAllParentIds.call(this, parent, array);
        }
        else {
            return array;
        }
    }

    /**
     * Process promises
     *
     * @param promises
     * @param store
     * @returns {Promise<T>}
     * @private
     */
    function ProcessPromises(promises, store) {
        this.showLoader();

        return Promise.all(promises)
            .then(function(objects) {
                var processedSelections = {};
                var finalSelections = [];

                var objectsFlattened = objects.reduce(function(a, b) {
                    return a.concat(b);
                }, []);
                // Get latest server nodes into memory
                saveToMemory.call(this, objectsFlattened);

                // Update expanded parent's children
                updateChildrenOfExpanded.call(this, objects);

                // if selected item deleted, then need to select parent
                store(this).topologyState.selectionIds.forEach(function(id) {
                    processedSelections[id] = collectNewSelections.call(this, id);
                }.bind(this));

                Object.keys(processedSelections).forEach(function(index) {
                    finalSelections.push(processedSelections[index]);
                }.bind(this));

                refreshVisualisation.call(this, store(this).serverCallIds, finalSelections, processedSelections[store(this).topologyState.selectionIds.slice(-1)[0]]);

                // In the UX meeting on 21/08/2018, it was decided by Joseph Grogan that this refresh dialog is not needed
                // Show error dialog for deleted nodes
                // we show the dialog with a delay
                // because VirtualScrollbar (from dataviz) hides the dialog for some reason
                // setTimeout(function() {
                //     showRefreshInfoDialog.call(this);
                // }.bind(this), 100);

                this.previousMemory = null;
                this.hideLoader();
                isRefreshOn = false;

                var lastId = processedSelections[store(this).topologyState.selectionIds.slice(-1)[0]];

                var lastObj = _.find(objectsFlattened, function(object) {
                    return object.id === lastId;
                }.bind(this));

                if (lastObj && !Utility.isCollection(lastObj)) {
                    this.getEventBus().publish(Constants.CustomEvent.REFRESH_COMPLETE, Utility.getChildPoid(lastId));
                }

                return objectsFlattened;
            }.bind(this))
            .catch(function(error) {
                showRefreshErrorDialog.call(this, error);
            }.bind(this));
    }

    function ProcessHardRefreshPromises(promises, store) {
        this.showLoader();

        return Promise.all(promises)
            .then(function(objects) {
                var isNetworkObjectNotFound = false;
                var objectsFlattened = objects.reduce(function(a, b) {
                    return a.concat(b);
                }, []);
                // Get latest server nodes into memory
                saveToMemory.call(this, objectsFlattened);

                // Update expanded parent's children
                updateChildrenOfExpanded.call(this, objects);

                //Remove any non exist Objects
                store(this).topologyState.selectionIds.forEach(function(selectionId, index, array) {
                    this.memory.get(selectionId);
                    if (!this.memory.get(selectionId)) {
                        array.splice(index, 1);
                        isNetworkObjectNotFound = true;
                    }
                }.bind(this));

                refreshVisualisation.call(this, store(this).topologyState.expansionIds, store(this).topologyState.selectionIds, store(this).topologyState.lastSelectionId);

                if (isNetworkObjectNotFound) {
                    throw new customError.NetworkObjectNotFound();
                }
                this.previousMemory = null;
                this.hideLoader();
                isRefreshOn = false;
                return objectsFlattened;
            }.bind(this))
            .catch(function(error) {
                isRefreshOn = false;
                this.hideLoader();
                showRefreshErrorDialog.call(this, error);
            }.bind(this));
    }


    /**
     * Save objects(memory objects) into memory
     * @private
     * @param objects
     */
    function saveToMemory(objects) {
        objects.forEach(function(object) {
            var objMemory = this.memory.get(object.id);

            if (objMemory) {
                if (store(this).topologyState.expansionIds.indexOf(object.id) !== -1) {
                    objMemory.isExpanded = true;
                }

                if (objMemory.children < object.children) {
                    objMemory.children = object.children;
                }
            }
            else {
                this.memory.addObject(object.id, object, object.parent);
            }
        }.bind(this));
    }

    /**
     *  Update expanded parent's children
     *
     * @param objects
     * @private
     */
    function updateChildrenOfExpanded(objects) {
        objects.map(function(array) {
            var size = array.length;
            if (size > 0) {
                var parentId = array[0].parent;
                if (parentId !== 'null') {
                    var parentObj = this.memory.get(parentId);
                    if (parentObj && parentObj.children < size) {
                        parentObj.children = size;
                    }
                }
            }

        }.bind(this));
    }

    /**
     * Collect new selections whether previous selections get deleted
     * @private
     * @param ServerObjectIds
     * @param id
     * @returns {*}
     */
    function collectNewSelections(id) {
        if (!this.memory.get(id)) {
            if (store(this).allSelectionWithExpansions[id] && store(this).allSelectionWithExpansions[id].parent !== null) {
                return collectNewSelections.call(this, store(this).allSelectionWithExpansions[id].parent);
            } else {
                return null;
            }
        } else {
            return id;
        }
    }

    /**
     * Check whether parent nodes are expanded or not
     * @private
     * @param node
     * @returns {boolean}
     */
    function isParentExpanded(node) {
        if (!node) {
            return true;
        }
        else if (node.parent !== null) {
            return (node.isExpanded === undefined ? true : node.isExpanded) && isParentExpanded.call(this, this.memory.get(node.parent));
        }
        else {
            return node.isExpanded;
        }
    }

    /**
     * Expand nodes for given poids
     *
     * @param poids
     * @private
     */
    function expandNodes(poids) {
        poids.forEach(function(id) {
            var obj = this.memory.get(id);

            // Temporary fix for issue with dataviz tree refresh on firefox
            // Check if root id contains ':' e.g. 'null:1234'
            // If not, then prefix null to the id
            // If global is defined, then unit tests environment is running - skip this code on unit tests
            if (typeof global === 'undefined') {
                var isParentSeparatorPresent = obj && obj.id && obj.id.indexOf(':') !== -1;
                if (obj && obj.id && !isParentSeparatorPresent) {
                    obj.id = null + ':' + obj.id;
                }
            }

            if (obj && Utility.isCollection(obj)) {
                this.visualisation.expand(obj);
            }
        }.bind(this));
    }

    /**
     * Scroll into last selection
     * @param poid
     * @private
     */
    function scrollIntoLast(poid) {
        var lastItem = this.memory.get(poid);
        // avoid scrolling errors
        if (!Utility.isRootPoId(poid, this.options.customTopologyId) && lastItem && isParentExpanded.call(this, lastItem)) {
            this.visualisation.scrollIntoView(lastItem);
        }
    }

    /**
     * Refresh visualisation
     *
     * @param expansions
     * @param selections
     * @param lastSelection
     * @private
     */
    //TODO Duplicate - root is not null
    function refreshVisualisation(expansions, selections, lastSelection) {
        this.changeView('tree', this.memory.getChildren(null).length);

        // Expand
        expandNodes.call(this,expansions);

        // Select
        if (selections.length > 0) {
            this.visualisation.select(selections);
        } else {
            // stop if nothing can be selected
            return false;
        }

        // Goto last selection
        scrollIntoLast.call(this, lastSelection);
    }

    // /**
    //  * Show information of deleted nodes during refresh
    //  *
    //  * @private
    //  */
    // function showRefreshInfoDialog() {
    //     var deletedItems = [];
    //     Object.keys(store(this).allSelectionWithExpansions).forEach(function(key) {
    //         var inMemory = this.memory.get(key);
    //         if (!inMemory) {
    //             deletedItems.push(store(this).allSelectionWithExpansions[key]);
    //         }
    //     }.bind(this));
    //
    //     if (deletedItems.length > 0) {
    //         showRefreshDialog.call(this, deletedItems, function() {
    //
    //         }.bind(this));
    //     }
    // }
    //
    // /**
    //  * Show refresh dialog
    //  *
    //  * @param data
    //  * @param callback
    //  * @private
    //  */
    // function showRefreshDialog(data, callback) {
    //     var modalDialog = new RefreshDialogWidget({
    //         okAction: function() {
    //             modalDialog.hide();
    //             modalDialog.destroy();
    //             callback();
    //         }
    //     });
    //
    //     if (store(this).dialog) {
    //         // TODO remove .hide() when TORF-184466 is delivered
    //         store(this).dialog.hide();
    //         store(this).dialog.destroy();
    //     }
    //
    //     modalDialog.show(data);
    //     store(this).dialog = modalDialog;
    // }

    /**
     * Show refresh dialog
     *
     * @private
     */
    function showRefreshErrorDialog(error) {
        var title = error.title || i18n.refreshError.title;
        var body = error.body || i18n.refreshError.body;
        showDialog.call(this, 'error', title, body, function() {
            // Rollback to previous memory state
            this.memory = utils.clone(this.previousMemory);
            store(this).previousSelection = utils.clone(store(this).topologyState.selectionIds);
            this.hideLoader();
            isRefreshOn = false;
            this.getEventBus().publish('topologyBrowser:change:url', {
                locationParamObject: {
                    topology: undefined
                },
                preventListeners: false,
                preventLoad: false,
                previousTopology: true
            });
        }.bind(this));
    }

    function showDialog(type, header, content, callback) {
        var modalDialog = new Dialog({
            header: header,
            content: content,
            buttons: [
                {
                    caption: i18n.buttons.ok,
                    action: function() {
                        // TODO remove .hide() when TORF-184466 is delivered
                        modalDialog.hide();
                        modalDialog.destroy();

                        callback();
                    }.bind(this)
                }
            ],
            type: type
        });

        if (store(this).dialog) {
            // TODO remove .hide() when TORF-184466 is delivered
            store(this).dialog.hide();
            store(this).dialog.destroy();
        }

        modalDialog.show();
        store(this).dialog = modalDialog;
    }

    TopologyTreeBase.extend = core.extend;

    return TopologyTreeBase;
});
