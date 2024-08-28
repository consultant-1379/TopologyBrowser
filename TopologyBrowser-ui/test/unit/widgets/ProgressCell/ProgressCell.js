define([
    'jscore/core',
    'topologybrowser/widgets/ProgressCell/ProgressCell',
    'container/api',
    'topologybrowser/widgets/ProgressCell/ProgressCellView',
    'topologybrowser/utils/Utils',
    'topologybrowser/widgets/Supervision/Rest'
], function(core, ProgressCell, container, view, utils, SupervisionRest) {
    describe('ProgressCell', function() {
        'use strict';
        var sandbox, progressCellWidget, mockContext, eventBusStub;

        var progressObject = [
            {
                'message': 'In progress, 75%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 75,
                'STATUS': 'IN PROGRESS',
                'expectedColor': 'paleBlue',
                'InventorySupervision': true
            }, 
            {
                'message': 'Success, 100%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 100,
                'STATUS': 'SUCCESS',
                'expectedColor': 'green',
                'InventorySupervision': false
            }, 
            {
                'message': 'Failed, 100%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 100,
                'STATUS': 'FAILED',
                'expectedColor': 'red',
                'InventorySupervision': true
            },
            {
                'message': 'Fail, 0%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 0,
                'STATUS': 'FAIL',
                'expectedColor': 'red',
                'InventorySupervision': false
            }, 
            {
                'message': 'Interrupted, 0%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 0,
                'STATUS': 'INTERRUPTED',
                'expectedColor': 'red',
                'InventorySupervision': true
            },
            {
                'message': 'Canceled, 0%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 0,
                'STATUS': 'CANCELED',
                'expectedColor': 'orange',
                'InventorySupervision': false
            },
            {
                'message': 'Canceled, 0%',
                'NodeName': 'CORE23MLTN002',
                'PROGRESS': 0,
                'STATUS': 'somethingElse',
                'expectedColor': 'paleBlue',
                'InventorySupervision': false
            }
        ];

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            eventBusStub = {
                subscribe: sandbox.spy(),
                publish: sandbox.spy()
            };
            mockContext = new core.AppContext({title: 'test'});
            mockContext.eventBus = eventBusStub;
            progressCellWidget = new ProgressCell({
                context: mockContext,
                table: {
                    locateButton: true
                }
            });

            view.getLabel = function() {
                return {
                    setAttribute: function() {}
                };
            };
            view.getNotification = function() {
                return {
                    setAttribute: function() {}
                };
            };
            view.getButton = function() {
                return {
                    setAttribute: function() {}
                };
            };
            view.getElement = function() {
                return {
                    setAttribute: function() {}
                };
            };

            progressCellWidget.view = view;
        });

        afterEach(function() {
            sandbox.restore();
        });

        it('Should only create locate button when the locateButton flag is set to false', function() {
            // Run
            var progressCellTmp = new ProgressCell({
                context: mockContext,
                table: {
                    locateButton: false
                }
            });

            // Assert
            expect(progressCellTmp.locateButton).to.be.undefined;
        });

        it('Should only create locate button when the locateButton flag is set to true', function() {
            // Run
            var progressCellTmp = new ProgressCell({
                context: mockContext,
                table: {
                    locateButton: true
                }
            });

            // Assert
            expect(progressCellTmp.locateButton).to.be.defined;
        });

        describe('onCellReady()', function() {
            progressObject.forEach(function(object) {
                it('Should init the widget for value: ' + object.message, function() {
                    // Setup
                    progressCellWidget.getRow = function() {
                        return {
                            getData: sandbox.stub().returns(object)
                        };
                    };

                    // Run
                    progressCellWidget.onCellReady();

                    // Assert
                    expect(progressCellWidget.supervisionType).to.be.defined;
                    expect(progressCellWidget.dateTime).to.be.defined;
                    expect(progressCellWidget.NodeName).to.be.defined;
                    expect(progressCellWidget.viewButton).to.be.defined;
                    expect(progressCellWidget.infoNotification).to.be.defined;
                    expect(progressCellWidget.linksTable).to.be.defined;
                    expect(progressCellWidget.progressBar).to.be.defined;
                });
            });

            [{
                topology: 'Transport Topology'
            }, {
                topology: 'Network Data'
            }].forEach(function(testData) {
                it('should show the Locate Node button if the selected topology is ' + testData.topology, function() {
                    progressCellWidget.getRow = function() {
                        return {
                            getData: sandbox.stub().returns({})
                        };
                    };
                    progressCellWidget.options.table.topologyName = testData.topology;
                    sandbox.stub(container, 'getEventBus').returns(eventBusStub);

                    progressCellWidget.onCellReady();

                    expect(progressCellWidget.locateButton).to.not.eql(undefined);
                    expect(progressCellWidget.locateButton.options.caption).to.eql('Locate Node');
                });
            });
        });

        describe('locateNode()', function() {
            it('Should publish the events for locating node in transport topology', function() {
                // Setup
                progressCellWidget.options.table.topologyValue = 'transportTopology';
                progressCellWidget.options.table.topologyName = 'Transport Topology';
                progressCellWidget.progressObject = {
                    eventbus: eventBusStub,
                    NodeName: 'NR01gNodeBRadio00001'
                };
                sandbox.stub(container, 'getEventBus').returns(eventBusStub);
                sandbox.stub(SupervisionRest, 'getPOByQueryStringCustomTopology').returns(Promise.resolve([{
                    nodeName: 'NR01gNodeBRadio00001',
                    path: [4000, 4001],
                    poId: 63002
                }]));

                // Run
                progressCellWidget.locateNode();

                setTimeout(function() {
                    // Assert
                    expect(eventBusStub.publish.callCount).to.equal(2);
                    expect(eventBusStub.publish.getCall(0).args).to.deep.equal(['flyout:hide']);
                    expect(eventBusStub.publish.getCall(1).args).to.deep.equal(['topologyTree:refresh', {
                        lastSelectionId: '4001:63002',
                        selectionIds: [
                            '4001:63002'
                        ],
                        expansionIds: [
                            'null:4000',
                            '4000:4001'
                        ],
                        isHardRefresh: true
                    }]);
                });
            });

            [{
                scenario: 'should show a dialog if the node cannot be located in Transport Topology',
                response: Promise.resolve([])
            }, {
                scenario: 'should show an error dialog if the service throws an error',
                response: Promise.reject({})
            }].forEach(function(testData) {
                it(testData.scenario, function() {
                    // Setup
                    progressCellWidget.options.table.topologyValue = 'transportTopology';
                    progressCellWidget.options.table.topologyName = 'Transport Topology';
                    progressCellWidget.progressObject = {
                        eventbus: eventBusStub,
                        NodeName: 'NR01gNodeBRadio00001'
                    };
                    sandbox.stub(container, 'getEventBus').returns(eventBusStub);
                    sandbox.stub(SupervisionRest, 'getPOByQueryStringCustomTopology').returns(testData.response);
                    sandbox.spy(utils, 'showDialog');

                    // Run
                    progressCellWidget.locateNode();

                    setTimeout(function() {
                        // Assert
                        expect(eventBusStub.publish.callCount).to.equal(1);
                        expect(eventBusStub.publish.getCall(0).args).to.deep.equal(['flyout:hide']);
                        expect(utils.showDialog.callCount).to.eql(1);
                    });
                });
            });

            it('Should publish the events for locating node in network data topology', function() {
                // Setup
                sandbox.stub(container, 'getEventBus').returns(eventBusStub);
                progressCellWidget.options.table.topologyName = 'networkData';
                progressCellWidget.progressObject = {
                    eventbus: eventBusStub,
                    managedElementPoId: '1'
                };

                // Run
                progressCellWidget.locateNode();

                // Assert
                expect(eventBusStub.publish.callCount).to.equal(2);
                expect(eventBusStub.publish.getCall(0).args).to.deep.equal(['flyout:hide']);
                expect(eventBusStub.publish.getCall(1).args).to.deep.equal(['topologyHeader:topologyDropdown:change', {
                    select: progressCellWidget.options.table.topologyName,
                    poid: progressCellWidget.progressObject.managedElementPoId
                }]);
            });

            it('Should show no node found error dialog for locating node in network data', function() {
                // Setup
                var showDialogSpy = sandbox.spy(utils, 'showDialog');
                sandbox.stub(container, 'getEventBus').returns(eventBusStub);
                progressCellWidget.options.table.topologyName = 'networkData';
                progressCellWidget.progressObject = {
                    eventbus: eventBusStub,
                    managedElementPoId: undefined
                };

                // Run
                progressCellWidget.locateNode();

                // Assert
                expect(eventBusStub.publish.callCount).to.equal(1);
                expect(eventBusStub.publish.getCall(0).args).to.deep.equal(['flyout:hide']);
                expect(showDialogSpy.callCount).to.equal(1);

            });
        });

        describe('viewStatus()', function() {
            it('Should create a modalDialog', function() {
                // Setup
                progressCellWidget.progressObject=progressObject[0];

                // Run
                progressCellWidget.viewStatus();
                
                // Assert
                expect(progressCellWidget.modalDialog).to.be.defined;
            });
        });

        describe('setValue()', function() {
            progressObject.forEach(function(object) {
                it('Should set the correct value for value: ' + object.message, function() {
                    // Setup
                    progressCellWidget.progressObject=object;
                    progressCellWidget.progressBar = {
                        setValue: sandbox.spy(),
                        setLabel: sandbox.spy(),
                        setColor: sandbox.spy()
                    };

                    // Run
                    progressCellWidget.setValue();

                    // Assert
                    expect(progressCellWidget.progressBar.setColor.calledWith(object.expectedColor)).to.be.true;
                });
            });
        });
    });
});
