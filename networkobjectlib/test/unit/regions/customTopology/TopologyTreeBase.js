/*global  describe, sinon, beforeEach, afterEach, it*/
define([
    'jscore/core',
    'dataviz/Tree',
    'widgets/InlineMessage',
    'networkobjectlib/regions/customTopology/TopologyTreeBase',
    'networkobjectlib/regions/customTopology/CustomTopologyView',
    'test/resources/responses/customTopology'
], function(core, Tree, InlineMessage, TopologyTreeBase, CustomTopologyView, TopologyData) {
    'use strict';

    describe('regions/TopologyTreeBase', function() {
        var sandbox,
            region;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            region = new TopologyTreeBase({
                multiselect: true
            });

            region.view = new sinon.createStubInstance(CustomTopologyView);

            var eventBusStub = sinon.createStubInstance(core.EventBus);
            region.getContext = function() {
                var stub = sinon.createStubInstance(core.AppContext);
                stub.eventBus = eventBusStub;
                return stub;
            };
            region.getEventBus = function() {
                return eventBusStub;
            };

            // fake server
            this.xhr = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];

            this.xhr.onCreate = function(xhr) {
                requests.push(xhr);
            };

            sandbox.stub(region, 'getChildrenForSoftRefresh', function(parentId) {
                return Promise.resolve(TopologyData.children[parentId]);
            });
        });

        afterEach(function() {
            this.xhr.restore();
            sandbox.restore();
        });

        describe('initSelectOptions()', function() {
            [
                {
                    name: 'default',
                    value: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi'
                        },
                        unSelectableTypes: ['noChildrenObject', 'branch'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject', 'branch'],
                        permutationSelectTypes: [['node', 'node']]
                    }
                },
                {
                    name: 'branch: none, leaf: none',
                    value: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'none',
                            networkObjects: 'multi'
                        },
                        unSelectableTypes: ['noChildrenObject', 'branch'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject', 'branch', 'leaf'],
                        permutationSelectTypes: [['node', 'node']]
                    }
                },
                {
                    name: 'branch: single',
                    value: {
                        selection: {
                            collectionOfCollections: 'single',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi'
                        },
                        unSelectableTypes: ['noChildrenObject', 'branch'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject'],
                        permutationSelectTypes: [['node', 'node']]
                    }
                },
                {
                    name: 'node: none, both collection: single',
                    value: {
                        selection: {
                            collectionOfCollections: 'single',
                            collectionOfObjects: 'single',
                            networkObjects: 'none'
                        },
                        unSelectableTypes: ['noChildrenObject', 'branch'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject', 'node'],
                        permutationSelectTypes: []
                    }
                },
                {
                    name: 'all : multi',
                    value: {
                        selection: {
                            collectionOfCollections: 'multi',
                            collectionOfObjects: 'multi',
                            networkObjects: 'multi'
                        },
                        unSelectableTypes: ['noChildrenObject', 'branch'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject'],
                        permutationSelectTypes: [['branch', 'branch'], ['leaf', 'leaf'], ['node', 'node']]
                    }
                },
                {
                    name: 'all : single',
                    value: {
                        selection: {
                            collectionOfCollections: 'single',
                            collectionOfObjects: 'single',
                            networkObjects: 'single'
                        },
                        unSelectableTypes: ['noChildrenObject', 'branch', 'leaf'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject'],
                        permutationSelectTypes: []
                    }
                },
                {
                    name: 'all : none',
                    value: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'none',
                            networkObjects: 'none'
                        },
                        unSelectableTypes: ['noChildrenObject'],
                        permutationSelectTypes: []
                    },
                    expected: {
                        unSelectableTypes: ['noChildrenObject', 'branch', 'leaf', 'node'],
                        permutationSelectTypes: []
                    }
                }

            ].forEach(function(test) {
                it('Should initSelectOptions for ' + test.name, function() {
                    //Assemble
                    region.unSelectableTypes = test.value.unSelectableTypes;
                    region.permutationSelectTypes = test.value.permutationSelectTypes;

                    //Act
                    region.initSelectOptions(test.value.selection);

                    //Assert
                    expect(region.unSelectableTypes).to.be.eql(test.expected.unSelectableTypes);
                    expect(region.permutationSelectTypes).to.be.eql(test.expected.permutationSelectTypes);

                });
            });

        });

        describe('initPermutationOptions()', function() {
            [
                {
                    name: 'default',
                    value: {
                        permutation: {
                            collection: false,
                            networkObjects: false
                        },
                        permutationSelectTypes: [
                            ['node', 'node']

                        ]
                    },
                    expected: [
                        ['node', 'node']
                    ]
                },
                {
                    name: 'collection: true',
                    value: {
                        permutation: {
                            collection: true,
                            networkObjects: false
                        },
                        permutationSelectTypes: []
                    },
                    expected: [
                        ['leaf', 'branch'],
                        ['branch', 'leaf']
                    ]
                },
                {
                    name: 'networkObjects: true',
                    value: {
                        permutation: {
                            collection: false,
                            networkObjects: true
                        },
                        permutationSelectTypes: []
                    },
                    expected: [
                        ['node', 'branch'],
                        ['branch', 'node'],
                        ['leaf', 'node'],
                        ['node', 'leaf']
                    ]
                },
                {
                    name: 'both: true',
                    value: {
                        permutation: {
                            collection: true,
                            networkObjects: true
                        },
                        permutationSelectTypes: []
                    },
                    expected: [
                        ['leaf', 'branch'],
                        ['branch', 'leaf'],
                        ['node', 'branch'],
                        ['branch', 'node'],
                        ['leaf', 'node'],
                        ['node', 'leaf']
                    ]
                }
            ].forEach(function(test) {
                it('Should initPermutationOptions for ' + test.name, function() {
                    //Assemble
                    region.permutationSelectTypes = test.value.permutationSelectTypes;

                    //Act
                    region.initPermutationOptions(test.value.permutation);

                    //Assert
                    expect(region.permutationSelectTypes).to.be.eql(test.expected);
                });
            });

        });

        describe('initRules()', function() {
            [
                {
                    name: 'default',
                    value: {
                        permutationSelectTypes: [['node', 'node']]
                    },
                    expected: {
                        branch: {branch: false, leaf: false, node: false},
                        leaf: {leaf: false, branch: false, node: false},
                        node: {node: true, branch: false, leaf: false}
                    }
                },
                {
                    name: 'all: multi',
                    value: {
                        permutationSelectTypes: [['node', 'node'], ['leaf', 'leaf'], ['branch', 'branch']]
                    },
                    expected: {
                        branch: {branch: true, leaf: false, node: false},
                        leaf: {leaf: true, branch: false, node: false},
                        node: {node: true, branch: false, leaf: false}
                    }
                },
                {
                    name: 'collection: multi, permutation of collection: true',
                    value: {
                        permutationSelectTypes: [
                            ['leaf', 'leaf'],
                            ['branch', 'branch'],
                            ['leaf', 'branch'],
                            ['branch', 'leaf']
                        ]
                    },
                    expected: {
                        branch: {branch: true, leaf: true, node: false},
                        leaf: {leaf: true, branch: true, node: false},
                        node: {node: false, branch: false, leaf: false}
                    }
                },
                {
                    name: 'all: single, both permutation: true',
                    value: {
                        permutationSelectTypes: [
                            ['leaf', 'branch'],
                            ['branch', 'leaf'],
                            ['node', 'branch'],
                            ['branch', 'node'],
                            ['leaf', 'node'],
                            ['node', 'leaf']
                        ]
                    },
                    expected: {
                        branch: {branch: false, leaf: true, node: true},
                        leaf: {leaf: false, branch: true, node: true},
                        node: {node: false, branch: true, leaf: true}
                    }
                },
                {
                    name: 'all: multi, both permutation: true',
                    value: {
                        permutationSelectTypes: [
                            ['leaf', 'branch'],
                            ['branch', 'leaf'],
                            ['node', 'branch'],
                            ['branch', 'node'],
                            ['leaf', 'node'],
                            ['node', 'leaf'],
                            ['node', 'node'],
                            ['leaf', 'leaf'],
                            ['branch', 'branch']
                        ]
                    },
                    expected: {
                        branch: {branch: true, leaf: true, node: true},
                        leaf: {leaf: true, branch: true, node: true},
                        node: {node: true, branch: true, leaf: true}
                    }
                }
            ].forEach(function(test) {
                it('Should initRules for ' + test.name, function() {
                    //Assemble
                    // region.rule = test.value.rule;
                    region.permutationSelectTypes = test.value.permutationSelectTypes;

                    //Act
                    region.initRules();

                    //Assert
                    expect(region.rule).to.be.eql(test.expected);
                });
            });

        });

        describe('onStart()', function() {
            it('Should start the region', function() {
                sandbox.stub(region, 'changeView');
                sandbox.stub(region, 'load');

                // Action
                region.onStart();

                // Assert
                expect(region.changeView.callCount).to.equal(1);
                expect(region.changeView.firstCall.calledWith('tree', 0)).to.equal(true);
                expect(region.load.callCount).to.equal(0);
                expect(Object.keys(region.subscribeEvents).length).to.equal(3);
                expect(Object.keys(region.containerSubscribeEvents).length).to.equal(5);


            });
        });

        describe('onStop()', function() {
            it('Should stop the region', function() {
                sandbox.stub(region, 'afterStop');
                sandbox.stub(region, 'changeView');
                sandbox.stub(region, 'load');
                region.onStart();

                // Action
                region.onStop();

                // Assert
                expect(region.afterStop.callCount).to.equal(1);

            });
        });

        describe('load(topologyState)', function() {
            var defaultData = [
                {name: 'undefined', value: undefined},
                {name: 'null', value: null}
            ];

            defaultData.forEach(function(testData) {
                it('Should load the Transport Topology root ' + testData.name, function(done) {
                    //Assemble
                    sandbox.spy(region, 'hideLoader');
                    sandbox.spy(region.memory, 'clearAll');
                    sandbox.spy(region.memory, 'addObject');

                    sandbox.spy(region, 'getCurrentTopologyState');
                    sandbox.spy(region, 'setTopologyState');

                    sandbox.stub(region, 'getRoots', function() {
                        var rootMemoryObj = TopologyData.memory[TopologyData.root.id];
                        region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                        return Promise.resolve([rootMemoryObj]);
                    });

                    region.onStart();

                    // Action
                    var load = region.load(testData.value);

                    load.then(function() {
                        // Assert
                        expect(region.getCurrentTopologyState.callCount).to.equal(1);
                        expect(region.setTopologyState.callCount).to.equal(1);

                        expect(region.getRoots.callCount).to.equal(1);
                        expect(region.hideLoader.callCount).to.equal(1);
                        expect(region.memory.clearAll.callCount).to.equal(1);

                        //only root exist
                        expect(Object.keys(region.memory.all()).length).to.equal(1);

                        done();
                    }).catch(function(error) {
                        done(error);
                    });

                });
            });

            it('Should load the Transport Topology - root expanded with no children found', function(done) {
                var root = TopologyData.rootWithNoChildren.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var expansions = [rootMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };

                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                //Assemble
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(1);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //only root and noChildrenObject exist
                    expect(Object.keys(region.memory.all()).length).to.equal(2);

                    //root child must be noChildrenObject
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(1);
                    expect(childObjects[0].id).to.equal('-9' + root.id);

                    //expansion
                    expect(region.visualisation.getExpansions()[0].id).to.equal(root.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - root expanded with branch collection', function(done) {
                var root = TopologyData.rootWithBranchCollection.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var expansions = [rootMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };
                //Assemble
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(1);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //child must be branch collection
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(1);
                    expect(childObjects[0].id).to.equal(TopologyData.rootWithBranchCollection.branch.id);
                    expect(childObjects[0].type).to.equal('NESTED');
                    expect(childObjects[0].subType).to.equal('BRANCH');

                    //expansion
                    expect(region.visualisation.getExpansions()[0].id).to.equal(root.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - root expanded with leaf collection', function(done) {
                var root = TopologyData.rootWithLeafCollection.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var expansions = [rootMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };
                //Assemble
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(1);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //root and leaf must be exist
                    expect(Object.keys(region.memory.all()).length).to.equal(2);

                    //child must be leaf collection
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(1);
                    expect(childObjects[0].id).to.equal(TopologyData.rootWithLeafCollection.leaf.id);
                    expect(childObjects[0].type).to.equal('NESTED');
                    expect(childObjects[0].subType).to.equal('LEAF');

                    //expansion
                    expect(region.visualisation.getExpansions()[0].id).to.equal(root.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - root expanded with leaf and branch collection', function(done) {
                var root = TopologyData.rootWithBothTypeOfCollection.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var expansions = [rootMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };
                //Assemble
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(1);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //root leaf and branch exist
                    expect(Object.keys(region.memory.all()).length).to.equal(3);

                    //children must be branch and leaf collections
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(2);
                    expect(childObjects[0].id).to.equal(TopologyData.rootWithBothTypeOfCollection.leaf.id);
                    expect(childObjects[0].type).to.equal('NESTED');
                    expect(childObjects[0].subType).to.equal('LEAF');
                    expect(childObjects[1].id).to.equal(TopologyData.rootWithBothTypeOfCollection.branch.id);
                    expect(childObjects[1].type).to.equal('NESTED');
                    expect(childObjects[1].subType).to.equal('BRANCH');

                    //expansion
                    expect(region.visualisation.getExpansions()[0].id).to.equal(root.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - root selected', function(done) {
                var root = TopologyData.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var selections = [rootMemoryObj];
                var testData = {
                    expansion: [],
                    selection: selections,
                    lastSelectionId: '',
                    selectionIds: selections.map(function(expansion) { return expansion.id; }),
                    expansionIds: []
                };

                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                //Assemble
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(0);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //only root and noChildrenObject exist
                    expect(Object.keys(region.memory.all()).length).to.equal(1);

                    //root children should not exist
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(0);

                    //selection should be root
                    expect(region.visualisation.getSelectedIds()[0]).to.equal(root.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - root expanded and selected', function(done) {
                var root = TopologyData.rootWithNoChildren.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var selections = [rootMemoryObj];
                var expansions = [rootMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: selections,
                    lastSelectionId: '',
                    selectionIds: selections.map(function(expansion) { return expansion.id; }),
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };

                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                //Assemble
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(1);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //only root and noChildrenObject exist
                    expect(Object.keys(region.memory.all()).length).to.equal(2);

                    //root child must be noChildrenObject
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(1);
                    expect(childObjects[0].id).to.equal('-9' + root.id);

                    //selection should be root
                    expect(region.visualisation.getSelectedIds()[0]).to.equal(root.id);
                    //expansion should be root
                    expect(region.visualisation.getSelectedIds()[0]).to.equal(root.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - root expanded and selected leaf and branch', function(done) {
                var root = TopologyData.rootWithBothTypeOfCollection.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var leafMemoryObj = TopologyData.memory[TopologyData.rootWithBothTypeOfCollection.leaf.id];
                var branchMemoryObj = TopologyData.memory[TopologyData.rootWithBothTypeOfCollection.branch.id];
                var selections = [leafMemoryObj, branchMemoryObj];
                var expansions = [rootMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: selections,
                    lastSelectionId: '',
                    selectionIds: selections.map(function(expansion) { return expansion.id; }),
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };

                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                //Assemble
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(1);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //should root, leaf and branch collection exist
                    expect(Object.keys(region.memory.all()).length).to.equal(3);

                    //root child must be noChildrenObject
                    var childObjects = region.memory.getChildren(root.id);
                    expect(childObjects).to.have.length(2);
                    expect(childObjects[0].id).to.equal(TopologyData.rootWithBothTypeOfCollection.leaf.id);
                    expect(childObjects[0].type).to.equal('NESTED');
                    expect(childObjects[0].subType).to.equal('LEAF');
                    expect(childObjects[1].id).to.equal(TopologyData.rootWithBothTypeOfCollection.branch.id);
                    expect(childObjects[1].type).to.equal('NESTED');
                    expect(childObjects[1].subType).to.equal('BRANCH');

                    //selection should be root
                    expect(region.visualisation.getSelectedIds()[0]).to.equal(TopologyData.rootWithBothTypeOfCollection.leaf.id);
                    //expansion should be root
                    expect(region.visualisation.getSelectedIds()[1]).to.equal(TopologyData.rootWithBothTypeOfCollection.branch.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should not load the Transport Topology root on fail (500) ', function(done) {
                //Assemble
                sandbox.stub(region, 'getRoots', function() {
                    return Promise.reject(new Error('server error'));
                });
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load();

                load.then(function() {
                    expect(region.getCurrentTopologyState.callCount).to.equal(1);
                    expect(region.setTopologyState.callCount).to.equal(1);
                    //topology should not exist
                    expect(region.view.getTopology()).to.be.undefined;
                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - branch collection expanded with no children found', function(done) {
                var root = TopologyData.branchCollectionWithNoChildren.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var childMemoryObj = TopologyData.memory[TopologyData.branchCollectionWithNoChildren.branch.id];
                var expansions = [rootMemoryObj, childMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };
                //Assemble
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    // expect(region.getCurrentTopologyState.callCount).to.equal(0);
                    expect(region.setTopologyState.callCount).to.equal(1);

                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForSoftRefresh.callCount).to.equal(2);

                    expect(region.hideLoader.callCount).to.equal(1);
                    expect(region.memory.clearAll.callCount).to.equal(1);

                    //root and branch must be exist
                    expect(Object.keys(region.memory.all()).length).to.equal(3);

                    //root child must be branch collection
                    var rootChildObjects = region.memory.getChildren(root.id);
                    expect(rootChildObjects).to.have.length(1);
                    expect(rootChildObjects[0].id).to.equal(TopologyData.branchCollectionWithNoChildren.branch.id);
                    expect(rootChildObjects[0].subType).to.equal('BRANCH');
                    expect(rootChildObjects[0].type).to.equal('NESTED');

                    //child of branch collection should be
                    var childObjects = region.memory.getChildren(TopologyData.branchCollectionWithNoChildren.branch.id);
                    expect(childObjects[0].id).to.equal(TopologyData.branchCollectionWithNoChildren.noChildrenObject.id);


                    //expansion
                    expect(region.visualisation.getExpansions()[0].id).to.equal(root.id);
                    expect(region.visualisation.getExpansions()[1].id).to.equal(TopologyData.branchCollectionWithNoChildren.branch.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

            it('Should load the Transport Topology - leaf collection expanded with no children found', function(done) {
                var root = TopologyData.leafCollectionWithNoChildren.root;
                var rootMemoryObj = TopologyData.memory[root.id];
                var childMemoryObj = TopologyData.memory[TopologyData.leafCollectionWithNoChildren.leaf.id];
                var expansions = [rootMemoryObj, childMemoryObj];
                var testData = {
                    expansion: expansions,
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: expansions.map(function(expansion) { return expansion.id; })
                };
                //Assemble
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region.memory, 'clearAll');
                sandbox.spy(region.memory, 'addObject');
                sandbox.spy(region, 'getCurrentTopologyState');
                sandbox.spy(region, 'setTopologyState');

                region.onStart();

                // Action
                var load = region.load(testData);

                load.then(function() {
                    // Assert
                    //root and branch must be exist
                    expect(Object.keys(region.memory.all()).length).to.equal(3);

                    //root child must be branch collection
                    var rootChildObjects = region.memory.getChildren(root.id);
                    expect(rootChildObjects).to.have.length(1);
                    expect(rootChildObjects[0].id).to.equal(TopologyData.leafCollectionWithNoChildren.leaf.id);
                    expect(rootChildObjects[0].type).to.equal('NESTED');
                    expect(rootChildObjects[0].subType).to.equal('LEAF');

                    //child of branch collection should be no object
                    var childObjects = region.memory.getChildren(TopologyData.leafCollectionWithNoChildren.leaf.id);
                    expect(childObjects[0].id).to.equal(TopologyData.leafCollectionWithNoChildren.noChildrenObject.id);


                    //expansion
                    expect(region.visualisation.getExpansions()[0].id).to.equal(root.id);
                    expect(region.visualisation.getExpansions()[1].id).to.equal(TopologyData.leafCollectionWithNoChildren.leaf.id);

                    done();
                }).catch(function(error) {
                    done(error);
                });

            });

        });

        describe('refresh(topologyState)', function() {
            beforeEach(function() {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.spy(region, 'load');
                sandbox.spy(region, 'hardRefresh');
                region.onStart();
                region.setIsRefreshOn(false);
            }),

            it('Should call hard refresh', function() {
                // Action
                var result = region.refresh({'isHardRefresh': true});
                // Assert
                expect(region.load.callCount).to.equal(0);
                expect(region.hardRefresh.callCount).to.equal(1);
            }),

            it('Should call load', function() {
                // Action
                var result = region.refresh({'isHardRefresh': false});
                // Assert
                expect(region.load.callCount).to.equal(1);
                expect(region.hardRefresh.callCount).to.equal(0);
            });
        });

        describe('ProcessHardRefreshPromises', function () {
            it('should handle error by setting isRefreshOn to false and hiding the loader', function (done) {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function () {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                sandbox.stub(Promise, 'all').returns(Promise.reject({ title: 'test title', body: 'test body' }));
                sandbox.spy(region, 'hideLoader');
                region.onStart();

                // Action
                var refresh = region.hardRefresh();

                refresh.then(function () {
                    done();
                }).catch(function (error) {
                    expect(region.hideLoader.callCount).to.equal(1);
                    done(error);
                });
            });
        });

        describe('hardRefresh(topologyState)', function() {
            it('Should call hardRefresh correctly', function(done) {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                // sandbox.spy(region, 'ProcessHardRefreshPromises');
                region.onStart();

                // Action
                var refresh = region.hardRefresh();

                refresh.then(function(objects) {
                    // Assert
                    expect(objects[0].id).to.equal(root.id);
                    done();
                }).catch(function(error) {
                    done(error);
                });
            });

            it('Should call hardRefresh correctly when last selection exist', function(done) {
                var root = TopologyData.rootWithBranchCollection.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });

                sandbox.stub(region, 'getChildrenForHardRefresh', function() {
                    return Promise.resolve([TopologyData.children[root.id]]);
                });

                var testData = {
                    expansion: [root.id],
                    selection: [],
                    lastSelectionId: TopologyData.rootWithBranchCollection.branch.id,
                    selectionIds: [],
                    expansionIds: []
                };
                region.onStart();

                // Action
                var refresh = region.hardRefresh(testData);

                refresh.then(function(objects) {
                    // Assert
                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.getChildrenForHardRefresh.callCount).to.equal(1);
                    expect(objects[0].id).to.equal(root.id);
                    done();
                }).catch(function(error) {
                    done(error);
                });
            });
        });

        describe('showRefreshNotification()', function() {
            it('should call showRefreshNotification with event data and render the notification', function() {
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region, 'setTopologyState');
                sandbox.stub(region, 'getCurrentTopologyState').returns({
                    expansion: [{id: '111:1001', category: 'public'}],
                    selection: [{id: '112:1001', category: 'public'}]
                });

                region.refreshNotification = {
                    detach: function() {},
                    destroy: function() {}
                };

                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[TopologyData.root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });

                region.onStart();

                region.showRefreshNotification({collectionId: '1001', collectionName: 'test'});

                expect(region.refreshNotification).to.not.be.undefined;
                expect(region.refreshNotification.options.autoDismiss).to.eql(false);
            });

            it('should call showRefreshNotification and not render notification if collections are not expended or selected', function() {
                sandbox.spy(region, 'hideLoader');
                sandbox.spy(region, 'setTopologyState');
                sandbox.stub(region, 'getCurrentTopologyState').returns({
                    expansion: [{id: '111:1001', category: 'public'}],
                    selection: [{id: '112:1001', category: 'public'}]
                });

                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[TopologyData.root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });

                region.onStart();

                region.showRefreshNotification({collectionId: '1003', collectionName: 'test'});

                expect(region.refreshNotification).to.be.undefined;
            });
        });

        describe('getCurrentTopologyState()', function() {
            it('Should get the current state of the topology', function() {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                var expectedState = {
                    expansion: [],
                    selection: [],
                    lastSelectionId: undefined,
                    selectionIds: [],
                    expansionIds: []
                };

                region.onStart();

                // Action
                var currentState = region.getCurrentTopologyState();

                // Assert
                expect(currentState).to.eql(expectedState);

            });
        });

        describe('changeView(view, rootItems)', function() {
            var testData = [
                {name: 'null', value: null},
                {name: 'undefined', value: undefined},
                {name: '0', value: -4},
                {name: '0', value: 0},
                {name: '1', value: 1},
                {name: '4', value: 4}
            ];
            testData.forEach(function(testData) {
                it('Should create TreeView for rootItem ' + testData.name, function() {
                    sandbox.stub(region, 'load');

                    region.onStart();
                    var oldVisualisation = region.visualisation;

                    // Action
                    region.changeView('tree', testData.value);

                    // Assert
                    expect(region.visualisation).to.not.equal(oldVisualisation);

                });
            });

        });

        describe('getTopologyState()', function() {
            var topologyStates = [
                {name: '{}', value: {}},
                {name: 'undefined', value: {}},
                {name: 'null', value: {}},
                {name: 'empty state object', input: {}, value: {
                    expansion: [],
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: []
                }},
                {name: 'object',
                    input: {
                        expansion: [{}],
                        selection: [{}],
                        lastSelectionId: '111',
                        selectionIds: ['12345'],
                        expansionIds: ['12333']
                    },
                    value: {
                        expansion: [{}],
                        selection: [{}],
                        lastSelectionId: '111',
                        selectionIds: ['12345'],
                        expansionIds: ['12333']
                    }}
            ];

            topologyStates.forEach(function(testData) {
                it('Should get Topology State for '  + testData.name, function() {

                    sandbox.stub(region, 'load');
                    region.onStart();
                    if (testData.input) {
                        region.setTopologyState(testData.input);
                    }

                    // Action
                    var actualState = region.getTopologyState();

                    // Assert
                    expect(actualState).to.eql(testData.value);

                });
            });

        });

        describe('setTopologyState()', function() {
            var topologyStates = [
                {name: '{}', value: {}, expected: {
                    expansion: [],
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: []
                }},
                {name: 'undefined', value: undefined, expected: {
                    expansion: [],
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: []
                }},
                {name: 'null', value: null, expected: {
                    expansion: [],
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: []
                }},
                {name: 'empty state object', value: {}, expected: {
                    expansion: [],
                    selection: [],
                    lastSelectionId: '',
                    selectionIds: [],
                    expansionIds: []
                }},
                {name: 'object',
                    value: {
                        expansion: [{}],
                        selection: [{}],
                        lastSelectionId: '111',
                        selectionIds: ['12345'],
                        expansionIds: ['12333']
                    },
                    expected: {
                        expansion: [{}],
                        selection: [{}],
                        lastSelectionId: '111',
                        selectionIds: ['12345'],
                        expansionIds: ['12333']
                    }}
            ];

            topologyStates.forEach(function(testData) {
                it('Should set Topology State for '  + testData.name, function() {

                    sandbox.stub(region, 'load');
                    region.onStart();

                    // Action
                    region.setTopologyState(testData.value);

                    // Assert
                    expect(region.getTopologyState()).to.eql(testData.expected);

                });
            });

        });

        describe('subscribeVisualisationEvents()', function() {
            it('Should subscribe visualization events', function() {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                region.onStart();
                sandbox.stub(region, 'load');
                sandbox.spy(region.visualisation, 'addEventHandler');

                // Action
                region.subscribeVisualisationEvents();

                // Assert
                expect(region.visualisation.addEventHandler.callCount).to.equal(2);


            });
        });

        describe('unsubscribeVisualisationEvents()', function() {
            it('Should unsubscribe visualization events', function() {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                region.onStart();
                sandbox.stub(region, 'load');
                sandbox.spy(region.visualisation, 'addEventHandler');
                sandbox.spy(region.visualisation, 'removeEventHandler');
                region.subscribeVisualisationEvents();

                // Action
                region.unsubscribeVisualisationEvents();

                // Assert
                expect(region.visualisation.addEventHandler.callCount).to.equal(2);
                expect(region.visualisation.removeEventHandler.callCount).to.equal(2);

            });
        });

        describe('showErrorDashboard()', function() {
            it('Should show error dashboard', function() {
                sandbox.stub(region, 'load');
                region.onStart();

                region.view.getTree = function() {
                    return new sinon.createStubInstance(core.Element);
                };
                region.view.getErrorMessageArea = function() {
                    return new sinon.createStubInstance(core.Element);
                };

                // Action
                region.showErrorDashboard({title: 'Error', body: 'Error body'});

                // Assert
                expect(region.errorDashboard).not.to.be.undefined;

            });

        });

        describe('hideErrorDashboard()', function() {
            it('Should hide error dashboard', function() {
                sandbox.stub(region, 'load');
                region.onStart();

                region.view.getTree = function() {
                    return new sinon.createStubInstance(core.Element);
                };
                region.view.getErrorMessageArea = function() {
                    return new sinon.createStubInstance(core.Element);
                };
                region.showErrorDashboard({title: 'Error', body: 'Error body'});
                sandbox.spy(region.errorDashboard, 'destroy');

                // Action
                region.hideErrorDashboard();

                // Assert
                expect(region.errorDashboard.destroy.callCount).to.equal(1);

            });

        });

        describe('select(selectIds)', function() {
            it('Should select the items on visualisation', function() {
                var root = TopologyData.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                region.onStart();
                sandbox.spy(region.visualisation, 'unselectAll');
                sandbox.spy(region.visualisation, 'select');
                var selecIds = ['123', '234'];

                // Action
                region.select(selecIds);

                // Assert
                expect(region.visualisation.unselectAll.callCount).to.equal(1);
                expect(region.visualisation.select.getCall(0).calledWith(selecIds)).to.equal(true);

            });
        });

        describe('expandNodes(ids)', function() {
            var testData = [
                {value: [], expected: {}},
                {value: ['1'], expected: {id: '1'}},
                {value: ['1', '2'], expected: {id: '1'}}
            ];
            testData.forEach(function(test) {
                it('Should expand nodes correctly for ' + JSON.stringify(test.value), function() {
                    sandbox.stub(region, 'load');
                    region.onStart();
                    sandbox.stub(region.visualisation, 'expand');
                    sandbox.stub(region.memory, 'get', function(id) {
                        return {id: id};
                    });

                    // Action
                    region.expandNodes(test.value);

                    // Assert
                    expect(region.visualisation.expand.callCount).to.equal(test.value.length);

                });
            });

        });

        describe('onActionFinished()', function() {
            var promise = new Promise(function(resolve, reject) {
                resolve();
            });
            beforeEach(function() {
                var root = TopologyData.rootWithNoChildren.root;
                sandbox.stub(region, 'getRoots', function() {
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    return Promise.resolve([rootMemoryObj]);
                });
                region.onStart();
                sandbox.stub(region, 'load');
                sandbox.stub(region.memory, 'get', function(id) {
                    if (id === TopologyData.rootWithNoChildren.root.id) {
                        return TopologyData.memory[id];
                    } else {
                        return null;
                    }

                });
                sandbox.stub(region.visualisation, 'getLastSelectedId', function() {
                    return TopologyData.rootWithNoChildren.root.id;
                });
                sandbox.stub(region.visualisation, 'getSelectedIds', function() {
                    return [TopologyData.rootWithNoChildren.root.id];
                });

                sandbox.stub(region, 'refresh', function() {
                    return promise;
                });
            });

            it('All action completed : Should refresh ONCE, if refresh is NOT blocked ', function() {
                // Action
                region.onActionFinished();

                // Assert
                expect(region.refresh.callCount).to.equal(1);
                expect(region.refresh.args[0][0].lastSelectionId).to.equal('281474978623584');
            });

            it('All action completed : Should refresh ONCE, and should publish RELOAD_ACTIONS ', function() {
                // Action
                region.onActionFinished({action: 'networkexplorer-edit-search-criteria-collection'});

                // Assert
                expect(region.refresh.callCount).to.equal(1);
                expect(region.refresh.args[0][0].lastSelectionId).to.equal('281474978623584');
                promise.then(function() {
                    expect(region.getEventBus().publish.callCount).to.equal(1);
                    expect(region.getEventBus().publish.getCall(0).calledWith('topologybrowser:reload-actions')).to.equal(true);
                });
            });
        });

        describe('queryData', function() {
            afterEach(function() {
                region.memory.clearAll();
            });

            [
                {
                    description: 'Should get data from server',
                    queries: [
                        {
                            offset: 0,
                            limit: 0,
                            parent: '281474978623584'
                        }
                    ],
                    children: TopologyData.children['281474978623584']
                },
                {
                    description: 'Should get data from server - parent with no children',
                    queries: [
                        {
                            offset: 0,
                            limit: 0,
                            parent: '281474978623584'
                        }
                    ],
                    children: []
                },
                {
                    description: 'Should get data from server - parent with children',
                    queries: [
                        {
                            offset: 0,
                            limit: 0,
                            parent: '281474978623587'
                        }
                    ],
                    children: [TopologyData.children['281474978623587']],
                    childId: '281474978623587'
                }
            ].forEach(function(test) {
                it(test.description, function(done) {
                    //Setup
                    var root = TopologyData.rootWithNoChildren.root;
                    var rootMemoryObj = TopologyData.memory[root.id];
                    region.memory.addObject(rootMemoryObj.id, rootMemoryObj, rootMemoryObj.parent);
                    if (test.childId) {
                        var childMemoryObj = TopologyData.memory[test.childId];
                        region.memory.addObject(childMemoryObj.id, childMemoryObj, root.id);
                    }

                    region.getChildrenForSoftRefresh = function() {
                        return Promise.resolve(test.children);
                    };

                    expect(region.memory.get(root.id).id).to.equal(root.id);
                    //Action
                    region.queryData(test.queries, function(output) {
                        expect(output[0].parent).to.equal(root.id);
                        expect(output[0].items).to.eql(TopologyData.children[root.id]);

                        done();
                    }, function(error) {
                        done(error);
                    }, false);
                });
            });
        });

        describe('onRightClick', function() {
            it('', function() {
                //Action
                region.getElement().trigger('contextmenu');
            });
        });
    });
});

