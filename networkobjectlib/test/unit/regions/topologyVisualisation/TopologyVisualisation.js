define([
    'jscore/core',
    'networkobjectlib/regions/topologyFDN/TopologyFDN',
    'networkobjectlib/regions/topologyTree/TopologyTree',
    'networkobjectlib/regions/topologyHeader/TopologyHeader',
    'networkobjectlib/regions/topologyVisualisation/TopologyVisualisation',
    'networkobjectlib/utils/LauncherUtils',
    'container/api'
], function(core, TopologyFDN, TopologyTree, TopologyHeader, TopologyVisualisation, LauncherUtils, Container) {
    'use strict';

    describe('regions/TopologyVisualisation', function() {
        var sandbox,
            region;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            region = new TopologyVisualisation();
            region.topologyFDN = new TopologyFDN();
            region.topologyTree = new TopologyTree();
            region.topologyHeader = new TopologyHeader();

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

        describe('init()', function() {
            it('Should initiate topologies', function() {
                //Act
                region.init();

                //Assert
                expect(region.topologies instanceof Object).to.be.true;
                expect(region.topologies).to.be.empty;
            });
        });

        describe('initSelection()', function() {
            [
                {
                    value: undefined,
                    name: 'undefined',
                    expected: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi'
                        }
                    }
                },
                {
                    value: null,
                    name: 'null',
                    expected: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi'
                        }
                    }
                },
                {
                    value: [],
                    name: '[]',
                    expected: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi'
                        }
                    }
                },
                {
                    value: 'ABC',
                    name: 'ABC',
                    expected: {
                        selection: {
                            collectionOfCollections: 'none',
                            collectionOfObjects: 'single',
                            networkObjects: 'multi'
                        }
                    }
                }
            ].forEach(function(test) {
                it('Should initiate selection option for ' + test.name, function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = test.value;

                    //Act
                    region.initSelection();

                    //Assert
                    expect(region.options.showHeader.showTopology.selection).to.be.eql(test.expected.selection);
                    expect(region.options.showHeader.showTopology.selection).to.be.not.equal(test.value);
                });
            });

            [
                {
                    value: {
                        collectionOfCollections: 'none',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi'
                    },
                    name: 'default'
                },
                {
                    value: {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi'
                    },
                    name: 'collectionOfCollections - multi'
                },
                {
                    value: {
                        collectionOfCollections: 'single',
                        collectionOfObjects: 'single',
                        networkObjects: 'multi'
                    },
                    name: 'collectionOfCollections - single'
                },
                {
                    value: {
                        collectionOfCollections: 'multi',
                        collectionOfObjects: 'multi',
                        networkObjects: 'single'
                    },
                    name: 'collections - multi, networkObjects - single'
                }
            ].forEach(function(test) {
                it('Should initiate selection option for ' + test.name, function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection = test.value;

                    //Act
                    region.initSelection();

                    //Assert
                    expect(region.options.showHeader.showTopology.selection).to.be.eql(test.value);
                });
            });

        });

        describe('initCombination()', function() {
            [
                {
                    value: undefined,
                    name: 'undefined',
                    expected: {
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    }
                },
                {
                    value: null,
                    name: 'null',
                    expected: {
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    }
                },
                {
                    value: [],
                    name: '[]',
                    expected: {
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    }
                },
                {
                    value: 'ABC',
                    name: 'ABC',
                    expected: {
                        combination: {
                            collection: false,
                            networkObjects: false
                        }
                    }
                }
            ].forEach(function(test) {
                it('Should initCombination initiate combination option for ' + test.name, function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection.combination = test.value;

                    //Act
                    region.initCombination();

                    //Assert
                    expect(region.options.showHeader.showTopology.selection.combination).to.be.eql(test.expected.combination);
                    expect(region.options.showHeader.showTopology.selection.combination).to.be.not.equal(test.value);
                });
            });

            [
                {
                    value: {
                        collection: false,
                        networkObjects: false
                    },
                    name: 'default'
                },
                {
                    value: {
                        collection: true,
                        networkObjects: false
                    },
                    name: 'collection - true'
                },
                {
                    value: {
                        collection: false,
                        networkObjects: true
                    },
                    name: 'networkObjects - true'
                },
                {
                    value: {
                        collection: true,
                        networkObjects: true
                    },
                    name: 'both - true'
                }
            ].forEach(function(test) {
                it('Should initCombination initiate combination option for ' + test.name, function() {
                    //Assemble
                    region.options.showHeader.showTopology.selection.combination = test.value;

                    //Act
                    region.initCombination();

                    //Assert
                    expect(region.options.showHeader.showTopology.selection.combination).to.be.eql(test.value);
                });
            });
        });

        describe('checkSelectionOptionValue()', function() {
            [
                {
                    name: 'undefined',
                    value: undefined,
                    expected: ''
                },
                {
                    name: 'null',
                    value: null,
                    expected: ''
                },
                {
                    name: 'Wrong',
                    value: 'Wrong',
                    expected: ''
                },
                {
                    name: '12345',
                    value: 123456,
                    expected: ''
                }
            ].forEach(function(test) {
                it('Should initCombination() throw error for ' + test.name, function() {
                    try {
                        //Act
                        var expected = region.checkSelectionOptionValue(test.value);
                        //Assert
                        expect(expected).to.be.eql(test.expected);
                    } catch (e) {
                        expect(e.message).to.be.equal('Invalid selection option, valid options are single, multi or none');
                    }
                });
            });

            [
                {
                    name: 'multi',
                    value: 'multi'
                },
                {
                    name: 'single',
                    value: 'single'
                },
                {
                    name: 'none',
                    value: 'none'
                }
            ].forEach(function(test) {
                it('Should initCombination initiate combination option for ' + test.name, function() {

                    //Act
                    var expected = region.checkSelectionOptionValue(test.value);
                    //Assert
                    expect(expected).to.be.eql(test.value);

                });
            });
        });

        describe('checkCombinationOptionValue()', function() {
            [
                {
                    name: 'undefined',
                    value: undefined,
                    expected: ''
                },
                {
                    name: 'null',
                    value: null,
                    expected: ''
                },
                {
                    name: 'Wrong',
                    value: 'Wrong',
                    expected: ''
                },
                {
                    name: '12345',
                    value: 123456,
                    expected: ''
                }
            ].forEach(function(test) {
                it('Should initCombination() throw error for ' + test.name, function() {
                    try {
                        //Act
                        var expected = region.checkCombinationOptionValue(test.value);
                        //Assert
                        expect(expected).to.be.eql(test.expected);
                    } catch (e) {
                        expect(e.message).to.be.equal('Invalid combination of selections option, valid options are true or false');
                    }
                });
            });

            [
                {
                    name: 'true',
                    value: true
                },
                {
                    name: 'false',
                    value: false
                }
            ].forEach(function(test) {
                it('Should initCombination initiate combination option for ' + test.name, function() {

                    //Act
                    var expected = region.checkCombinationOptionValue(test.value);
                    //Assert
                    expect(expected).to.be.eql(test.value);

                });
            });
        });

        describe('onStart()', function() {
            it('Should start the visualisation', function() {
                //Assemble
                sinon.spy(region.topologyHeader.start);
                sinon.spy(region.topologyTree.start);
                sinon.spy(region.topologyFDN.start);

                region.options = {'multiselect': true, 'showFDN': true, 'showHeader': {showTopology: {showCustomTopology: {}}}};

                var stubContext = sinon.createStubInstance(core.AppContext);
                var eventBusStub = sinon.createStubInstance(core.EventBus);
                stubContext.eventBus = eventBusStub;
                region.options.context = stubContext;
            
                //Act
                region.start();

                //Assert
                expect(region.topologyHeader.start).to.be.calledOnce;
                expect(region.topologyTree.start).to.be.calledOnce;
                expect(region.topologyFDN.start).to.be.calledOnce;
            });
        });

        describe('setBorderedMode()', function() {
            it('Should set bordered mode true', function() {
                //Assemble
                var borders = [];
                sinon.spy(region.view.getTree);
                sinon.spy(region.view.getCollectionTree);

                //Act
                region.setBorderedMode(true);

                borders.push(region.view.getTree().getNative().className);
                borders.push(region.view.getCollectionTree().getNative().className);

                //Assert
                expect(region.view.getTree).to.be.calledOnce;
                expect(region.view.getCollectionTree).to.be.calledOnce;

                expect(borders[0].indexOf('tree_bordered')).to.be.gt(-1);
                expect(borders[1].indexOf('collectionTree_bordered')).to.be.gt(-1);
            });

            it('Should set bordered mode false', function() {
                //Assemble
                var borders = [];
                sinon.spy(region.view.getTree);
                sinon.spy(region.view.getCollectionTree);

                //Act
                region.setBorderedMode(false);

                borders.push(region.view.getTree().getNative().className);
                borders.push(region.view.getCollectionTree().getNative().className);

                //Assert
                expect(region.view.getTree).to.be.calledOnce;
                expect(region.view.getCollectionTree).to.be.calledOnce;

                expect(borders[0].indexOf('tree_bordered')).to.be.equal(-1);
                expect(borders[1].indexOf('collectionTree_bordered')).to.be.equal(-1);
            });
        });

        describe('changeTopologyTree()', function() {
            it('Should switch between topologies', function() {
                //Assemble
                sinon.spy(region.topologyTree.stop);
                sinon.spy(region.topologyTree.start);
                sinon.spy(region.getEventBus().publish);

                region.options = {'multiselect': 'true', 'showFDN': 'true', 'showHeader': 'false'};

                var stubContext = sinon.createStubInstance(core.AppContext);
                var eventBusStub = sinon.createStubInstance(core.EventBus);
                stubContext.eventBus = eventBusStub;
                region.options.context = stubContext;

                var topology = {dropdownValue: {'value': 'networkData'}};

                //Act
                region.changeTopologyTree(topology);

                //Assert
                expect(region.topologyTree.stop).to.be.calledOnce;
                expect(region.topologyTree.start).to.be.calledOnce;
                expect(region.getEventBus().publish.callCount).to.equal(4);
            });

            it('Should show create Collection Flyout', function() {
                //Assemble
                sinon.spy(region.getEventBus().publish);
                sandbox.stub(region,'createCustomTopologyFlyout');

                var topology = { dropdownValue: {'value': 'newCustomTopology'}};

                //Act
                region.changeTopologyTree(topology);

                //Assert
                expect(region.getEventBus().publish.callCount).to.equal(1);
                expect(region.createCustomTopologyFlyout.callCount).to.equal(1);
            });
        });

        describe('createCustomTopologyFlyout()', function() {
            it('Should switch between topologies', function() {
                //Assemble

                var eventBusStub = sandbox.stub({
                    publish: function() {
                    },
                    subscribe: function() {
                    }
                });
                Container.getEventBus = function() {
                    return eventBusStub;
                };
                sandbox.stub(LauncherUtils.prototype,'launchAction');

                //Act
                region.createCustomTopologyFlyout();

                //Assert
                expect(region.launcherUtils.launchAction).to.be.calledOnce;
                expect(region.launcherUtils.launchAction.getCall(0).calledWithMatch({
                    plugin: 'networkexplorer/networkexplorer-create-nested-collection'
                })).to.be.true;
            });
        });

    });
});
