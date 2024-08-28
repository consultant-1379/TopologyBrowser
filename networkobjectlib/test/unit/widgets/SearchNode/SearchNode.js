define([
    'jscore/core',
    'networkobjectlib/widgets/SearchNode/SearchNode',
    'networkobjectlib/widgets/SearchNode/Rest',
    'jscore/ext/net'
], function(core, SearchNode, Rest, net) {
    'use strict';
    describe('widgets/SearchNode', function() {
        var sandbox, searchNodeUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            var stubContext = sinon.createStubInstance(core.AppContext);
            var eventBusStub = sinon.createStubInstance(core.EventBus);
            stubContext.eventBus = eventBusStub;
            searchNodeUnderTest = new SearchNode({
                context: stubContext
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onSearchInput', function() {
            it('should show clear search input icon', function() {
                // Assemble
                searchNodeUnderTest.view.getFindInput = function() {
                    return {
                        setValue: function() {
                        },
                        getValue: function() {
                            return 'NR';
                        },
                        removeModifier: function() {
                        }
                    };
                };
                var seartchstr = 'NR';
                console.log('Search' + seartchstr);
                sandbox.spy(searchNodeUnderTest.view, 'showClearSearchIconButton');
                sandbox.spy(searchNodeUnderTest.view, 'getFindInput');
                // Act
                searchNodeUnderTest.onSearchInput();
                // Assert
                expect(searchNodeUnderTest.view.showClearSearchIconButton.calledWith(seartchstr)).to.be.true;
            });

            it('should hide clear search icon', function() {
                // Assemble
                sandbox.spy(searchNodeUnderTest.view, 'getFindInput');
                sandbox.spy(searchNodeUnderTest.view, 'hideClearSearchIconButton');
                // Act
                searchNodeUnderTest.onSearchInputClear();
                // Assert
                expect(searchNodeUnderTest.view.getFindInput.callCount).to.eql(2);
                expect(searchNodeUnderTest.view.hideClearSearchIconButton.calledOnce).to.be.true;
            });

            it('should hide search input warning and enable search next and prev buttons when input is valid', function() {
                // Assemble
                searchNodeUnderTest.view.getFindInput = function() {
                    return {
                        setValue: function() {
                        },
                        getValue: function() {
                            return 'NR';
                        },
                        removeModifier: function() {
                        }
                    };
                };
                sandbox.spy(searchNodeUnderTest.view, 'enableSearchDownButton');
                sandbox.spy(searchNodeUnderTest.view, 'enableSearchUpButton');
                sandbox.spy(searchNodeUnderTest.view, 'clearInputErrorMessage');
                sandbox.spy(searchNodeUnderTest.view, 'getFindInput');
                // Act
                searchNodeUnderTest.onSearchInput();
                // Assert
                expect(searchNodeUnderTest.view.clearInputErrorMessage.callCount).to.eql(1);
                expect(searchNodeUnderTest.view.enableSearchDownButton.callCount).to.eql(1);
                expect(searchNodeUnderTest.view.enableSearchUpButton.callCount).to.eql(1);
            });


            it('should hide search input warning and disable search next and prev buttons when input is empty', function() {
                // Assemble
                searchNodeUnderTest.view.getFindInput = function() {
                    return {
                        setValue: function() {
                        },
                        getValue: function() {
                            return '';
                        },
                        removeModifier: function() {
                        }
                    };
                };
                sandbox.spy(searchNodeUnderTest.view, 'disableSearchDownButton');
                sandbox.spy(searchNodeUnderTest.view, 'disableSearchUpButton');
                sandbox.spy(searchNodeUnderTest.view, 'clearInputErrorMessage');
                sandbox.spy(searchNodeUnderTest.view, 'getFindInput');
                // Act
                searchNodeUnderTest.onSearchInput();
                // Assert
                expect(searchNodeUnderTest.view.clearInputErrorMessage.callCount).to.eql(1);
                expect(searchNodeUnderTest.view.disableSearchDownButton.callCount).to.eql(1);
                expect(searchNodeUnderTest.view.disableSearchUpButton.callCount).to.eql(1);
            });

            it('should show search input warning and disable search next and prev buttons when input is invalid', function() {
                // Assemble
                searchNodeUnderTest.view.getFindInput = function() {
                    return {
                        setValue: function() {
                        },
                        getValue: function() {
                            return 'NR@';
                        },
                        setModifier: function() {
                        }
                    };
                };
                sandbox.spy(searchNodeUnderTest.view, 'showInputErrorMessage');
                sandbox.spy(searchNodeUnderTest.view, 'disableSearchUpButton');
                sandbox.spy(searchNodeUnderTest.view, 'disableSearchDownButton');
                sandbox.spy(searchNodeUnderTest.view, 'getFindInput');
                // Act
                searchNodeUnderTest.onSearchInput();
                // Assert
                expect(searchNodeUnderTest.view.showInputErrorMessage.calledWith('Error at character 3')).to.be.true;
                expect(searchNodeUnderTest.view.showInputErrorMessage.callCount).to.eql(1);
                expect(searchNodeUnderTest.view.disableSearchDownButton.callCount).to.eql(1);
                expect(searchNodeUnderTest.view.disableSearchUpButton.callCount).to.eql(1);
            });
        });

        describe('updateSearchNodeWidget()', function() {
            [{
                topologyId: 'networkData',
                scenario: 'should not update the widget, if both selectedTopologyId and search node widget id are networkData',
                onSearchInputClearCallCount: 0
            },{
                topologyId: 4000,
                scenario: 'should update the widget, if both selectedTopologyId and search node widget id are not networkData',
                onSearchInputClearCallCount: 1
            }].forEach(function(data) {
                it(data.scenario, function() {
                    searchNodeUnderTest.options.selectedTopologyId = data.topologyId;
                    sandbox.spy(searchNodeUnderTest, 'onSearchInputClear');
                    searchNodeUnderTest.updateSearchNodeWidget(data.topologyId);
                    expect(searchNodeUnderTest.onSearchInputClear.callCount).to.equal(data.onSearchInputClearCallCount);
                    expect(searchNodeUnderTest.options.selectedTopologyId).to.equal(data.topologyId);
                });
            });
        });

        describe('nextButtonClickHandler()', function() {
            [
                {
                    topology: 1234,
                    searchFilterValue: 'NR01',
                    previousSearchValue: 'NR01',
                    getPOBySearchStringCustomTopologyExpectedCallCount: 0,
                    getPOBySearchStringNetworkDataExpectedCallCount: 0,
                    handleNextClickActionExpectedCallCount: 1
                },
                {
                    topology: 1234,
                    searchFilterValue: 'NR03',
                    previousSearchValue: 'NR01',
                    getPOBySearchStringCustomTopologyExpectedCallCount: 1,
                    getPOBySearchStringNetworkDataExpectedCallCount: 0,
                    handleNextClickActionExpectedCallCount: 0
                },
                {
                    topology: 'networkData',
                    searchFilterValue: 'NR02',
                    previousSearchValue: 'NR01',
                    getPOBySearchStringCustomTopologyExpectedCallCount: 0,
                    getPOBySearchStringNetworkDataExpectedCallCount: 1,
                    handleNextClickActionExpectedCallCount: 0
                }
            ].forEach(function(testData) {
                it('should handle the flow correctly when current(' + testData.searchFilterValue + ') and previous(' + testData.previousSearchValue + ') search values are different or the same', function() {
                    searchNodeUnderTest.options.selectedTopologyId = testData.topology;
                    searchNodeUnderTest.searchFilterValue = testData.searchFilterValue;
                    searchNodeUnderTest.previousSearchValue = testData.previousSearchValue;
                    var getPOBySearchStringCustomTopologySpy = sandbox.stub(searchNodeUnderTest, 'getPOBySearchStringCustomTopology').returns(Promise.resolve());
                    var getPOBySearchStringNetworkDataSpy = sandbox.stub(searchNodeUnderTest, 'getPOBySearchStringNetworkData').returns(Promise.resolve());
                    var handleNextClickActionSpy = sandbox.spy(searchNodeUnderTest, 'handleNextClickAction');
                    searchNodeUnderTest.nextButtonClickHandler('next');
                    expect(getPOBySearchStringCustomTopologySpy.callCount).to.eql(testData.getPOBySearchStringCustomTopologyExpectedCallCount);
                    expect(getPOBySearchStringNetworkDataSpy.callCount).to.eql(testData.getPOBySearchStringNetworkDataExpectedCallCount);
                    expect(handleNextClickActionSpy.callCount).to.eql(testData.handleNextClickActionExpectedCallCount);
                });
            });
        });

        describe('handleNextClickAction()', function() {

            var mockedResponseData = [
                {
                    poId: 1000,
                    nodeName: 'NR01gNodeBRadio00001',
                    path: [800074978623583, 900000000000001, 900000000000002, 900000000000003]
                },
                {
                    poId: 1001,
                    nodeName: 'NR01gNodeBRadio00002',
                    path: [800074978623583, 900000000000004, 900000000000005, 900000000000006]
                },
                {
                    poId: 1002,
                    nodeName: 'NR01gNodeBRadio00003',
                    path: [800074978623583, 900000000000007]
                }
            ];

            [
                {
                    direction: 'next',
                    isNewSearch: true,
                    expectedTopologyState: {
                        expansion: {},
                        selection: {},
                        lastSelectionId: '900000000000003:1000',
                        selectionIds: [
                            '900000000000003:1000'
                        ],
                        expansionIds: [
                            'null:800074978623583',
                            '800074978623583:900000000000001',
                            '900000000000001:900000000000002',
                            '900000000000002:900000000000003'
                        ],
                        isHardRefresh: true
                    }
                },
                {
                    direction: 'next',
                    isNewSearch: false,
                    expectedTopologyState: {
                        expansion: {},
                        selection: {},
                        lastSelectionId: '900000000000006:1001',
                        selectionIds: [
                            '900000000000006:1001'
                        ],
                        expansionIds: [
                            'null:800074978623583',
                            '800074978623583:900000000000004',
                            '900000000000004:900000000000005',
                            '900000000000005:900000000000006'
                        ],
                        isHardRefresh: true
                    }
                },
                {
                    direction: 'prev',
                    isNewSearch: false,
                    expectedTopologyState: {
                        expansion: {},
                        selection: {},
                        lastSelectionId: '900000000000007:1002',
                        selectionIds: [
                            '900000000000007:1002'
                        ],
                        expansionIds: [
                            'null:800074978623583',
                            '800074978623583:900000000000007'
                        ],
                        isHardRefresh: true
                    }
                }
            ].forEach(function(testData) {
                it('should prepare the data before refreshing the tree when isNewSearch is ' + testData.isNewSearch + ' and ' + testData.direction + ' button is clicked', function() {
                    searchNodeUnderTest.selectedTopologyId = 800074978623583;
                    searchNodeUnderTest.responseData = mockedResponseData;

                    searchNodeUnderTest.handleNextClickAction(testData.direction, testData.isNewSearch);

                    expect(searchNodeUnderTest.options.context.eventBus.publish.callCount).to.eql(1);
                    expect(searchNodeUnderTest.options.context.eventBus.publish.calledWith('topologyTree:refresh', testData.expectedTopologyState)).to.be.true;
                });
            });
            it('should call topologyHeader:topologyDropdown:change', function() {
                searchNodeUnderTest.options.selectedTopologyId = 'networkData';
                searchNodeUnderTest.responseData = mockedResponseData;

                searchNodeUnderTest.handleNextClickAction('next', true);
                expect(searchNodeUnderTest.options.context.eventBus.publish.callCount).to.eql(1);
                expect(searchNodeUnderTest.options.context.eventBus.publish.calledWith('topologyHeader:topologyDropdown:change')).to.be.true;
            });
        });

        describe('searchNodeByQueryStringCustomTopology', function() {
            it('should display data when data returned from rest query for Transport Topology', function(done) {
                // Assemble
                sandbox.spy(searchNodeUnderTest, 'handleNextClickAction');
                var restData = [
                    {
                        'poId': 281475075346449,
                        'nodeName': 'RNC01MSRBS-V2259',
                        'path': [800074978623583, 900000000000001, 900000000000002,900000000000003]
                    },
                    {
                        'poId': 281475029105738,
                        'nodeName': 'ieatnetsimv6035-12_M01',
                        'path': [800074978623583, 900000000000004, 900000000000005,900000000000006]
                    },
                    {
                        'poId': '281475029105735',
                        'nodeName': 'ieatnetsimv6035-12_RNC01RBS03',
                        'path': [800074978623583, 900000000000007]
                    }
                ];

                sandbox.stub(Rest, 'getPOByQueryStringCustomTopology').returns(Promise.resolve(restData));

                searchNodeUnderTest.getPOBySearchStringCustomTopology('NR', 'prev')
                    .then(function() {
                        expect(Rest.getPOByQueryStringCustomTopology.calledOnce).to.be.true;
                        expect(searchNodeUnderTest.handleNextClickAction.calledOnce).to.be.true;
                        done();
                    });
            });

            it('should show error message when no result from rest query', function(done) {
                // Assemble
                sandbox.spy(searchNodeUnderTest, 'showNodeEmpty');
                sandbox.spy(searchNodeUnderTest.view, 'showInputErrorMessage');
                sandbox.spy(searchNodeUnderTest.view, 'hideFindCount');
                sandbox.stub(Rest, 'getPOByQueryStringCustomTopology').returns(Promise.resolve([]));

                //Action
                searchNodeUnderTest.getPOBySearchStringCustomTopology('NR', 'prev')
                    .then(function() {
                        expect(searchNodeUnderTest.showNodeEmpty.calledOnce).to.be.true;
                        expect(searchNodeUnderTest.view.showInputErrorMessage.calledWith('Nodes not found')).to.be.true;
                        expect(searchNodeUnderTest.view.showInputErrorMessage.calledOnce).to.be.true;
                        expect(searchNodeUnderTest.view.hideFindCount.calledOnce).to.be.true;
                        done();
                    });
            });

            it('should show error dialog when getPOBySearchStringCustomTopology throws an error', function(done) {
                // Assemble
                searchNodeUnderTest.options.selectedTopologyId = 123;
                sandbox.stub(net, 'ajax').yieldsTo('error');

                //Action
                searchNodeUnderTest.getPOBySearchStringCustomTopology('NR', 'prev')
                    .then(function() {
                        expect(net.ajax).to.throw(Error);
                        done();
                    });
            });
        });

        describe('searchNodeByQueryStrNetworkData', function() {
            it('should display data when data returned from rest query for Network Data', function(done) {
                // Assemble
                sandbox.spy(searchNodeUnderTest, 'handleNextClickAction');
                var restData = [{poId: '16001'}];
                sandbox.stub(Rest, 'getPOByQueryStringNetworkData').returns(Promise.resolve(restData));

                searchNodeUnderTest.getPOBySearchStringNetworkData('NR', 'prev')
                    .then(function() {
                        expect(Rest.getPOByQueryStringNetworkData.calledOnce).to.be.true;
                        expect(searchNodeUnderTest.handleNextClickAction.calledOnce).to.be.true;
                        done();
                    });
            });

            it('should show error message when no result from rest query for Network Data', function(done) {
                // Assemble
                sandbox.spy(searchNodeUnderTest, 'showNodeEmpty');
                sandbox.spy(searchNodeUnderTest.view, 'showInputErrorMessage');
                sandbox.spy(searchNodeUnderTest.view, 'hideFindCount');
                sandbox.stub(Rest, 'getPOByQueryStringNetworkData').returns(Promise.resolve([]));

                //Action
                searchNodeUnderTest.getPOBySearchStringNetworkData('NR', 'next')
                    .then(function() {
                        expect(searchNodeUnderTest.showNodeEmpty.calledOnce).to.be.true;
                        expect(searchNodeUnderTest.view.showInputErrorMessage.calledWith('Nodes not found')).to.be.true;
                        expect(searchNodeUnderTest.view.showInputErrorMessage.calledOnce).to.be.true;
                        expect(searchNodeUnderTest.view.hideFindCount.calledOnce).to.be.true;
                        done();
                    });
            });

            it('should show error dialog when getPOByQueryStringNetworkData throws an error', function(done) {
                // Assemble
                sandbox.stub(net, 'ajax').yieldsTo('error');

                //Action
                searchNodeUnderTest.getPOBySearchStringNetworkData('NR', 'next')
                    .then(function() {
                        expect(net.ajax).to.throw(Error);
                        done();
                    });
            });
        });
    });
});
