define([
    'jscore/core',
    './TopologyTreeView',
    'i18n!networkobjectlib/dictionary.json',
    'jscore/ext/net',
    'jscore/ext/privateStore',
    'jscore/ext/utils',
    'jscore/ext/utils/base/underscore',
    'dataviz/Tree',
    'dataviz/MillerColumns',
    'widgets/Dialog',
    '../../widgets/NodeItem/NodeItem',
    'widgets/Loader',
    './TreeMemory',
    './Rest',
    'networkobjectlib/utils/ErrorHandler',
    'networkobjectlib/utils/customError',
    'widgets/InlineMessage',
    'container/api',
    'networkobjectlib/utils/net',
    'networkobjectlib/widgets/FormWidgets/RefreshDialogWidget/RefreshDialogWidget',
    '../../utils/Constants',
    'networkobjectlib/utils/TopologyUtility'
],
function(core, View, i18n, net, PrivateStore, utils, _, Tree, MillerColumns, Dialog, NodeItem, Loader, TreeMemory, Rest,
    ErrorHandler, customError, InlineMessage, container, NetUtil, RefreshDialogWidget, Constants, TopologyUtility) {

    /**
     * TopologyTree is a region that will display network topology in a tree widget
     *
     * ### Options
     * [===
     *    {AppContext} context - application context, required for sharing events.
     *    {Boolean} multiselect - ability to select more than one item (default false).
     * ===]
     *
     * ### Events Published
     * [===
     *     topologyTree:fetch:root:error () - triggered when couldn't fetch root elements
     *     topologyTree:fetch:subtree:error:closed () - triggered when user exits fetch of subtree error dialog
     *     topologyTree:fetch:children:error:closed () - triggered when user exits fetch of children error dialog
     *     topologyTree:node:select ({Array<Object>} networkObjects) - triggered when an object is selected.This event is DEPRECATED and is replaced by event below
     *     topologyTree:object:select ({Array<Object>} networkObjects) - triggered when an object is selected. An object can be a collection, a nested collections, or a managed object. Structure: {"networkObjects": [{}],"nestedCollections": [{}], "lastSelectedObject": {}}
     * ===]
     *
     * @class networkobjectlib/TopologyTree
     * @extends Region
     */

    var Visualisations = {
        'tree': Tree,
        'miller-columns': MillerColumns
    };

    var viewportIds = [];

    var SERVER_FORCE_UPDATE_CHILDREN = '0';
    var UI_FORCE_UPDATE_CHILDREN = 1;

    var store = PrivateStore.create();

    return core.Region.extend({

        View: View,

        init: function() {
            this.memory = new TreeMemory();
            this.previousMemory = null;
            this.selection = {};
            this.errorDashboard = null;
            this.subscribeEvents = {};
            this.containerSubscribeEvents = {};
            this.eventHandlers = {};

            store(this).options = {
                multiselect: false,
                restrictions: {
                    nodeLevel: false,
                    neType: {
                        neTypes: [],
                        filter: ''
                    },
                    moType: {
                        moTypes: [],
                        filter: ''
                    }
                }
            };

            utils.extend(store(this).options, _.clone(this.options, true), true);

            store(this).options.restrictions.neType.neTypes = store(this).options.restrictions.neType.neTypes.map(toLowerCase);
            store(this).options.restrictions.moType.moTypes = store(this).options.restrictions.moType.moTypes.map(toLowerCase);

            store(this).previousSelection = [];
            store(this).expansions = [];
            store(this).selectionIds = [];
            store(this).serverCallIds = [];
            store(this).allSelectionWithExpansions = {};
            store(this).dialog = null;
        },

        onStart: function() {
            this.changeView(Constants.TREE, 0);
            this.showLoader();
            subscribeEvents.call(this);
            // syncStatusRefresh.call(this);
            // this.load(null);
        },

        onStop: function() {
            unSubscribeEvents.call(this);
        },

        /**
         * Load object on tree. Identify if there is a need to fetch root objects, fetch subtree objects or load from memory
         *
         * @method load
         * @param {String} poid
         * @returns {Promise}
         */
        load: function(poid) {
            if (this.errorDashboard !== null) {
                this.hideErrorDashboard();
            }

            // if object is in memory just go to it, otherwise fetch from server
            if (this.memory.has(poid)) {
                return new Promise(function(resolve) {
                    this.goTo(this.memory.get(poid));
                    resolve([]);
                }.bind(this));
            }
            else {
                var promises = [];
                var redrawTree = false;
                var subTreeRoot = null;
                var isNotPlatformType = false;

                // if is root poid send event with selections cleared
                if (TopologyUtility.isRootPoId(poid)) {
                    this.getEventBus().publish(Constants.CustomEvent.NODE_OBJECT_SELECT, {networkObjects: [], nestedCollections: []});
                }

                // if there is no root data, or poid is root, or root is a NetworkElement
                if (!this.memory.hasChildren(null) || TopologyUtility.isRootPoId(poid) || this.memory.getChildren(null)[0].type === Constants.NETWORK_ELEMENT) {
                    promises.push(getRootData.call(this, poid).then(function(objects) {
                        redrawTree = true;

                        return objects;
                    }.bind(this)));
                }

                // if poid is not root
                if (!TopologyUtility.isRootPoId(poid)) {
                    promises.push(getPoidSubtree.call(this, poid).then(function(objects) {
                        if (objects[0].type === Constants.NETWORK_ELEMENT || objects[0].type === Constants.MANAGEMENT_SYSTEM || objects[0].type === Constants.VIRTUAL_NETWORK_FUNCTION_MANAGER || objects[0].type === Constants.NODE || objects[0].type === Constants.VIRTUAL_INFRASTRUCTURE_MANAGER) {
                            isNotPlatformType = true;

                            // if NetworkElement or ManagementSystem is not in memory we need to reload tree to update number of root
                            if (!this.memory.has(objects[0].id)) {
                                redrawTree = true;
                            }
                        }
                        else {
                            /*
                             * we only remove root from list when we want to update num of children (performance hack fix)
                             * we don't do that if it is not a platformType because they are not loaded on -1/-2
                             */
                            subTreeRoot = objects.shift();
                        }

                        return objects;
                    }.bind(this)));
                }

                this.showLoader();

                // when all requests are complete successfully
                return Promise.all(promises)
                    .then(function(objects) {
                        if (redrawTree) {
                            // reset some stuff
                            this.memory.clearAll();
                            store(this).previousSelection = [];
                        }

                        if (isNotPlatformType && objects.length === 2) {
                            // remove -1/-2 data when request is not for a platformType
                            objects.shift();
                        }

                        var objectsFlattened = objects.reduce(function(a, b) {
                            return a.concat(b);
                        }, []);

                        objectsFlattened.forEach(function(object) {
                            var objMemory = this.memory.get(object.id);

                            // if already in memory
                            if (objMemory) {
                                // we can only change number of children of a node if its collapsed
                                if (!objMemory.isExpanded) {
                                    objMemory.children = object.children;
                                }
                            }
                            else {
                                this.memory.addObject(object.id, object, object.parent);
                            }
                        }.bind(this));

                        if (subTreeRoot) {
                            // performance fix hack: update children for object in memory (root)
                            if (this.memory.get(subTreeRoot.id)) {
                                this.memory.get(subTreeRoot.id).children = subTreeRoot.children;
                            }
                        }

                        if (redrawTree) {
                            this.changeView(Constants.TREE, this.memory.getChildren(null).length);
                        }

                        var item = this.memory.get(poid);

                        // if not root and poid exists is memory
                        if (!TopologyUtility.isRootPoId(poid) && item) {
                            this.goTo(item);
                        }

                        this.hideLoader();

                        // load memory into the supervision panel
                        this.getEventBus().publish('supervision:initTreeData', this.memory.all());

                        return objectsFlattened;
                    }.bind(this))
                    .catch(function(error) {
                        this.hideLoader();
                        throw error;
                    }.bind(this));
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
         * Gets the total number of children for a tree item before its expansion
         *
         * @param id
         * @param success
         * @param error
         */
        getChildrenCount: function(id, success, error) {
            var newParentChildren;
            if (!this.memory.hasChildren(id)) {
                getPoidChildren.call(this, id).then(function(objects) {
                    objects.forEach(function(object) {
                        this.memory.addObject(object.id, object, object.parent);
                    }.bind(this));

                    var parent = this.memory.get(id);
                    if (parseInt(objects.length) === 0) {
                        newParentChildren = 1;
                        var noChildren = createNoChildrenObject(parent.id);
                        this.memory.addObject(noChildren.id, noChildren, noChildren.parent);
                    }
                    else if (parent.children !== parseInt(objects.length)) {
                        newParentChildren = parseInt(objects.length);
                        parent.children = newParentChildren;
                    }
                    if (newParentChildren) {
                        this.visualisation.collapse(parent);
                        parent.children = newParentChildren;
                        this.visualisation.expand(parent);
                    } else {
                        success(objects.length);
                    }
                }.bind(this))
                    .catch(function(e) {
                        error(e);
                    });
            } else {
                success(this.memory.get(id).children);
            }
        },

        /**
         * Dataviz will call this method when it needs data.
         *
         * @private
         * @method getData
         * @param query
         * @param success
         * @param error
         * @param idsOnly
         */
        getData: function(query, success, error, idsOnly) {
            var output = [];

            // first init (don't have data yet)
            if (query.length === 1 && query[0].offset === 0 && query[0].limit === 0 && query[0].parent === null) {
                error();
                return;
            }
            this.viewportIds = [];
            query.forEach(function(q) {
                // Children is retrieved via getChildrenCount() and added to memory
                // If children is in memory...
                if (this.memory.hasChildren(q.parent)) {
                    var objects = this.memory.getChildren(q.parent) || [];
                    output.push({
                        parent: q.parent,
                        items: objects
                            .map(mapObjects.bind(this))
                            .splice(q.offset, q.limit)
                    });
                    // return a list of all node level items on the view port
                    this.viewportIds = returnViewportNodes();
                } else {
                    var noChildren = createNoChildrenObject(q.parent);
                    this.memory.addObject(noChildren.id, noChildren, noChildren.parent);
                }
            }.bind(this));
            success(output);

            function mapObjects(obj) {
                return idsOnly ? obj.id : convertToTreeItem.call(this, obj);
            }
        },

        /**
         * Removes item and all its descendants from memory, destroy tree and recreates tree with previous expansions
         * and selections.
         *
         * @private
         * @method remove
         * @param itemId
         */
        remove: function(itemId) {
            var descendantsIds = this.memory.getChildren(itemId, true).map(function(obj) { return obj.id; });
            var removedIds = [itemId].concat(descendantsIds);

            // get tree state without items being removed
            var expandedIds = this.visualisation.getExpansions()
                .map(function(obj) { return obj.id; })
                .filter(function(id) { return removedIds.indexOf(id) === -1; });
            var selectedIds = this.visualisation.getSelectedIds()
                .filter(function(id) { return removedIds.indexOf(id) === -1; });
            var scrollPosition = this.visualisation.getVirtualScrollBar().getPosition();

            // get item
            var item = this.memory.get(itemId);

            // remove children recursively and them remove element
            this.memory.clearChildren(itemId, true);
            this.memory.remove(itemId, item.parent);

            // get siblings after element and re-calculate offsets
            this.memory.getChildren(item.parent)
                .filter(function(i) { return i.offset > item.offset; })
                .forEach(function(i) { return i.offset -= 1; });

            // since item was removed we need to update number of children of its parent
            if (item.parent !== null) {
                // if new number of children is > 0 reduce number of children otherwise create no children found
                if ((this.memory.get(item.parent).children - 1) > 0) {
                    this.memory.get(item.parent).children -= 1;
                } else {
                    var noChildren = createNoChildrenObject(item.parent);
                    this.memory.addObject(noChildren.id, noChildren, noChildren.parent);
                }
            }

            // keep reference of old visualisation to destroy it after the new tree gets fully loaded
            var oldVisualisation = this.visualisation;

            // create new tree
            this.visualisation = createVisualisation.call(this, Constants.TREE, this.memory.getChildren(null).length);
            this.visualisation.attachTo(this.view.getTree());
            this.subscribeVisualisationEvents();

            // re-expand
            expandedIds.forEach(function(id) { return this.visualisation.expand(this.memory.get(id)); }.bind(this));

            // re-select
            this.visualisation.select(selectedIds);
            this.visualisation.getVirtualScrollBar().setPosition(scrollPosition);

            // destroy previous visualisation after event loop to have enough time for new tree to be fully loaded
            // we are using this trick to avoid scroll flickering when loading new visualisation
            setTimeout(function() {
                oldVisualisation.destroy();
            }.bind(this));
        },

        /**
         * Unselect all nodes and select the chosen one.
         *
         * @private
         * @method select
         * @param objectsId
         */
        select: function(objectsId) {
            this.visualisation.unselectAll();
            this.visualisation.select(objectsId);
        },

        /**
         * Recursive function to expands the tree. should be called like expand(node), without passing the second parameter.
         *
         * @private
         * @method expandParent
         * @param node
         * @param expand
         */
        expandParent: function(node, expand) {
            if (node.parent !== null) {
                this.expandParent(this.memory.get(node.parent), true);
            }
            if (expand) {
                this.visualisation.expand(node);
            }
        },

        /**
         * Expands, select and scroll to node.
         * order of the actions are important to ensure that SHIFT-click works properly
         *
         * @private
         * @method goTo
         * @param object
         */
        goTo: function(object) {
            this.expandParent(object);
            this.select([object.id]);
            this.visualisation.scrollIntoView(object);
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

        hideErrorDashboard: function() {
            this.view.getTree().removeStyle('display');
            this.errorDashboard.destroy();
        },

        showLoader: function() {
            if (this.loader) {
                this.loader.destroy();
                this.loader = null;
            }
            this.loader = new Loader();
            this.loader.attachTo(this.view.getTree());
        },

        hideLoader: function() {
            if (this.loader) {
                this.loader.destroy();
            }
        },

        redraw: function() {
            this.visualisation.redraw();
        },

        subscribeVisualisationEvents: function() {
            var scrollIndex = null;
            var selectEventId = this.visualisation.addEventHandler('selectend', onNodeSelect.bind(this));
            var expandEventId = this.visualisation.addEventHandler('expand', onExpand.bind(this));
            var scrollEventId = this.visualisation.getVirtualScrollBar().addEventHandler('change', function(index) {
                if (scrollIndex !== index) {
                    container.getEventBus().publish(Constants.Event.CONTEXT_MENU_HIDE);
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
         * Refresh the topology tree
         * @method refresh
         * @returns {Promise}
         */
        refresh: function refresh() {
            var promises = [];
            store(this).allSelectionWithExpansions = {};
            this.selection = {};
            store(this).selectionIds = utils.clone(this.visualisation.getSelectedIds());
            store(this).expansions = utils.clone(this.visualisation.getExpansions());
            store(this).expansionIds = store(this).expansions.map(function(expansion) { return expansion.id; });
            this.previousMemory = utils.clone(this.memory);

            // Prepare selections and expansions
            prepareSelectionsAndExpansions.call(this);

            var networkElements = Object.keys(store(this).allSelectionWithExpansions).filter(function(key) {
                var obj = store(this).allSelectionWithExpansions[key];
                if (isRightSide(obj)) {
                    return obj;
                }
            }.bind(this));

            var childrenToProcess = store(this).expansions
                .filter(function(expansion) {
                    return expansion.parent;
                }).map(function(expansion) {
                    return expansion.id;
                });

            if (networkElements.length > 0) {
                // Right side of the network
                processRightSide.call(this, promises, networkElements[0]);
            }
            else {
                // Left side of the network
                processLeftSide.call(this, promises);
            }

            if (childrenToProcess.length > 0) {
                // Left side of the network based on given children
                processLeftSide.call(this, promises, childrenToProcess);
            }

            // reset some stuff
            this.memory.clearAll();
            store(this).previousSelection = [];

            return ProcessPromises.call(this, promises, store);
        }
    });


    /**
     * Prepare selections and expansions for refresh
     *
     * @private
     */
    function prepareSelectionsAndExpansions() {
        var allIds = [];

        // Prepare selection nodes for compare with server nodes
        store(this).selectionIds.forEach(function(selectionId) {
            var obj = this.memory.get(selectionId);
            var allParentIds = [];
            collectAllParentIds.call(this, obj, allParentIds); // needed for get all expand ids with selection
            allParentIds.reverse();
            allIds = allIds.concat(allParentIds);
            this.selection[selectionId] = obj;
        }.bind(this));

        allIds = store(this).expansionIds.concat(allIds);
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
     * Check the type for right hand side.
     * Return true if it is on the right hand side of the network
     *
     * @private
     * @param node
     * @returns {boolean}
     */
    function isRightSide(node) {
        return (!!node && (node.type === Constants.NETWORK_ELEMENT || node.type === Constants.MANAGEMENT_SYSTEM || node.type === Constants.VIRTUAL_NETWORK_FUNCTION_MANAGER));
    }

    /**
     * Process left side of the network
     *
     * @param promises
     * @param children
     * @private
     */
    function processLeftSide(promises, children) {
        var poidsToProcess;
        if (children) {
            poidsToProcess = children;
        } else {
            poidsToProcess = store(this).serverCallIds;
            // Get all root data
            promises.push(getRootData.call(this).then(function(objects) {
                return objects;
            }.bind(this)));
        }

        // Get all data for selections and expansions
        poidsToProcess.forEach(function(poid) {
            if (poid !== '-2') {
                promises.push(getChildren.call(this, poid).then(function(objects) {
                    return objects;
                }.bind(this)).catch(function(error) {
                    if (error.code === 1000) {
                        return [];
                    }
                    else {
                        throw error;
                    }
                }.bind(this)));
            }
        }.bind(this));
    }

    /**
     * Process right side of the network
     *
     * @param promises
     * @param poid
     * @private
     */
    function processRightSide(promises, poid) {
        // Get data for given poid
        if (poid !== '-2') {
            promises.push(getPoidChildrenWithParent.call(this, poid).then(function(objects) {
                return objects;
            }.bind(this)).catch(function(error) {
                if (error.code === 1000) {
                    return [];
                }
                else {
                    throw error;
                }
            }.bind(this)));
        }
    }

    /**
     * Fetches children with their parent for given poid
     *
     * @method getPoidChildrenWithParent
     * @private
     * @param poid
     * @returns Promise(objects)
     */
    function getPoidChildrenWithParent(poid) {
        return Rest.getPoid(poid)
            .then(function(response) {
                var objects = [];
                objects.push(convertToMemoryItem(response.data.treeNodes[0], null));
                objects = objects.concat(parseAndSort.call(this, response.data.treeNodes[0].childrens, poid, response.data.treeNodes[0].moType));
                return objects;
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
                store(this).selectionIds.forEach(function(id) {
                    processedSelections[id] = collectNewSelections.call(this, id);
                }.bind(this));

                Object.keys(processedSelections).forEach(function(index) {
                    finalSelections.push(processedSelections[index]);
                }.bind(this));

                refreshVisualisation.call(this, store(this).serverCallIds, finalSelections, processedSelections[store(this).selectionIds.slice(-1)[0]]);

                showRefreshInfoDialog.call(this);
                this.previousMemory = null;
                syncStatusRefresh.call(this).then(function(items) {
                    this.hideLoader();
                    this.getEventBus().publish(
                        Constants.CustomEvent.REFRESH_COMPLETE,
                        TopologyUtility.getChildPoid(processedSelections[store(this).selectionIds.slice(-1)[0]])
                    );
                }.bind(this));

                return objectsFlattened;
            }.bind(this))
            .catch(function(error) {
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
                if (store(this).expansionIds.indexOf(object.id) !== -1) {
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
            if (obj) {
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
        if (!TopologyUtility.isRootPoId(poid) && lastItem && isParentExpanded.call(this, lastItem)) {
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
    function refreshVisualisation(expansions, selections, lastSelection) {
        this.changeView(Constants.TREE, this.memory.getChildren(null).length);

        // Expand
        expandNodes.call(this,expansions);

        // Select
        this.visualisation.select(selections);

        // Goto last selection
        scrollIntoLast.call(this, lastSelection);
    }

    /**
     * Show information of deleted nodes during refresh
     *
     * @private
     */
    function showRefreshInfoDialog() {
        var deletedItems = [];
        Object.keys(store(this).allSelectionWithExpansions).forEach(function(key) {
            var inMemory = this.memory.get(key);
            if (!inMemory) {
                deletedItems.push(store(this).allSelectionWithExpansions[key]);
            }
        }.bind(this));

        if (deletedItems.length > 0) {
            showRefreshDialog.call(this, deletedItems, function() {

            }.bind(this));
        }
    }

    /**
     * Show refresh dialog
     *
     * @param data
     * @param callback
     * @private
     */
    function showRefreshDialog(data, callback) {
        var modalDialog = new RefreshDialogWidget({
            okAction: function() {
                modalDialog.hide();
                modalDialog.destroy();
                callback();
            }
        });

        if (store(this).dialog) {
            // TODO remove .hide() when TORF-184466 is delivered
            store(this).dialog.hide();
            store(this).dialog.destroy();
        }

        modalDialog.show(data);
        store(this).dialog = modalDialog;
    }

    /**
     * Show refresh dialog
     *
     * @private
     */
    function showRefreshErrorDialog() {
        showDialog.call(this, 'error', i18n.refreshError.title, i18n.refreshError.body, function() {
            // Rollback to previous memory state
            this.memory = utils.clone(this.previousMemory);
            store(this).previousSelection = utils.clone(store(this).selectionIds);
            this.hideLoader();
        }.bind(this));
    }

    /**
     * Get children for given poid
     *
     * @param poid
     * @returns {PromiseLike<T> | Promise<T> | *}
     * @private
     */
    function getChildren(poid) {
        return Rest.getPoid(poid)
            .then(function(response) {
                return parseAndSort.call(this, response.data.treeNodes[0].childrens, poid, response.data.treeNodes[0].moType);
            }.bind(this));
    }

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
            getData: this.getData.bind(this),
            getChildrenCount: this.getChildrenCount.bind(this),
            getIds: function(query, success, error) {
                this.getData(query, success, error, true);
            },
            totalRootItems: rootItems,
            checkboxes: false,
            selectable: true,
            multiselect: store(this).options.multiselect,
            bindselect: false,
            itemType: NodeItem
        });

        return visualisation;
    }

    /**
     * Fetches [poid, -1 and -2] and save to memory
     *
     * @method getRootData
     * @private
     * @returns {Promise.<Array>}
     * @throws dashboard and publish event
     */
    function getRootData() {
        var promises = [];

        // get data for -1
        promises.push(Rest.getRoot(-1).then(function(response) {
            return parseAndSort.call(this, response.data.treeNodes, null, null, true);
        }.bind(this)));

        // get data for -2
        promises.push(Rest.getRoot(-2).then(function(response) {
            var items = parseAndSort.call(this, response.data.treeNodes, Constants.ALL_OTHER_NODES_POID, null, true);
            if (items.length === 0) {
                return [createNoChildrenObject(Constants.ALL_OTHER_NODES_POID)];
            }
            return items;
        }.bind(this)));

        // when all requests are successful
        return Promise.all(promises).then(function(objects) {
            var childCount =objects[1].length === 1 ? objects[1][0].children : objects[1].length;
            var all = convertToMemoryItem({
                poId: Constants.ALL_OTHER_NODES_POID,
                moName: i18n.tree.nodes.allOtherNodes,
                moType: null,
                noOfChildrens: objects[1].length,
                totalNodeCount: childCount
            }, null);
            all.offset = objects[0].length;

            // concat all objects into one array
            var objectsFlattened = objects.reduce(function(a, b) {
                return a.concat(b);
            }, []);

            objectsFlattened.push(all);

            return objectsFlattened;
        }.bind(this)).catch(function(error) {
            this.showErrorDashboard(error);
            this.getEventBus().publish(Constants.CustomEvent.FETCH_ROOT_ERROR);

            throw error;
        }.bind(this));
    }

    /**
     * fetches subtree for the specified poid
     *
     * @method getPoidSubtree
     * @private
     * @returns Promise(objects)
     * @throws dialog and publish event on close (FETCH_SUBTREE_ERROR_CLOSED)
     */
    function getPoidSubtree(poid) {
        return Rest.getPoidSubtree(poid)
            .then(function(response) {
                // root
                var objects = [convertToMemoryItem(response.data.treeNodes[0], null)];

                // sort each children grouped by parent
                for (var i=0, length=response.data.treeNodes.length; i < length-1; i++) {
                    objects = objects.concat(parseAndSort.call(this, response.data.treeNodes[i].childrens, response.data.treeNodes[i].poId, response.data.treeNodes[i].moType, false));
                    response.data.treeNodes[i].noOfChildrens = objects.length;
                }

                return objects;
            }.bind(this))
            .catch(function(error) {
                showDialog.call(this, 'error', error.title, error.body, function() {
                    this.getEventBus().publish(Constants.CustomEvent.FETCH_SUBTREE_ERROR_CLOSED);
                }.bind(this));

                throw error;
            }.bind(this));
    }

    /**
     * fetches children for the specified poid
     *
     * @method getPoidChildren
     * @private
     * @return Promise(objects)
     * @throws dialog and publish event on close (FETCH_CHILDREN_ERROR_CLOSED)
     */
    function getPoidChildren(poid) {
        return Rest.getPoid(poid)
            .then(function(response) {
                return parseAndSort.call(this, response.data.treeNodes[0].childrens, poid, response.data.treeNodes[0].moType);
            }.bind(this))
            .catch(function(error) {
                showDialog.call(this, 'error', error.title, error.body, function() {
                    this.getEventBus().publish(Constants.CustomEvent.FETCH_CHILDREN_ERROR_CLOSED);
                }.bind(this));

                throw error;
            }.bind(this));
    }

    /**
     * converts response object to memory object
     * @method convertToMemoryItem
     * @private
     * @param object
     * @param parentId
     * @returns {Object}
     */
    function convertToMemoryItem(object, parentId) {
        var poid = String(object.poId);
        return {
            id: poid,
            label: object.moName.trim(),
            fdn : object.fdn,
            parent: parentId ? String(parentId) : null,
            children: parseInt(object.noOfChildrens),
            offset: 0,
            type: object.moType,
            neType: object.neType,
            syncStatus: object.syncStatus,
            totalNodeCount: object.totalNodeCount,
            managementState: object.managementState,
            radioAccessTechnology: object.radioAccessTechnology
        };
    }

    /**
     * converts memory object to object to be sent to dataviz
     * @method convertToTreeItem
     * @private
     * @param object
     * @returns {Object}
     */
    function convertToTreeItem(object) {
        if (object.neType !== undefined && (object.neType === 'Unmanaged' || object.neType === 'VirtualSubnetwork')) {
            object.syncStatus = i18n.get('notsupported');
        }
        var parent = this.memory.get(object.parent);
        var isNode = !!parent && TopologyUtility.isNodeLevel(object.type, parent.id, parent.type);
        var icon = TopologyUtility.getIcon(object.id, object.type, object.subType, object.neType, object.query, isNode);
        var syncStatus = TopologyUtility.getSyncStatus(object.syncStatus);
        var managementState = TopologyUtility.getManagementState(object.managementState);

        return {
            id: object.id,
            label: object.label,
            parent: object.parent,
            fdn: object.fdn,
            children: (store(this).options.restrictions.nodeLevel && isNode) ? 0 : object.children,
            type: store(this).options.restrictions.nodeLevel ? null : object.type,
            neType: object.neType,
            icon: icon.icon,
            iconTitle: icon.title,
            syncStatusIcon: syncStatus.icon,
            totalNodeCount: object.totalNodeCount,
            syncStatusTitle: syncStatus.title,
            managementStateIcon: managementState.icon,
            managementStateTitle: managementState.title,
            radioAccessTechnology: object.radioAccessTechnology,
            showNodeCount: this.options.showNodeCount
        };
    }

    /**
     * parse array of nodes
     *
     * @method parseAndSort
     * @private
     * @param nodes
     * @param parentId
     * @param parentType
     * @param updateChildren
     * @returns objects
     */
    function parseAndSort(nodes, parentId, parentType, updateChildren) {
        var objects = nodes
            .filter(filterNeType.bind(this, parentId, parentType))
            .filter(filterMoType.bind(this))
            .map(function(object) {
                // this is required for servers performance hack
                if (updateChildren) {
                    object.noOfChildrens = object.noOfChildrens === SERVER_FORCE_UPDATE_CHILDREN ? UI_FORCE_UPDATE_CHILDREN : object.noOfChildrens;
                }
                return convertToMemoryItem(object, parentId);
            });

        objects = TopologyUtility.getSorted(objects).map(function(e, i) {
            e.offset = i;
            return e;
        });
        return objects;
    }

    function filterNeType(parentId, parentType, object) {
        var neType = store(this).options.restrictions.neType;

        if (TopologyUtility.isNodeLevel(object.moType, parentId, parentType) && neType.neTypes.length > 0) {
            if (neType.filter === 'blacklist') {
                return neType.neTypes.indexOf(toLowerCase(object.neType)) === -1;
            }
            else if (neType.filter === 'whitelist') {
                return neType.neTypes.indexOf(toLowerCase(object.neType)) > -1;
            }
        }
        return true;
    }

    function filterMoType(object) {
        var moType = store(this).options.restrictions.moType;

        if (moType.moTypes.length > 0) {
            if (moType.filter === 'blacklist') {
                return moType.moTypes.indexOf(toLowerCase(object.moType)) === -1;
            }
            else if (moType.filter === 'whitelist') {
                return moType.moTypes.indexOf(toLowerCase(object.moType)) > -1;
            }
        }
        return true;
    }

    function toLowerCase(element) {
        return typeof(element) === 'string' ? element.toLowerCase() : element;
    }

    function subscribeEvents() {
        this.eventHandlers[Constants.RESIZE] = core.Window.addEventHandler(Constants.RESIZE, resize.bind(this));
        this.eventHandlers[Constants.MOUSE_DOWN] = core.Window.addEventHandler(Constants.MOUSE_DOWN, function(e) {
            // if left click && clicked outside contextmenu
            if (e.originalEvent.which === 1 && !e.originalEvent.target.closest('.elWidgets-ComponentList')) {
                container.getEventBus().publish(Constants.Event.CONTEXT_MENU_HIDE);
            }
        });
        this.eventHandlers[Constants.HASH_CHANGE] = core.Window.addEventHandler(Constants.HASH_CHANGE, function() {
            container.getEventBus().publish(Constants.Event.CONTEXT_MENU_HIDE);
        });
        this.rightClickHandlerId = this.getElement().addEventHandler('contextmenu', onRightClick.bind(this));
        this.subscribeEvents[Constants.CustomEvent.LOAD] = this.getEventBus().subscribe(Constants.CustomEvent.LOAD, this.load, this);
        this.subscribeEvents[Constants.CustomEvent.START] = this.getEventBus().subscribe(Constants.CustomEvent.START, this.load, this);
        this.subscribeEvents[Constants.CustomEvent.LOADER_SHOW] = this.getEventBus().subscribe(Constants.CustomEvent.LOADER_SHOW, this.showLoader, this);
        this.subscribeEvents[Constants.CustomEvent.LOADER_HIDE] = this.getEventBus().subscribe(Constants.CustomEvent.LOADER_HIDE, this.hideLoader, this);
        this.subscribeEvents[Constants.CustomEvent.SELECT] = this.getEventBus().subscribe(Constants.CustomEvent.SELECT, this.select, this);
        this.subscribeEvents[Constants.CustomEvent.REFRESH] = this.getEventBus().subscribe(Constants.CustomEvent.REFRESH, this.refresh, this);
        this.containerSubscribeEvents[Constants.CustomEvent.SYNC] = container.getEventBus().subscribe(Constants.CustomEvent.SYNC, syncStatusRefreshManual, this);
        // Scoping panel defining it's own context and eventBus. Clients of scoping panel couldn't trigger refresh event as normal.
        // Add refresh event as a container event and therefore other users can trigger it via container.
        this.containerSubscribeEvents[Constants.CustomEvent.REFRESH] = container.getEventBus().subscribe(Constants.CustomEvent.REFRESH, this.refresh, this);
    }

    function unSubscribeEvents() {
        Object.keys(this.subscribeEvents).forEach(function(key) {
            if (this.subscribeEvents[key]) {
                this.getEventBus().unsubscribe(key, this.subscribeEvents[key]);
            }
        }.bind(this));

        Object.keys(this.eventHandlers).forEach(function(key) {
            if (this.eventHandlers[key]) {
                core.Window.removeEventHandler(this.eventHandlers[key]);
            }
        }.bind(this));
        this.getElement().removeEventHandler(this.rightClickHandlerId);

        Object.keys(this.containerSubscribeEvents).forEach(function(key) {
            if (this.containerSubscribeEvents[key]) {
                container.getEventBus().unsubscribe(key, this.containerSubscribeEvents[key]);
            }
        }.bind(this));

    }

    function onRightClick(e) {
        var tableItem = this.view.getItemFromEvent(e);
        if (tableItem) {
            var tableItemId = tableItem.getAttribute('data-id');
            e.originalEvent.preventDefault();
            if (tableItemId !== Constants.ALL_OTHER_NODES_POID && !TopologyUtility.isNoChildrenObject(tableItemId)) {
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

    /**
     * Callback executed when a node is selected
     *
     * @method onNodeSelect
     * @private
     * @method onNodeSelect
     * @param {Array} ids
     */
    function onNodeSelect(ids) {
        viewportIds = [];
        var lastSelectedId = this.visualisation.getLastSelectedId();
        var lastSelectedObj = this.memory.get(lastSelectedId);

        // reorder array to add last selected id to the end of it
        if (ids.length > 1 && lastSelectedId && _.contains(ids, lastSelectedId)) {
            ids = _.without(ids, lastSelectedId);
            ids.push(lastSelectedId);
        }

        // remove unselectable from list
        var selectedIds = ids.filter(function(id) {
            return (id !== Constants.ALL_OTHER_NODES_POID && !TopologyUtility.isNoChildrenObject(id));
        });

        // if unselectable was selected
        if (ids.length > selectedIds.length) {
            this.unsubscribeVisualisationEvents();

            // and it was the only thing selected, select previous
            if (selectedIds.length === 0) {
                selectedIds = store(this).previousSelection;
            }

            // re-select
            this.select(selectedIds);

            // inside timeout otherwise selection above is being triggered
            setTimeout(function() {
                this.subscribeVisualisationEvents();
            }.bind(this), 100);
        }

        // stop if nothing new was selected
        if (_.isEqual(store(this).previousSelection, selectedIds)) {
            return false;
        }

        store(this).previousSelection = selectedIds;

        var objects = selectedIds.map(function(id) {
            return this.memory.get(id);
        }.bind(this));

        // check if what was selected is still in database
        if (selectedIds.length > 0) {
            var idsToCheck = objects.map(function(object) { return object.id; })
                .slice(-1); // for now we just check if the last selection

            Rest.getPoids(idsToCheck)
                .then(function(response) {
                    var aliveIds = response.data.treeNodes.map(function(object) { return object.id; });
                    var removedIds = idsToCheck.filter(function(id) { return aliveIds.indexOf(id) === -1; });
                    // update sync status and redraw tree with the new icon
                    response.data.treeNodes.forEach(function(item) {
                        var obj = this.memory.get(item.id);
                        obj.syncStatus = item.syncStatus;
                    }.bind(this));

                    this.redraw();

                    // TODO this.remove must be able to remove more than one id at once
                    removedIds.forEach(function(id) {
                        var error = new customError.NetworkObjectNotFound();
                        showDialog.call(this, 'error', error.title, error.message, function() {
                            this.remove(id);
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
        }
        this.previousLastSelected = lastSelectedObj;
        this.getEventBus().publish(Constants.CustomEvent.NODE_SELECT, objects);
        this.getEventBus().publish(Constants.CustomEvent.NODE_OBJECT_SELECT, {lastSelectedObject: objects[objects.length - 1], networkObjects: objects, nestedCollections: []});
    }

    /**
     * called whenever a node was expanded on dataviz
     *
     * @method onExpand
     * @private
     * @param object
     */
    function onExpand(object) {
        viewportIds = [];
        var obj = this.memory.get(object.id);
        if (obj) {
            obj.isExpanded = true;
        }
    }

    function createNoChildrenObject(parentId) {
        // poid = -9{id}. Ex: poid = 123 -> -9123 poid = 444 -> -9444
        var poid = Constants.NO_CHILDREN_POID_PREFIX + parentId;
        return convertToMemoryItem({
            poId: poid,
            moName: i18n.tree.nodes.noChildren,
            moType: null,
            noOfChildrens: 0,
            parentId: parentId
        }, parentId);
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

    /**
     *  return a variable of node ids that are rendered on the topology tree
     * @returns {Array}
     */
    function returnViewportNodes() {

        //Instantiate variables
        var allNodes, dataId, viewportNodes = [];

        //Collect all possible syncing nodes
        allNodes = [].slice.call(document.querySelectorAll('.elNetworkObjectLib-NodeItem-syncStatus'));

        //Function to check whether element is within bounding box
        var isInViewport = function(elem) {
            var bounding = elem.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

        //Filter by visibility on main page
        allNodes.forEach(function(node) {
            if (isInViewport(node)) {
                viewportNodes.push(node);
            }
        });

        //Collect an ID list of all nodes visible on the viewport
        viewportIds = [];
        viewportNodes.forEach(function(node) {
            dataId = node.parentNode.parentNode.getAttribute('data-id');
            if (dataId.length > 1 && !isNaN(dataId) && dataId !== null) {
                viewportIds.push(dataId);
            }
        });

        return viewportIds;
    }

    // /**
    //  * begins the 15 second periodic refresh of sync status icons
    //  */
    // function syncStatusRefresh() {
    //     setInterval(function() {
    //         if (!!this.viewportIds && this.viewportIds.length > 0) {
    //             updateSyncStatus(this.viewportIds, this.memory)
    //                 .then(this.redraw.bind(this));
    //         }
    //     }.bind(this), 15000);
    // }

    function syncStatusRefreshManual() {
        syncStatusRefresh.call(this)
            .then(function() {
                return waitFor(10000);
            })
            .then(function() {
                syncStatusRefresh.call(this);
            }.bind(this));
    }

    function waitFor(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    }

    function syncStatusRefresh() {
        this.viewportIds = returnViewportNodes();
        if (!!this.viewportIds && this.viewportIds.length > 0) {
            return updateSyncStatus(this.viewportIds, this.memory)
                .then(this.redraw.bind(this));
        } else {
            return Promise.resolve();
        }
    }

    /**
     * updates sync status of each treeNode on the viewPort
     *
     * @param viewportIds
     * @param memory
     * @returns {Promise.<TResult>|*}
     */
    function updateSyncStatus(viewportIds, memory) {
        return Rest.getPoids(viewportIds)
            .then(function(response) {
                response.data.treeNodes.forEach(function(treeNode) {
                    if (treeNode) {
                        var obj = memory.get(treeNode.id);
                        obj.syncStatus = treeNode.syncStatus;
                        obj.managementState = treeNode.managementState;
                        obj.radioAccessTechnology = treeNode.radioAccessTechnology;
                    }
                });
            });
    }
});
