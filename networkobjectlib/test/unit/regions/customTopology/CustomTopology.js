/*global  describe, sinon, beforeEach, afterEach, it, expect*/
define([
    'jscore/core',
    'networkobjectlib/regions/customTopology/Rest',
    'networkobjectlib/regions/topologyTree/Rest',
    'networkobjectlib/regions/topologyTree/TreeMemory',
    'networkobjectlib/regions/customTopology/CustomTopology',
    'test/resources/responses/customTopology',
    'networkobjectlib/utils/TopologyUtility',
], function(core, Rest, PoidRest, Memory, CustomTopology, ResponseData, TopologyUtility) {
    'use strict';

    describe('regions/CustomTopology', function() {
        var sandbox,
            region;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            region = new CustomTopology({
                showHeader: {
                    showTopology: {
                        showCustomTopology: {},
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi',
                            combination: {
                                collection: false,
                                networkObjects: false
                            }
                        }
                    }
                }
            });
            region.memory = new Memory();

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
        });

        afterEach(function() {
            this.xhr.restore();
            sandbox.restore();
        });

        describe('getRoots(id)', function() {
            it('Should add Root to the Memory', function(done) {
                //Assemble
                var root = ResponseData.root;

                //Act
                var call = region.getRoots(root.id);

                call.then(function() {
                    //Assert
                    expect(region.memory.has('null:' + ResponseData.root.id)).to.be.true;
                    done();
                }).catch(function(error) {
                    done(error);
                });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(root));
            });

            it('Should show error dashboard for server error', function(done) {
                //Assemble
                var root = ResponseData.root;
                sandbox.spy(region, 'showErrorDashboard');

                var expectedError = new Error({});
                sandbox.stub(Rest, 'getCustomTopologyByIdV4').returns(Promise.reject(expectedError));

                var call = region.getRoots(root.id);

                call.then(function() {
                    expect(region.memory.has('123')).to.be.false;
                    expect(region.showErrorDashboard.callCount).to.equal(1);
                    expect(region.getEventBus().publish.callCount).to.equal(1);
                    done();
                }).catch(function(error) {
                    done(error);
                });
            });

        });

        describe('getRootsAndReloadActions(id)', function() {
            it('Should convert Item and publish Reload Actions event', function(done) {
                //Assemble
                var root = ResponseData.root;
                sandbox.spy(TopologyUtility, 'convertToMemoryItem');

                //Act
                var call = region.getRootsAndReloadActions(root.id);

                call.then(function() {
                    //Assert
                    expect(TopologyUtility.convertToMemoryItem.callCount).to.equal(1);
                    expect(region.getEventBus().publish.callCount).to.equal(1);
                    done();
                }).catch(function(error) {
                    done(error);
                });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(root));
            });

            it('Should show error dashboard for server error', function(done) {
                //Assemble
                var root = ResponseData.root;
                sandbox.spy(region, 'showErrorDashboard');

                var expectedError = new Error({});
                sandbox.stub(Rest, 'getCustomTopologyByIdV4').returns(Promise.reject(expectedError));

                //Act
                var call = region.getRootsAndReloadActions(root.id);

                call.then(function() {
                    expect(region.memory.has('123')).to.be.false;
                    expect(region.showErrorDashboard.callCount).to.equal(1);
                    expect(region.getEventBus().publish.callCount).to.equal(1);
                    done();
                }).catch(function(error) {
                    done(error);
                });
            });

        });

        describe('onNodeSelect(ids)', function() {
            var testData = [
                {value: [], expected: [], publishCount: 0},
                {value: ['1'], expected: [{id: '1', parent: '100', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}], publishCount: 2},
                {value: ['1', '2'], expected: [
                    {id: '1', parent: '100', enableRemoveNodeButton: true, enableMoveToCollectionButton: true, parents: []},
                    {id: '2', parent: '100', enableRemoveNodeButton: true, enableMoveToCollectionButton: true, parents: []}
                ], publishCount: 2},
                {value: ['1', '-9'], expected: [{id: '1',  parent: '100', enableRemoveNodeButton: true, enableMoveToCollectionButton: true, parents: []}], publishCount: 2},
                {value: ['-9281474980516117'], expected: [], publishCount: 0}
            ];
            testData.forEach(function(test) {
                it('Should process on node select for ' + JSON.stringify(test.value), function() {
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id === '100') {
                            return undefined;
                        } else {
                            return {id: id, parent: '100'};
                        }

                    });

                    //Action
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    if (test.publishCount > 0) {
                        expect(region.getEventBus().publish.args[0][1]).to.deep.equal(test.expected);
                    }

                });
            });

            var testSelected = [
                {value: ['-9'], expected: [], selection: ['1']},
                {value: ['1', '-9'], expected: [{id: '1'}], selection: ['1']}
            ];
            testSelected.forEach(function(test) {
                it('Should process on node select for ' + JSON.stringify(test.value) +
                    ' and  not select for already selected ids ' + JSON.stringify(test.selection), function() {
                    //Assemble
                    region.start();
                    // region.options = {showHeader: {showTopology: {showCustomTopology: {}}}};
                    sandbox.stub(region.memory, 'get', function(id) {
                        return {id: id};
                    });
                    sandbox.spy(region, 'select');
                    region.previousSelections = test.selection ? test.selection : [];
                    //Action
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(0);
                    expect(region.select.callCount).to.equal(1);
                    expect(region.select.args[0][0]).to.deep.equal(test.selection);

                });
            });

        });

        describe('onNodeSelect(ids) for default configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30] for [10,30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30] for [10,30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true,enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: none, leaf: single, node: multi and networkObject combination configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30,20] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30,10] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30, 20] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[] for [10, 11, 12] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11', '12'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 30] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    selection: {},
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 21, 22] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 30] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 30] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'none',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: true
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: none, leaf: multi, node: multi configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,21,22] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '22', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '21', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '22', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30] for [10,30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    selection: {},
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'none',
                        collectionOfObjects: 'multi',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };
                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: single, leaf: single, node: multi configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'single',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: single, leaf: single, node: multi and collection combination configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 20] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10,20] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,10] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,10] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'single',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi',
                        combination: {
                            collection: true,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: single, leaf: single, node: none configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[10] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'single',
                        collectionOfObjects: 'single',
                        networkObjects: 'none',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: single, leaf: none, node: multi configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'single',
                        collectionOfObjects: 'none',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: multi, leaf: none, node: multi configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 11] for [10, 11] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11'],
                    expected: {
                        lastSelectedObject: {id: '11', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '11', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[] for [20, 21] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21'],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'none',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for branch: multi, leaf: single, node: multi configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10,11,12] for [10, 11, 12] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11', '12'],
                    expected: {
                        lastSelectedObject: {id: '12', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '11', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '12', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 21, 22] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for multi select all configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10,11,12] for [10, 11, 12] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11', '12'],
                    expected: {
                        lastSelectedObject: {id: '12', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '11', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '12', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '', type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,21,22] for [20, 21, 22] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '22', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '21', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '22', parent: '', type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'multi',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for multi select all and collection combination configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10,11,12] for [10, 11, 12] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11', '12'],
                    expected: {
                        lastSelectedObject: {id: '12', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '11', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '12', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 20] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 20] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    selection: {},
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,21,22] for [20, 21, 22] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '22', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '21', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '22', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 10] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 10] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'multi',
                        networkObjects: 'multi',
                        combination: {
                            collection: true,
                            networkObjects: false
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null,  type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for multi select all and networkObject combination configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30,10] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30,10] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30, 20] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10,11,12] for [10, 11, 12] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11', '12'],
                    expected: {
                        lastSelectedObject: {id: '12', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '11', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '12', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 30] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 30] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    selection: {},
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,21,22] for [20, 21, 22] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '22', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '21', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '22', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 30] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 30] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'multi',
                        networkObjects: 'multi',
                        combination: {
                            collection: false,
                            networkObjects: true
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('onNodeSelect(ids) for multi select all and both combination configuration', function() {
            var testData = [
                {
                    name: 'none for []',
                    value: [],
                    expected: {
                        lastSelectedObject: {},
                        networkObjects: [],
                        nestedCollections: []
                    },
                    publishCount: 0
                },
                {
                    name: '[30,31,32] for [30,31,32] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '31', '32'],
                    expected: {
                        lastSelectedObject: {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '31', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true},
                            {id: '32', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: true, enableMoveToCollectionButton: true}],
                        nestedCollections: []
                    },
                    publishCount: 2
                },
                {
                    name: '[30,10,20] for [30,10,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30,10] for [30,10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[30, 20] for [30,20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['30', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10] for [10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10,11,12] for [10, 11, 12] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '11', '12'],
                    expected: {
                        lastSelectedObject: {id: '12', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '11', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '12', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 30] for [10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 20] for [10, 20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20'],
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[10, 20, 30] for [10, 20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['10', '20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                            {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20] for [20] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20'],
                    selection: {},
                    expected: {
                        lastSelectedObject: {id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20,21,22] for [20, 21, 22] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '21', '22'],
                    expected: {
                        lastSelectedObject: {id: '22', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '', type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '21', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '22', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 30] for [20, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 10] for [20, 10] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10'],
                    expected: {
                        lastSelectedObject: {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []},
                        networkObjects: [],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                },
                {
                    name: '[20, 10, 30] for [20, 10, 30] (where 1x is branch,2x is leaf and 3x is object)',
                    value: ['20', '10', '30'],
                    expected: {
                        lastSelectedObject: {id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined},
                        networkObjects: [{id: '30', parent: '', type: 'MeContext', parents: [], enableRemoveNodeButton: undefined, enableMoveToCollectionButton: undefined}],
                        nestedCollections: [{id: '20', parent: '' , type: 'NESTED', subType: 'LEAF', parents: []},
                            {id: '10', parent: '' , type: 'NESTED', subType: 'BRANCH', parents: []}]
                    },
                    publishCount: 2
                }
            ];
            testData.forEach(function(test) {
                it('Should select ' + test.name , function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'multi',
                        networkObjects: 'multi',
                        combination: {
                            collection: true,
                            networkObjects: true
                        }
                    };

                    region.init();
                    region.start();
                    sandbox.stub(region.memory, 'get', function(id) {
                        if (id && id.slice(0,1) === '1') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'BRANCH'};
                        } else if (id && id.slice(0,1) === '2') {
                            return {id: id, parent: null, type: 'NESTED', subType: 'LEAF'};
                        } else if (id && id.slice(0,1) === '3') {
                            return {id: id, parent: null, type: 'MeContext'};
                        } else {
                            return undefined;
                        }
                    });

                    //Act
                    region.onNodeSelect(test.value);

                    //Assert
                    expect(region.getEventBus().publish.callCount).to.equal(test.publishCount);
                    expect(test.publishCount === 0 || JSON.stringify(region.getEventBus().publish.args[1][1]) === JSON.stringify(test.expected)).to.eql(true);

                });
            });
        });

        describe('getBranchCollectionChildren(parentId)', function() {

            it('Should return BRANCH children for given parentId', function(done) {
                //Assemble
                sandbox.spy(TopologyUtility, 'convertToMemoryItem');
                var root = ResponseData.rootWithBranchCollection.root;
                var children = [ResponseData.rootWithBranchCollection.branch];

                region.memory.addObject(root.id, root, 'null');

                //Act
                var call = region.getBranchCollectionChildren(root);

                call
                    .then(function(objects) {
                        //Assert
                        expect(TopologyUtility.convertToMemoryItem.callCount).to.equal(1);
                        expect(objects.length).to.equal(1);
                        done();
                    }).catch(function(error) {
                        done(error);
                    });
                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(children));
            });

            it('Should not return BRANCH children and handle error for server errors', function(done) {
                //Assemble
                sandbox.spy(TopologyUtility, 'convertToMemoryItem');
                sandbox.spy(region, 'showErrorDashboard');
                var expectedError = new Error({});
                sandbox.stub(Rest, 'getChildrenV4').returns(Promise.reject(expectedError));
                var root = ResponseData.rootWithBranchCollection.root;

                region.memory.addObject(root.id, root, 'null');

                //Act
                var call = region.getBranchCollectionChildren(root);

                call
                    .then(function(objects) {
                        //Assert
                        expect(objects.length).to.equal(0);
                        done();
                    }).catch(function(error) {
                        done(error);
                    });

            });

        });

        describe('getLeafCollectionChildren(parentId)', function() {

            it('Should return LEAF children for given parentId', function(done) {
                //Assemble
                var leaf = ResponseData.leafCollectionWithManagedObjectChild.leaf;
                var childrenMo = {
                    data: {
                        'treeNodes': [{
                            'id': '481474978846971',
                            'moName': 'LTE02ERBS00012',
                            'moType': 'MeContext',
                            'syncStatus': 'SYNCHRONIZED',
                            'neType': 'ERBS',
                            'parentMoType': 'SubNetwork'
                        }]
                    }
                };

                sandbox.spy(TopologyUtility, 'convertToMemoryItem');
                sandbox.stub(PoidRest, 'getPoids', function() {
                    return Promise.resolve(childrenMo);
                });

                sandbox.stub(Rest, 'getLeafCollectionChildrenV4', function() {
                    return Promise.resolve(['481474978846971']);
                });

                region.memory.addObject(leaf.id, leaf, leaf.parentId);

                //Act
                var call = region.getLeafCollectionChildren(leaf);

                call
                    .then(function(objects) {
                        //Assert
                        expect(TopologyUtility.convertToMemoryItem.callCount).to.equal(1);
                        expect(objects.length).to.equal(1);
                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });
            });

            it('Should not return LEAF children and handle error for server errors', function(done) {
                //Assemble
                sandbox.spy(TopologyUtility, 'convertToMemoryItem');
                sandbox.spy(region, 'showErrorDashboard');
                var expectedError = new Error({});
                sandbox.stub(Rest, 'getLeafCollectionChildrenV4').returns(Promise.reject(expectedError));
                var root = ResponseData.rootWithLeafCollection.root;

                region.memory.addObject(root.id, root, 'null');

                //Act
                var call = region.getLeafCollectionChildren(root);

                call
                    .then(function(objects) {
                        //Assert
                        expect(objects.length).to.equal(0);
                        done();
                    }).catch(function(error) {
                        done(error);
                    });

            });

        });

        describe('getChildren(parentId)', function() {

            [
                {type: 'BRANCH', object: ResponseData.rootWithBranchCollection.root},
                {type: 'LEAF', object: ResponseData.rootWithLeafCollection.root}
            ].forEach(function(testData) {
                it('Should make API calls to retrieve ' + testData.type + ' children', function(done) {

                    var isLeafCollection_spy = sandbox.spy(TopologyUtility, 'isLeafCollection');
                    var isBranchCollection_spy = sandbox.spy(TopologyUtility, 'isBranchCollection');

                    var getBranchCollectionChildren_stub = sandbox.stub(region, 'getBranchCollectionChildren').returns(Promise.resolve());
                    var getLeafCollectionChildren_stub = sandbox.stub(region, 'getLeafCollectionChildren').returns(Promise.resolve());

                    var call = region.getChildren(testData.object);

                    call.then(function() {
                        expect(isLeafCollection_spy.callCount).to.eql(1);
                        expect(isBranchCollection_spy.callCount).to.eql(1);
                        expect(getBranchCollectionChildren_stub.callCount).to.eql(1);
                        expect(getLeafCollectionChildren_stub.callCount).eql(1);
                    }).then(function() { done(); }, done);

                });
            });

            it('Should return data for a hybrid collection', function(done) {

                var hybridCollection = ResponseData.hybridCollectionWithManagedObjectAndLeafAndBranchChildren;
                var branchData = hybridCollection.branch;
                var leafData = hybridCollection.leaf;
                var managedObjectData = hybridCollection.managedObject;

                sandbox.stub(region, 'getBranchCollectionChildren').returns(Promise.resolve([branchData, leafData]));
                sandbox.stub(region, 'getLeafCollectionChildren').returns(Promise.resolve([managedObjectData]));

                var call = region.getChildren(hybridCollection.root);

                call.then(function(data) {
                    expect(data).to.eql([branchData, leafData, managedObjectData]);
                }).then(function() { done(); }, done);

            });

            it('Should return LEAF children for given parentId error', function(done) {
                //Assemble
                var leaf = ResponseData.leafCollectionWithManagedObjectChild.leaf;
                sandbox.spy(TopologyUtility, 'convertToMemoryItem');
                sandbox.stub(PoidRest, 'getPoids', function() {
                    return Promise.reject({
                        'userMessage': {
                            'title': 'Exception title',
                            'body': 'Descriptive error message'
                        },
                        'internalErrorCode': 12345
                    });
                });

                sandbox.stub(Rest, 'getLeafCollectionChildrenV4', function() {
                    return Promise.resolve(['481474978846971']);
                });

                region.memory.addObject(leaf.id, leaf, leaf.parentId);

                //Act
                var call = region.getChildren(leaf.id);

                call
                    .then(function(objects) {
                        //Assert
                        expect(TopologyUtility.convertToMemoryItem.callCount).to.equal(0);
                        expect(objects.length).to.equal(0);
                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });
            });

        });

        describe('getChildrenForHardRefresh(parentId)', function() {
            it('Should return data for root level for given parentId', function(done) {
                //Assemble
                var root = ResponseData.root;
                var parentId = 'null:' + root.id;
                sandbox.stub(region, 'getChildren', function() {
                    return ResponseData.children[root.id];
                });
                sandbox.spy(region, 'getRoots');

                //Action
                var call = region.getChildrenForHardRefresh(parentId);

                call.then(function(objects) {
                    //Assert
                    expect(region.getChildren.callCount).to.equal(1);
                    expect(region.getRoots.callCount).to.equal(1);
                    expect(region.memory.has('null:' + ResponseData.root.id)).to.be.true;
                    expect(objects.length).to.equal(0);
                    done();
                });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(root));
            });

            it('Should return data for non root level for given parentId', function(done) {
                //Assemble
                var nonRoot = ResponseData.rootWithLeafCollection.root;
                var parentId = nonRoot.id + ':12345';
                sandbox.stub(region, 'getChildren', function() {
                    return ResponseData.children[nonRoot.id];
                });
                sandbox.spy(Rest, 'getCustomTopologyByIdV4');

                //Action
                var call = region.getChildrenForHardRefresh(parentId);

                call.then(function(objects) {
                    //Assert
                    expect(region.getChildren.callCount).to.equal(1);
                    expect(Rest.getCustomTopologyByIdV4.callCount).to.equal(1);
                    expect(objects.length).to.equal(1);
                    done();
                });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(nonRoot));
            });
        });


    });
});
