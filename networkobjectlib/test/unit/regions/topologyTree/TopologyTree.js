define([
    'jscore/core',
    'container/api',
    'networkobjectlib/regions/topologyTree/TopologyTree',
    'dataviz/Tree',
    'networkobjectlib/regions/topologyTree/Rest',
    'test/resources/responses/-1',
    'test/resources/responses/-2',
    'test/resources/responses/poidSubtree',
    'test/resources/responses/poidChildren',
    'test/resources/refresh/RefreshMockData',
    'test/resources/refresh/RefreshUtils',
    'widgets/InlineMessage'
], function(core, container, TopologyTree, Tree, Rest, Response1, Response2, ResponsePoidSubtree, ResponsePoidChildren, RefreshMockData, RefreshUtils, InlineMessage) {
    'use strict';

    describe('regions/TopologyTree', function() {
        var sandbox,
            region;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            region = new TopologyTree({
                multiselect: true
            });

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

        describe('onStart()', function() {
            it('Should start the region', function() {
                sandbox.stub(region, 'changeView');

                region.onStart();

                expect(region.changeView.callCount).to.equal(1);
                expect(region.changeView.firstCall.calledWith('tree', 0)).to.equal(true);
            });
        });

        describe('onStop()', function() {
            it('Should call unsubscribe event', function() {
                //Assemble
                sandbox.stub(region, 'changeView');
                sandbox.spy(container.getEventBus(), 'unsubscribe');
                region.onStart();

                var events = {
                    'event:1': '1',
                    'event:2': '2',
                    'event:3': '3'
                };

                var containerEvents = {
                    'container:event:1': '1',
                    'container:event:2': '2'
                };


                region.subscribeEvents = events;
                region.containerSubscribeEvents = containerEvents;
                //Act
                region.onStop();

                //Assert
                expect(container.getEventBus().unsubscribe.callCount).to.equal(2);
                expect(region.getEventBus().unsubscribe.callCount).to.equal(3);

            });
        });

        describe('unSubscribeEvents()', function() {
            it('Should unsubscribe events', function() {
                //Assemble
                sandbox.stub(region, 'changeView');
                sandbox.spy(container.getEventBus(), 'unsubscribe');
                region.onStart();
                var events = {
                    'topologyTree:load': '1',
                    'topologyTree:loader:hide': '2',
                    'topologyTree:loader:show': '3',
                    'topologyTree:refresh': '4',
                    'topologyTree:select': '5',
                    'topologyTree:start': '6'
                };

                var containerEvents = {
                    'topologyTree:sync': '1',
                    'topologyTree:refresh': '2'
                };
                region.subscribeEvents = events;
                region.containerSubscribeEvents = containerEvents;

                //Act
                region.onStop();

                //Assert
                expect(container.getEventBus().unsubscribe.callCount).to.equal(2);
                expect(region.getEventBus().unsubscribe.callCount).to.equal(6);

            });
        });

        describe('load(poid)', function() {
            beforeEach(function() {
                region.onStart();
                region.memory.clearAll();
            });

            it('Should fetch -1 (without nodes) and -2 (with nodes)', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.stub(region, 'goTo');

                // Action
                var load = region.load(null);

                // Assert
                load
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var rootObjectFirst = rootObjects[0];
                        var rootObjectLast = rootObjects[rootObjects.length-1];

                        // should fetch from server (-1/-2)
                        expect(Rest.getRoot.callCount).to.equal(2);

                        // should have added objects to memory
                        expect(rootObjects).to.have.length(1);
                        expect(allOtherNodesObjects).to.have.length(2);

                        // last root object should be all other nodes
                        expect(rootObjectLast.id).to.equal('-2');

                        expect(rootObjectFirst).to.equal(rootObjectLast);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withoutNodes));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
            });

            it('Should fetch -1 (with nodes) and -2 (without nodes) and check no children found', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.stub(region, 'goTo');

                // Action
                var load = region.load(null);

                // Assert
                load
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var rootObjectLast = rootObjects[rootObjects.length-1];

                        // should fetch from server (-1/-2)
                        expect(Rest.getRoot.callCount).to.equal(2);

                        // should have added objects to memory
                        expect(rootObjects).to.have.length(2);

                        // should show No Children Found inside All Other Nodes
                        expect(allOtherNodesObjects).to.have.length(1);

                        // last root object should be all other nodes
                        expect(rootObjectLast.id).to.equal('-2');

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withoutNodes));
            });

            it('Should fetch -1 (with nodes), -2 (with nodes) and poid subtree; and go to POID', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return false; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.spy(Rest, 'getPoidSubtree');
                sandbox.stub(region, 'goTo');

                // Action
                var poid = '281474978447143';
                var load = region.load(poid);

                // Assert
                load
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var rootObjectLast = rootObjects[rootObjects.length-1];

                        // should fetch from server (-1/-2) and poid Subtree
                        expect(Rest.getRoot.callCount).to.equal(2);
                        expect(Rest.getPoidSubtree.callCount).to.equal(1);

                        // should have added objects to memory
                        expect(rootObjects).to.have.length(2);
                        expect(allOtherNodesObjects).to.have.length(2);

                        // last root object should be all other nodes
                        expect(rootObjectLast.id).to.equal('-2');

                        // should scroll and select and expand parents to poid object
                        expect(region.goTo.callCount).to.equal(1);
                        expect(region.goTo.firstCall.calledWith(region.memory.get(poid))).to.equal(true);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
                this.requests[2].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidSubtree[poid]));
            });

            it('Should fetch from memory and select poid', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return false; } };

                // Action
                var poid = '281474978447143';
                var load = region.load(poid);

                load
                    .then(function() {
                        // Stub
                        sandbox.stub(region, 'goTo');
                        sandbox.spy(region.memory, 'has');

                        return region.load(poid);
                    })
                    .then(function() {
                        // Assert
                        expect(region.memory.has.getCall(0).returnValue).to.equal(true);
                        expect(region.goTo.callCount).to.equal(1);
                        expect(region.goTo.firstCall.calledWith(region.memory.get(poid))).to.equal(true);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
                this.requests[2].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidSubtree[poid]));
            });

            it('Should fetch -1 (with nodes), -2 (with nodes) and poid subtree; and fail (500)', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return false; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.spy(Rest, 'getPoidSubtree');
                sandbox.stub(region, 'goTo');
                //sandbox.stub(eventBus, 'publish');

                // Action
                var poid = '281474978447143';
                var load = region.load(poid);

                // Assert
                load
                    .catch(function() {
                        done();
                    });

                this.requests[0].respond(500, {'Content-Type': 'application/json'}, JSON.stringify({}));
                this.requests[1].respond(500, {'Content-Type': 'application/json'}, JSON.stringify({}));
                this.requests[2].respond(500, {'Content-Type': 'application/json'}, JSON.stringify({}));
            });

            it('Should hide the ErrorDashboard if it already exists', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return true; } };
                region.errorDashboard = new InlineMessage({
                    header: 'ROP',
                    description: 'Stars',
                    icon: 'error'
                });

                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.stub(region, 'goTo');

                // Action
                region.load(null)
                    .then(function() {
                        expect(region.hideErrorDashboard).to.be.calledOnce;
                        expect(region.errorDashboard.destroy).to.be.calledOnce;
                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withoutNodes));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
            });
        });

        describe('changeView(view, rootItems)', function() {
            it('Should create TreeView', function() {
                region.onStart();
                var oldVisualisation = region.visualisation;

                // Action
                region.changeView('tree', 3);

                // Assert
                expect(region.visualisation).to.not.equal(oldVisualisation);
            });
        });

        describe('select(object)', function() {
            it('Should select node in tree', function(done) {
                region.onStart();
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                region.load(null)
                    .then(function() {
                        sandbox.stub(region.visualisation, 'unselectAll');
                        sandbox.stub(region.visualisation, 'select');

                        // Action
                        region.select([region.memory.get('281474978045430').id]);

                        // Assert
                        expect(region.visualisation.unselectAll.callCount).to.equal(1);
                        expect(region.visualisation.select.callCount).to.equal(1);
                        expect(region.visualisation.select.calledWith(['281474978045430'])).to.equal(true);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withoutNodes));
            });
        });

        describe('expandParent(object)', function() {
            it('Should expand all parents of the node', function(done) {
                region.onStart();
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                region.load(null)
                    .then(function() {
                        sandbox.stub(region.visualisation, 'expand');

                        // Action
                        region.expandParent(region.memory.get('281474978045437'));

                        // Assert
                        expect(region.visualisation.expand.callCount).to.equal(1);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
            });
        });

        describe('goTo(object)', function() {
            it('Should select, expands and scroll to node', function(done) {
                region.onStart();
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                region.load(null)
                    .then(function() {
                        sandbox.stub(region, 'select');
                        sandbox.stub(region, 'expandParent');
                        sandbox.stub(region.visualisation, 'scrollIntoView');

                        // Action
                        region.goTo(region.memory.get('281474978045437'));

                        // Assert
                        expect(region.select.callCount).to.equal(1);
                        expect(region.expandParent.callCount).to.equal(1);
                        expect(region.visualisation.scrollIntoView.callCount).to.equal(1);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
            });
        });

        describe('refresh', function() {
            beforeEach(function() {
                region.onStart();
                region.memory.clearAll();
            });

            it('Should fetch -1 (without nodes) and -2 (with nodes)', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');

                // Action
                var refresh = region.refresh();

                // Assert
                refresh
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var rootObjectFirst = rootObjects[0];
                        var rootObjectLast = rootObjects[rootObjects.length-1];

                        // should fetch from server (-1/-2)
                        expect(Rest.getRoot.callCount).to.equal(2);

                        // should have added objects to memory
                        expect(rootObjects).to.have.length(1);
                        expect(allOtherNodesObjects).to.have.length(2);

                        // last root object should be all other nodes
                        expect(rootObjectLast.id).to.equal('-2');

                        expect(rootObjectFirst).to.equal(rootObjectLast);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withoutNodes));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
            });

            it('Should fetch -1 (with nodes) and -2 (without nodes) and check no children found', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');

                // Action
                var refresh = region.refresh();

                // Assert
                refresh
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var rootObjectLast = rootObjects[rootObjects.length-1];

                        // should fetch from server (-1/-2)
                        expect(Rest.getRoot.callCount).to.equal(2);

                        // should have added objects to memory
                        expect(rootObjects).to.have.length(2);

                        // should show No Children Found inside All Other Nodes
                        expect(allOtherNodesObjects).to.have.length(1);

                        // last root object should be all other nodes
                        expect(rootObjectLast.id).to.equal('-2');

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withoutNodes));
            });

            it('Should fetch -1 and -2 without any selections or expansions', function(done) {
                region.topologyBrowser = { isRootPoId: function() { return true; } };

                // Stub
                sandbox.spy(Rest, 'getRoot');

                // Action
                var refresh = region.refresh();

                // Assert
                refresh
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var rootObjectLast = rootObjects[rootObjects.length-1];

                        // should fetch from server (-1/-2)
                        expect(Rest.getRoot.callCount).to.equal(2);

                        // should have added objects to memory
                        expect(rootObjects).to.have.length(2);
                        expect(allOtherNodesObjects).to.have.length(2);

                        // last root object should be all other nodes
                        expect(rootObjectLast.id).to.equal('-2');


                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response1.withOneNode));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
            });

            it('Should fetch root data and expansion data for single expansion', function(done) {

                region.topologyBrowser = { isRootPoId: function() { return true; } };

                RefreshUtils.setMemory(region.memory, RefreshMockData.memory[0]);
                var poid = '281474978675975';
                var children = [
                    '281474978667679',
                    '281474978667794',
                    '281474978668105',
                    '281474978668319',
                    '281474978668320'
                ];
                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.spy(Rest, 'getPoid');
                sandbox.stub(region, 'goTo');
                sandbox.stub(region.visualisation, 'getExpansions', function() {
                    return RefreshMockData.expansions[0];
                });

                // Action
                var refresh = region.refresh();

                // Assert
                refresh
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var actualExpansions = region.visualisation.getExpansions();
                        var childrenOfExpandedParent = region.memory.getChildren(poid);
                        var expansions = RefreshMockData.expansions[0];


                        // should fetch from server
                        expect(Rest.getRoot.callCount).to.equal(2);
                        expect(Rest.getPoid.callCount).to.equal(3);

                        // should have root data
                        expect(rootObjects).to.have.length(3);
                        expect(allOtherNodesObjects).to.have.length(2);

                        // should be an expansion
                        expect(actualExpansions.length).to.equal(1);
                        expect(actualExpansions[0].id).to.equal(expansions[0].id);

                        // expanded parent's children should exist
                        expect(childrenOfExpandedParent.length).to.equal(5);
                        expect(childrenOfExpandedParent[0].id).to.equal(children[0]);
                        expect(childrenOfExpandedParent[1].id).to.equal(children[1]);
                        expect(childrenOfExpandedParent[2].id).to.equal(children[2]);
                        expect(childrenOfExpandedParent[3].id).to.equal(children[3]);
                        expect(childrenOfExpandedParent[4].id).to.equal(children[4]);

                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren['-1']));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
                this.requests[2].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[poid]));

            });

            it('Should fetch root data and expansion data for multiple expansion', function(done) {

                region.topologyBrowser = { isRootPoId: function() { return true; } };

                RefreshUtils.setMemory(region.memory, RefreshMockData.memory[1]);
                var poids = ['281474978675975', '281474978667679'];
                var children1 = [
                    '281474978667679',
                    '281474978667794',
                    '281474978668105',
                    '281474978668319',
                    '281474978668320'
                ];
                var children2 = [
                    '281474978753104'
                ];
                // Stub
                sandbox.spy(Rest, 'getRoot');
                sandbox.spy(Rest, 'getPoid');
                sandbox.stub(region.visualisation, 'getExpansions', function() {
                    return RefreshMockData.expansions[1];
                });

                // Action
                var refresh = region.refresh();

                // Assert
                refresh
                    .then(function() {
                        var rootObjects = region.memory.getChildren(null);
                        var allOtherNodesObjects = region.memory.getChildren('-2');
                        var actualExpansions = region.visualisation.getExpansions();
                        var childrenOfExpandedParent1 = region.memory.getChildren(poids[0]);
                        var childrenOfExpandedParent2 = region.memory.getChildren(poids[1]);
                        var expansions = RefreshMockData.expansions[0];


                        // should fetch from server
                        expect(Rest.getRoot.callCount).to.equal(2);
                        expect(Rest.getPoid.callCount).to.equal(5);

                        // should have root data
                        expect(rootObjects).to.have.length(3);
                        expect(allOtherNodesObjects).to.have.length(2);

                        // should be an expansion
                        expect(actualExpansions.length).to.equal(2);
                        expect(actualExpansions[0].id).to.equal(expansions[0].id);

                        // expanded parent's children should exist
                        expect(childrenOfExpandedParent1.length).to.equal(5);
                        expect(childrenOfExpandedParent1[0].id).to.equal(children1[0]);
                        expect(childrenOfExpandedParent1[1].id).to.equal(children1[1]);
                        expect(childrenOfExpandedParent1[2].id).to.equal(children1[2]);
                        expect(childrenOfExpandedParent1[3].id).to.equal(children1[3]);
                        expect(childrenOfExpandedParent1[4].id).to.equal(children1[4]);

                        // expanded parent's children should exist
                        expect(childrenOfExpandedParent2.length).to.equal(1);
                        expect(childrenOfExpandedParent2[0].id).to.equal(children2[0]);
                        done();
                    })
                    .catch(function(error) {
                        done(error);
                    });
                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren['-1']));
                this.requests[1].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(Response2.withTwoNodes));
                this.requests[2].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[poids[0]]));
                this.requests[3].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[poids[1]]));
                this.requests[4].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[poids[1]]));

            });
        });

        describe('remove', function() {
            beforeEach(function() {
                region.visualisation = {
                    getExpansions: function() { return []; },
                    getSelectedIds: function() { return []; },
                    getVirtualScrollBar: function() {
                        return {
                            getPosition: function() { return 0; }
                        };
                    },
                    destroy: function() {}
                };
                region.memory.clearAll();
            });

            [
                {
                    description: 'Should remove item from memory and destroy tree',
                    memoryIndex: 1,
                    removeItem: '281474978667679',
                    parentOfRemoveItem: '281474978675975',
                    expected: {
                        children: 3,
                        offsets: {
                            '281474978667794': 0,
                            '281474978668105': 1,
                            '281474978668319': 2
                        }
                    }
                },
                {
                    description: 'Should draw "no object found" after remove item from one child parent',
                    memoryIndex: 3,
                    removeItem: '1001',
                    parentOfRemoveItem: '1000',
                    noObject: true,
                    expected: {
                        children: 1,
                        offsets: {
                            '-91000': 0
                        }
                    }
                },
            ].forEach(function(test) {
                it(test.description, function() {
                    RefreshUtils.setMemory(region.memory, RefreshMockData.memory[test.memoryIndex]);

                    // Action
                    region.remove(test.removeItem);

                    // Assert
                    var childrenAfterRemove = region.memory.getChildren(test.parentOfRemoveItem);
                    expect(childrenAfterRemove.length).to.equal(test.expected.children);
                    expect(region.memory.get(test.removeItem)).to.be.undefined;
                    childrenAfterRemove.forEach(function(child) {
                        expect(child.offset).to.equal(test.expected.offsets[child.id]);
                    });

                    if (test.noObject) {
                        expect(childrenAfterRemove[0].id).to.equal('-91000');
                        expect(childrenAfterRemove[0].label).to.equal('No children found');
                    }
                });
            });
        });

        describe('getChildrenCount', function() {
            beforeEach(function() {
                region.memory.clearAll();
            });

            it('Should get children count, where all nodes in the memory', function() {
                var parent = '281474978675975';

                RefreshUtils.setMemory(region.memory, RefreshMockData.memory[1]);

                //Action
                region.getChildrenCount(parent, function(noOfChildren) {
                    console.log('noOfChildren', noOfChildren);
                    expect(noOfChildren).to.equal(4);
                }, function() {
                    console.log('Error');
                });
            });

            it('Should get children count when the parent is in memory', function(done) {
                var parent = '2000';

                RefreshUtils.setMemory(region.memory, RefreshMockData.memory[4]);

                region.getChildrenCount(parent, function(noOfChildren) {
                    expect(noOfChildren).to.equal(1);
                    done();
                }, done);

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[parent]));
            });

            it('should create a no children object when the parent has no children', function(done) {
                var parent = '2001';

                var expectedObject = {
                 children: 0,
                 id: '-92001',
                 label: 'No children found',
                 fdn: undefined,
                 managementState: undefined,
                 neType: undefined,
                 offset: 0,
                 parent: '2001',
                 radioAccessTechnology: undefined,
                 syncStatus: undefined,
                 type: null,
                 totalNodeCount: undefined
                };

                region.onStart();

                RefreshUtils.setMemory(region.memory, RefreshMockData.expansions[3]);

                region.expandParent(region.memory.get('2000'), true);

                sandbox.spy(region.visualisation, 'collapse');
                sandbox.spy(region.visualisation, 'expand');
                sandbox.spy(region.memory, 'addObject');

                region.getChildrenCount(parent, function() {});

                setTimeout(function() {
                 expect(region.memory.addObject.callCount).to.equal(1);
                 expect(region.memory.addObject.calledWith('-92001', expectedObject, parent)).to.equal(true);
                 expect(region.visualisation.collapse.callCount).to.equal(1);
                 expect(region.visualisation.expand.callCount).to.equal(1);
                 done();
                }, 150);

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[parent]));
            });

            it('should throw an error when the parent is not expanded', function() {
                var parent = '2001';

                region.onStart();

                RefreshUtils.setMemory(region.memory, RefreshMockData.expansions[3]);

                region.getChildrenCount(parent, function() {}, function(err) {
                    expect(err).not.to.be.undefined;
                });

                expect(region.getChildrenCount).to.throw(Error);

                this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(ResponsePoidChildren[parent]));
            });
        });

    });
});
