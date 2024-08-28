define([
    'jscore/core',
    'jscore/ext/privateStore',
    'jscore/ext/utils',
    'jscore/ext/utils/base/underscore',
    'dataviz/Tree',
    'dataviz/MillerColumns',
    'widgets/Loader',
    'widgets/InfoPopup',
    'widgets/InlineMessage',
    '../../widgets/NodeItem/NodeItem',
    'i18n!networkobjectlib/dictionary.json',
    './CustomTopologyView',
    '../topologyTree/TreeMemory',
    '../topologyTree/Rest',
    './Rest',
    './TopologyTreeBase',
    '../../utils/Constants',
    '../../utils/TopologyUtility',
    'widgets/Dialog',
    '../../utils/customError'
], function(core, PrivateStore, utils, _, Tree, MillerColumns, Loader, InfoPopup, InlineMessage, NodeItem, i18n, View, TreeMemory,
    TopologyRest, Rest, TopologyTreeBase, Constants, TopologyUtility, Dialog, customError) {

    return TopologyTreeBase.extend({
        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            var applyRecursivelyInfopop = new InfoPopup({
                content: i18n.applyRecursivelyInfoContent,
                width: '300px'
            });
            if (this.options.applyRecursively) {
                applyRecursivelyInfopop.attachTo(this.view.getCheckboxInfoHolder());
                this.view.getApplyRecursivelyCheckBox().addEventHandler('click', this.handleCheckBoxEvent.bind(this));
                this.view.getApplyRecursivelyCheckBox().setProperty('checked', true);
            }
        },

        handleCheckBoxEvent: function() {
            this.getEventBus().publish(Constants.CustomEvent.APPLY_RECURSIVELY, this.view.getIsApplyRecursivelyChecked());
        },

        getRoots: function(id) {
            return Rest.getCustomTopologyByIdV4(id)
                .then(function(res) {
                    var root = TopologyUtility.convertToMemoryItem(res, null);
                    this.memory.addObject(root.id, root, root.parent);
                    return root;
                }.bind(this))
                .catch(function(error) {
                    this.showErrorDashboard(error);
                    this.getEventBus().publish(Constants.CustomEvent.FETCH_ROOT_ERROR);
                }.bind(this));
        },

        getRootsAndReloadActions: function(id) {
            return Rest.getCustomTopologyByIdV4(id)
                .then(function(res) {
                    var parentId = null;
                    if (res.parentId && res.parentId>0) {
                        parentId = res.parentId;
                    }
                    var node = TopologyUtility.convertToMemoryItem(res, parentId);
                    if (parentId) {
                        Rest.getChildren(node.parent).then(function() {
                            var myNode = utils.clone(this.memory.get(node.id));
                            myNode.id = TopologyUtility.getChildPoid(myNode.id);
                            myNode.parent = TopologyUtility.getChildPoid(myNode.parent);
                            this.getEventBus().publish(Constants.CustomEvent.RELOAD_ACTIONS, [myNode]);
                        }.bind(this));
                    } else {
                        node.id = TopologyUtility.getChildPoid(node.id);
                        node.parent = TopologyUtility.getChildPoid(node.parent);
                        this.getEventBus().publish(Constants.CustomEvent.RELOAD_ACTIONS, [node]);
                    }
                }.bind(this))
                .catch(function(error) {
                    this.showErrorDashboard(error);
                    this.getEventBus().publish(Constants.CustomEvent.FETCH_ROOT_ERROR);
                }.bind(this));

        },

        getChildrenForSoftRefresh: function(parentId) {
            var obj = this.memory.get(parentId);
            //Need poid of the object to make a REST request
            var poid = TopologyUtility.getChildPoid(parentId);

            var parent = {
                id: poid,
                type: obj.type,
                subType: obj.subType,
                compositeId: parentId,
                hybrid: obj.hybrid
            };

            return this.getChildren(parent);
        },

        getLeafCollectionChildren: function(parent) {
            return Rest.getLeafCollectionChildrenV4(parent.id)
                .then(function(res) {
                    if (Array.isArray(res) && res.length > 0) {
                        return TopologyRest.getPoids(res);
                    } else {
                        return Promise.resolve([]);
                    }
                }.bind(this))
                .then(function(objects) {
                    if (objects.length === 0) {
                        return [];
                    }
                    var objectChildren = objects.data.treeNodes.map(function(child) {
                        return TopologyUtility.convertToMemoryItem(child, parent.compositeId);
                    }.bind(this));
                    return TopologyUtility.getSorted(objectChildren).map(function(obj, i) {
                        obj.offset = i;
                        return obj;
                    });
                }.bind(this))
                .catch(function(error) {
                    if (error.code !== customError.CollectionNotFound.code) {
                        showDialog.call(this, 'error', error.title, error.body, function() {}.bind(this));
                    }
                    return [];
                }.bind(this));
        },

        getBranchCollectionChildren: function(parent) {
            if (!parent.id) {
                return Promise.resolve([]); // case of root with null parent
            }
            return Rest.getChildrenV4(parent.id, this.options.showNodeCount)
                .then(function(children) {
                    var objectChildren = children.map(function(child) {
                        return TopologyUtility.convertToMemoryItem(child, parent.compositeId);
                    }.bind(this));
                    //Transport root/child branch if doesn't has any children add noChildren object
                    if (objectChildren.length === 0) {
                        return [];
                    }
                    return TopologyUtility.getSorted(objectChildren).map(function(obj, i) {
                        obj.offset = i;
                        return obj;
                    });
                }.bind(this))
                .catch(function(error) {
                    if (error.code !== customError.CollectionNotFound.code) {
                        showDialog.call(this, 'error', error.title, error.body, function() {
                        }.bind(this));
                    }
                    return [];
                }.bind(this));
        },

        getChildren: function(parent) {
            if (parent && (TopologyUtility.isLeafCollection(parent) || TopologyUtility.isBranchCollection(parent) || TopologyUtility.isSearchCriteriaCollection(parent))) {
                return Promise.all([this.getBranchCollectionChildren(parent), this.getLeafCollectionChildren(parent)])
                    .then(function(data) {
                        /// flatten array of Promises into single array - [[{}]. [{}]] -> [{}, {}]
                        return data.reduce(function(previousValue, currentValue) {
                            return previousValue.concat(currentValue);
                        }, []);
                    });
            } else {
                return Promise.resolve([]);
            }
        },

        getChildrenForHardRefresh: function(parentId) {
            var parent = TopologyUtility.getParentPoid(parentId);

            if (parent === 'null') {
                //root (level 0)
                return this.getRoots(this.options.customTopologyId).then(function(parentObject) {
                    parentObject.id = TopologyUtility.getChildPoid(parentObject.id);
                    parentObject.compositeId = parentId;
                    return this.getChildren(parentObject);
                }.bind(this));
            }
            else {
                return Rest.getCustomTopologyByIdV4(parent).then(function(parentObject) {
                    parentObject.compositeId = (parentObject.parentIds ? parentObject.parentIds[0] : null) + ':' + parent;
                    return this.getChildren(parentObject);
                }.bind(this));
            }
        },

        onNodeSelect: function(ids) {
            var lastSelectedId = this.visualisation.getLastSelectedId();
            var selectedIds = [];
            var noOfIdsFromDataViz = ids.length;
            var firstObj;
            var lastObj;
            var parentObject;

            //Shift click in dataviz from bottom to top not given correct order of selection. Also not giving order of what user clicked.
            //So need to revers it
            if (this.previousLastSelected && this.previousLastSelected.id === ids[ids.length - 1] && lastSelectedId === ids[0]) {
                ids.reverse();
            } else if (this.previousLastSelected && ids.length > 1 && this.previousLastSelected.id !== ids[0] && lastSelectedId === ids[0]) {
                if (ids.indexOf(this.previousLastSelected.id) !== -1) {
                    ids = ids.splice(0, ids.indexOf(this.previousLastSelected.id) + 1).reverse();
                }
            }

            if ('get' in this.memory) {
                firstObj = this.memory.get(ids[0]);
                lastObj = this.memory.get(ids[ids.length -1]);

                if (firstObj) {
                    parentObject = this.memory.get(firstObj.parent);
                }
            }

            // process unselectable rules
            var selectableIds = this.processUnselectRules(ids);
            //process selectable rules
            selectedIds = this.processSelectRules(firstObj, lastObj, selectableIds);



            // if unselectable was selected
            if (noOfIdsFromDataViz > selectedIds.length) {
                this.unsubscribeVisualisationEvents();

                // and it was the only thing selected, select previous
                if (selectedIds.length === 0) {
                    selectedIds = this.previousSelections;
                }

                if (selectedIds && selectedIds.length !== 0) {
                    // re-select
                    this.select(selectedIds);
                } else {
                    this.visualisation.unselectAll();
                }
                // inside timeout otherwise selection above is being triggered
                setTimeout(function() {
                    this.subscribeVisualisationEvents();
                }.bind(this), 100);
            }

            // stop if nothing new was selected
            if (_.isEqual(this.previousSelections, selectedIds)) {
                return false;
            }

            this.previousSelections = selectedIds;

            // Add full path into the last object which is the last selected

            //TODO Duplicate - poid need to preapre for all selected objects
            var nodeobjects = selectedIds.map(function(id) {
                var obj = this.memory.get(id);
                var memoryObject;

                if (obj) {
                    memoryObject = JSON.parse(JSON.stringify(obj));

                    //if (obj && (selectedIds.length - 1 === index)) {
                    var parents = [];
                    collectAllParentIds.call(this, memoryObject, parents);

                    parents = parents.map(function(parent) {
                        return TopologyUtility.getChildPoid(parent);
                    });
                    memoryObject.parents = parents;
                    //}
                    memoryObject.id = TopologyUtility.getChildPoid(memoryObject.id);
                    memoryObject.parent = TopologyUtility.getChildPoid(memoryObject.parent);
                    return memoryObject;
                }

            }.bind(this));
            this.previousLastSelected = this.memory.get(selectedIds[selectedIds.length -1]);
            nodeobjects = addObjectFlags(nodeobjects, parentObject);
            // check if what was selected is still in the database
            // if (selectedIds.length > 0) {
            //     var idsToCheck = objects.map(function(object) { return object.id; })
            //         .slice(-1); // for now we just check if the last selection
            //
            //     Rest.getPoids(idsToCheck)
            //         .then(function(response) {
            //             var aliveIds = response.data.treeNodes.map(function(object) { return object.id; });
            //             var removedIds = idsToCheck.filter(function(id) { return aliveIds.indexOf(id) === -1; });
            //             // update sync status and redraw tree with the new icon
            //             response.data.treeNodes.forEach(function(item) {
            //                 var obj = this.memory.get(item.id);
            //                 obj.syncStatus = item.syncStatus;
            //             }.bind(this));
            //
            //             this.redraw();
            //
            //             // TODO this.remove must be able to remove more than one id at once
            //             removedIds.forEach(function(id) {
            //                 var error = new customError.NetworkObjectNotFound();
            //                 showDialog.call(this, 'error', error.title, error.message, function() {
            //                     this.remove(id);
            //                 }.bind(this));
            //             }.bind(this));
            //         }.bind(this));
            // }
            this.getEventBus().publish(Constants.CustomEvent.NODE_SELECT, nodeobjects); // This is DEPRECATED event and replaced by event below.
            this.getEventBus().publish(Constants.CustomEvent.NODE_OBJECT_SELECT, buildAllObjects(nodeobjects));
        },


        processUnselectRules: function(ids) {
            return ids.filter(function(id) {
                var currObj = this.memory.get(id);
                var result = this.ruleUnselect(currObj, this.unSelectableTypes);
                return result;
            }.bind(this));
        },

        processSelectRules: function(firstObj, lastObj, ids) {
            var count = {
                branch: 0,
                leaf: 0,
                node: 0
            };
            return ids.filter(function(id, index) {
                var currObj = this.memory.get(id);
                var result = false;
                var currType = TopologyUtility.getObjectTypeForSelection(currObj);

                if (index > 0) {
                    if ((count.branch === 0 || this.rule.branch[currType]) &&
                        (count.leaf === 0 || this.rule.leaf[currType]) &&
                        (count.node === 0 || this.rule.node[currType])) {
                        count[currType]++;
                        result = true;
                    } else {
                        return false;
                    }
                } else {
                    count[currType]++;
                    result = true;
                }
                return result;
            }.bind(this));
        },

        selectCondition: {
            node: function(obj) { return TopologyUtility.isNetworkObject(obj); },
            noChildrenObject: function(obj) { return TopologyUtility.isObject(obj) ? TopologyUtility.isNoChildrenObject(obj.id) : TopologyUtility.isNoChildrenObject(obj); },
            branch: TopologyUtility.isBranchCollection,
            leaf: function(obj) { return (TopologyUtility.isLeafCollection(obj) || TopologyUtility.isSearchCriteriaCollection(obj)); },
            collection: TopologyUtility.isCollection
        },

        ruleUnselect: function(currObj, types) {
            return types.reduce(function(acc, cur) {
                return acc && !this.selectCondition[cur](currObj);
            }.bind(this), true);
        }

    });

    function addObjectFlags(objects, parentObject) {
        // Filtering check to enable the 'Remove from Collection' and 'Move to Collection' buttons
        // button for default is undefined
        var enableRemoveNodeButton;
        var enableMoveToCollectionButton;

        //check if inside the array of the objects selected contains *ONLY* nodes
        var filteredObjects = objects.filter(function(el) {
            return TopologyUtility.isCollection(el);
        });

        // if contains only nodes selected
        if (filteredObjects.length === 0 && objects.length > 0) {
            // get the parentId(LEAF) from the first node
            var objParent = objects[0].parent;
            // compare if the nodes selected have the same parentId(LEAF)
            filteredObjects = objects.filter(function(el) {
                return el.parent !== objParent;
            });

            // if there is no different parentId(LEAF) enable the enableRemoveNodeButton and enableMoveToCollectionButton become true
            if (filteredObjects.length === 0 && !TopologyUtility.isSearchCriteriaCollection(parentObject)) {
                enableRemoveNodeButton = true;
                enableMoveToCollectionButton = true;
            }
        }

        // assign enableRemoveNodeButton and enableMoveToCollectionButton to the objects
        objects = objects.map(function(el) {
            var o = Object.assign({}, el);
            o.enableRemoveNodeButton = enableRemoveNodeButton;
            o.enableMoveToCollectionButton = enableMoveToCollectionButton;
            return o;
        });
        return objects;
    }

    function showDialog(type, header, content, callback) {
        var modalDialog = new Dialog({
            header: header,
            content: content,
            buttons: [{
                caption: i18n.buttons.ok,
                action: function() {
                    // TODO remove .hide() when TORF-184466 is delivered
                    modalDialog.hide();
                    modalDialog.destroy();

                    callback();
                }.bind(this)
            }],
            type: type
        });

        if (this.dialog) {
            // TODO remove .hide() when TORF-184466 is delivered
            this.dialog.hide();
            this.dialog.destroy();
        }

        modalDialog.show();
        this.dialog = modalDialog;
    }

    function collectAllParentIds(node, array) {
        var parent = node.parent ? this.memory.get(node.parent) : null;
        if (parent) {
            array.push(parent.id);
            collectAllParentIds.call(this, parent, array);
        }
        else {
            return array;
        }
    }

    function buildAllObjects(nodeObjects) {
        var allObjects = {
            lastSelectedObject: nodeObjects[nodeObjects.length - 1],
            networkObjects: nodeObjects.filter(function(node) {
                return !TopologyUtility.isCollection(node);
            }),
            nestedCollections: nodeObjects.filter(function(node) {
                return TopologyUtility.isCollection(node);
            })
        };
        return allObjects;
    }
});
