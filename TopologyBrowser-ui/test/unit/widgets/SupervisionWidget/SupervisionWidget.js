define([
    'jscore/core',
    'topologybrowser/widgets/Supervision/SupervisionWidget',
    'topologybrowser/widgets/Supervision/SupervisionWidgetView',
    'tablelib/Table',
    'topologybrowser/widgets/Supervision/Rest'
], function(core, Supervision, View, Table, Rest) {
    'use strict';

    describe('SupervisionWidget', function() {
        var sandbox, supervisionWdiget, mockData, eventBusStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            eventBusStub = sinon.createStubInstance(core.EventBus);
            supervisionWdiget = new Supervision({
                eventbus: eventBusStub
            });
            supervisionWdiget.view = sinon.createStubInstance(View);
            supervisionWdiget.view.getElement = sandbox.stub().returns({
                find: sandbox.stub().returns(new core.Element('div'))
            });
            supervisionWdiget.view.getInfoValue = sandbox.stub().returns(new core.Element('div'));
            supervisionWdiget.view.getProgress = sandbox.stub().returns(new core.Element('div'));

            mockData = [
                [{
                    'NodeName': 'CORE23MLTN002',
                    'InventorySupervision': true,
                    'PROGRESS': 75,
                    'ConfigurationManagementSupervision': true,
                    'PerformanceSupervision': true,
                    'FaultManagementSupervision': false,
                    'ACTION': 'ENABLE',
                    'POID': '1234',
                    'STATUS': 'SUCCESS',
                    'START_TIME': 160002389,
                    'CURRENT_TIME': 160002389,
                    'ERROR': 'This node is deleted',
                    'eventbus': eventBusStub
                }],
                [{
                    'NodeName': 'CORE23MLTN002',
                    'InventorySupervision': true,
                    'PROGRESS': 100,
                    'ConfigurationManagementSupervision': true,
                    'PerformanceSupervision': true,
                    'FaultManagementSupervision': false,
                    'ACTION': 'DISABLE',
                    'POID': '1234',
                    'STATUS': 'ABCD',
                    'START_TIME': 160002389,
                    'CURRENT_TIME': 160002389,
                    'eventbus': eventBusStub
                }],
                [{
                    'NodeName': 'CORE23MLTN002',
                    'InventorySupervision': true,
                    'PROGRESS': 75,
                    'ConfigurationManagementSupervision': true,
                    'PerformanceSupervision': true,
                    'FaultManagementSupervision': false,
                    'ACTION': 'DISABLE',
                    'POID': '1234',
                    'STATUS': 'FAIL',
                    'START_TIME': 160002389,
                    'CURRENT_TIME': 160002389,
                    'ERROR': '',
                    'eventbus': eventBusStub
                }],
                [{
                    'NodeName': 'CORE23MLTN002',
                    'InventorySupervision': true,
                    'PROGRESS': 75,
                    'ConfigurationManagementSupervision': true,
                    'PerformanceSupervision': true,
                    'FaultManagementSupervision': false,
                    'ACTION': 'ENABLE',
                    'POID': '1234',
                    'STATUS': 'Canceled',
                    'START_TIME': 160002389,
                    'CURRENT_TIME': 160002389,
                    'ERROR': '',
                    'eventbus': eventBusStub
                }],
                [{
                    'NodeName': 'CORE23MLTN002',
                    'InventorySupervision': true,
                    'PROGRESS': 100,
                    'ConfigurationManagementSupervision': true,
                    'PerformanceSupervision': true,
                    'FaultManagementSupervision': false,
                    'ACTION': 'ENABLE',
                    'POID': '1234',
                    'STATUS': 'SUCCESS',
                    'START_TIME': 160002389,
                    'CURRENT_TIME': 160002389,
                    'ERROR': '',
                    'eventbus': eventBusStub
                }],
                [{
                    'NodeName': 'CORE23MLTN002',
                    'InventorySupervision': true,
                    'PROGRESS': 75,
                    'ConfigurationManagementSupervision': true,
                    'PerformanceSupervision': true,
                    'FaultManagementSupervision': false,
                    'ACTION': 'ENABLE',
                    'POID': '1234',
                    'STATUS': 'ABCD',
                    'START_TIME': 160002389,
                    'CURRENT_TIME': 160002389,
                    'ERROR': '',
                    'eventbus': eventBusStub
                }],
                [{
                    'NodeName': 'CORE23MLTN003',
                    'ACTION': 'DISABLE',
                    'STATUS': 'DELETE'
                }],
                [{
                    'NodeName': 'CORE23MLTN002',
                    'ACTION': 'DISABLE',
                    'STATUS': 'SUCCESS'
                }]
            ];
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        it('should be defined', function() {
            // Assert
            expect(supervisionWdiget).not.to.be.undefined;
        });

        it('should subscribe to the webpush events', function() {
            // Assert
            expect(eventBusStub.subscribe.callCount).to.equal(4);
            expect(eventBusStub.subscribe.getCall(0).args[0]).to.equal('supervision:setWebPushData');
            expect(eventBusStub.subscribe.getCall(0).args[1]).to.be.a.function;
            expect(eventBusStub.subscribe.getCall(1).args[0]).to.equal('supervision:showLoader');
            expect(eventBusStub.subscribe.getCall(1).args[1]).to.be.a.function;
            expect(eventBusStub.subscribe.getCall(2).args[0]).to.equal('supervision:hideLoader');
            expect(eventBusStub.subscribe.getCall(2).args[1]).to.be.a.function;
            expect(eventBusStub.subscribe.getCall(3).args[0]).to.equal('supervision:initTreeData');
            expect(eventBusStub.subscribe.getCall(3).args[1]).to.be.a.function;
        });

        describe('onViewReady', function() {
            it('should initialize table columns', function() {
                // Setup
                var emptyDataMessageSpy = sandbox.spy(supervisionWdiget, 'emptyDataMessage');

                // Run
                supervisionWdiget.onViewReady();

                // Assert
                expect(emptyDataMessageSpy.callCount).to.equal(1);
            });
        });

        describe('clearTasksButton', function() {
            it('should attach a clear task button to the view and bind it to its action', function() {
                // Setup
                var bindSpy = sandbox.spy(supervisionWdiget.clearCompletedTasks, 'bind');

                // Run
                supervisionWdiget.clearTasksButton();

                // Assert
                expect(supervisionWdiget.view.getInfoValue.callCount).to.equal(4);
                expect(bindSpy.callCount).to.equal(1);
            });
        });

        describe('removeRowData', function() {
            it('should add an ENABLE event in the delete data', function() {
                // Setup
                var username = 'user';
                supervisionWdiget.user = username;
                supervisionWdiget.filterObject[mockData[0][0].NodeName] = mockData[0][0];

                // Run
                supervisionWdiget.removeRowData(mockData[0][0].NodeName);

                // Assert
                expect(supervisionWdiget.deleteData).to.deep.equal({
                    'userName': username,
                    'enableNodesList': [mockData[0][0].NodeName],
                    'disableNodesList': []
                });
            });

            it('should add an DISABLE event in the delete data', function() {
                // Setup
                var username = 'user';
                supervisionWdiget.user = username;
                supervisionWdiget.filterObject[mockData[1][0].NodeName] = mockData[1][0];

                // Run
                supervisionWdiget.removeRowData(mockData[1][0].NodeName);

                // Assert
                expect(supervisionWdiget.deleteData).to.deep.equal({
                    'userName': username,
                    'enableNodesList': [],
                    'disableNodesList': [mockData[1][0].NodeName]
                });
            });
        });

        describe('emptyDataMessage', function() {
            it('should create a new empty inline message and attach it', function() {
                // Run
                supervisionWdiget.emptyDataMessage();

                // Assert
                expect(supervisionWdiget.view.getEmptyMessage.callCount).to.equal(1);
                expect(supervisionWdiget.inlineMessage).to.be.defined;
            });
        });

        describe('createTable', function() {
            it('should create a table and attach it to the view', function() {
                // Setup
                supervisionWdiget.table = undefined;

                // Run
                supervisionWdiget.createTable();

                // Assert
                expect(supervisionWdiget.view.getProgress.callCount).to.equal(1);
                expect(supervisionWdiget.table).to.be.defined;
            });

            it('should not create a new table if it is already defined', function() {
                // Setup
                var table = new Table();
                supervisionWdiget.table = table;

                // Run
                supervisionWdiget.createTable();

                // Assert
                expect(supervisionWdiget.view.getProgress.callCount).to.equal(1);
                expect(supervisionWdiget.table).to.equal(table);
            });
        });

        describe('setWebPushData', function() {
            it('should not proceed with the table if there are no notifications', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData([]);

                // Assert
                expect(supervisionWdiget.createTable.callCount).to.equal(0);
                expect(table.setData.callCount).to.equal(0);
            });

            it('should process a ENABLE SUCCESS webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[0]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
                expect(table.setData.callCount).to.equal(1);
            });

            it('should process a DISABLE ABCD webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[1]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
                expect(table.setData.callCount).to.equal(1);
            });

            it('should process a DISABLE FAIL webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[2]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
                expect(table.setData.callCount).to.equal(1);
            });

            it('should process a ENABLE CANCELLED webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[3]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
                expect(table.setData.callCount).to.equal(1);
            });

            it('should process a ENABLE PROGRESS webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[4]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
                expect(table.setData.callCount).to.equal(1);
            });

            it('should process a ENABLE ABCD webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[5]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
                expect(table.setData.callCount).to.equal(1);
            });

            it('should process a DISABLE DELETE webpush event', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();

                // Run
                supervisionWdiget.setWebPushData(mockData[6]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(0);
                expect(table.setData.callCount).to.equal(0);
            });

            it('should process the webpush event and add it at the start of the array', function() {
                // Setup
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.progressObject[mockData[7].NodeName + mockData[7].ACTION] = '';
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                // Run
                supervisionWdiget.setWebPushData(mockData[7]);

                // Assert
                expect(supervisionWdiget.progressObject.CORE23MLTN002).to.be.defined;
                expect(supervisionWdiget.createTable.callCount).to.equal(1);
            });

            it('should destroy the clear button if it exists', function() {
                supervisionWdiget.clearButton = {
                    destroy: sandbox.spy()
                };

                supervisionWdiget.setWebPushData([]);

                expect(supervisionWdiget.clearButton.destroy.callCount).to.eql(1);
            });

            it('should create a filter object if the object has both the node name and action name as it\'s key', function() {
                var table = new Table();
                table.setData = sandbox.spy();
                supervisionWdiget.table = table;
                supervisionWdiget.createTable = sandbox.spy();
                supervisionWdiget.topologyDropdownValue = {
                    name: 'Transport Topology'
                };

                supervisionWdiget.progressObject = {
                    CORE23MLTN002ENABLE: mockData[5][0]
                };

                supervisionWdiget.setWebPushData(mockData[5]);

                expect(supervisionWdiget.filterObject[0]).to.eql(supervisionWdiget.progressObject['CORE23MLTN002ENABLE']);
            });
        });

        describe('clearCompletedTasks', function() {
            it('should clear all completed tasks - no data', function() {
                // Setup
                supervisionWdiget.user = 'user';

                // Run
                supervisionWdiget.clearCompletedTasks();

                // Assert
                expect(supervisionWdiget.deleteData).to.deep.equal({
                    'userName': 'user',
                    'enableNodesList': [],
                    'disableNodesList': []
                });
            });

            it('should clear all completed tasks - disabled node', function() {
                // Setup
                supervisionWdiget.user = 'user';
                supervisionWdiget.progressObject={CORE23MLTN002: mockData[1][0]};

                // Run
                supervisionWdiget.clearCompletedTasks();

                // Assert
                expect(supervisionWdiget.deleteData).to.deep.equal({
                    'userName': 'user',
                    'enableNodesList': [],
                    'disableNodesList': ['CORE23MLTN002']
                });
            });

            it('should clear all completed tasks - disabled node failed', function() {
                // Setup
                supervisionWdiget.user = 'user';
                supervisionWdiget.progressObject={CORE23MLTN002: mockData[2][0]};

                // Run
                supervisionWdiget.clearCompletedTasks();

                // Assert
                expect(supervisionWdiget.deleteData).to.deep.equal({
                    'userName': 'user',
                    'enableNodesList': [],
                    'disableNodesList': ['CORE23MLTN002']
                });
            });

            it('should clear all completed tasks - enabled node failed', function() {
                // Setup
                supervisionWdiget.user = 'user';
                supervisionWdiget.progressObject={CORE23MLTN002: mockData[4][0]};

                // Run
                supervisionWdiget.clearCompletedTasks();

                // Assert
                expect(supervisionWdiget.deleteData).to.deep.equal({
                    'userName': 'user',
                    'enableNodesList': ['CORE23MLTN002'],
                    'disableNodesList': []
                });
            });
        });

        describe('sortingOnDeletion', function() {
            it('should destroy the table and display an empty message', function(done) {
                // Setup
                var destroySpy = sandbox.spy();
                supervisionWdiget.table = {
                    destroy: destroySpy
                };
                var showLoaderSpy = sandbox.spy(supervisionWdiget, 'showLoader');
                var hideLoaderSpy = sandbox.spy(supervisionWdiget, 'hideLoader');
                sandbox.stub(Rest, 'deleteNotifyData').returns(Promise.resolve('SUCCESS'));

                // Run
                supervisionWdiget.sortingOnDeletion().then(function() {
                    expect(showLoaderSpy.callCount).to.equal(1);
                    expect(hideLoaderSpy.callCount).to.equal(1);
                    expect(supervisionWdiget.table.destroy.callCount).to.eql(1);
                    expect(destroySpy.callCount).to.equal(1);
                    done();
                });
            });

            it('should remove the progress object', function() {
                // Setup
                supervisionWdiget.deleteDataPayload = {};
                supervisionWdiget.progressObject = {};
                supervisionWdiget.deleteDataPayload[mockData[0].NodeName] = mockData[0];
                supervisionWdiget.progressObject[mockData[0].NodeName] = mockData[0];
                var showLoaderSpy = sandbox.spy(supervisionWdiget, 'showLoader');
                var hideLoaderSpy = sandbox.spy(supervisionWdiget, 'hideLoader');
                sandbox.stub(Rest, 'deleteNotifyData').returns(Promise.resolve('SUCCESS'));

                // Run
                supervisionWdiget.sortingOnDeletion().then(function() {
                    expect(showLoaderSpy.callCount).to.equal(1);
                    expect(hideLoaderSpy.callCount).to.equal(1);
                    expect(supervisionWdiget.progressObject).to.deep.equal({});
                });
            });

            it('should add the progress objects in the filter object and add them into the table', function(done) {
                // Setup
                var setDataSpy = sandbox.spy();
                supervisionWdiget.table = {
                    setData: setDataSpy
                };
                supervisionWdiget.progressObject = {};
                supervisionWdiget.progressObject[mockData[0][0].NodeName + mockData[0][0].ACTION] = mockData[0];
                var showLoaderSpy = sandbox.spy(supervisionWdiget, 'showLoader');
                var hideLoaderSpy = sandbox.spy(supervisionWdiget, 'hideLoader');
                sandbox.stub(Rest, 'deleteNotifyData').returns(Promise.resolve('SUCCESS'));

                // Run
                supervisionWdiget.sortingOnDeletion().then(function() {
                    expect(showLoaderSpy.callCount).to.equal(1);
                    expect(hideLoaderSpy.callCount).to.equal(1);
                    expect(supervisionWdiget.progressObject[mockData[0][0].NodeName + mockData[0][0].ACTION][0]).to.deep.equal(mockData[0][0]);
                    expect(supervisionWdiget.filterObject).to.deep.equal([mockData[0]]);
                    expect(setDataSpy.calledWith([mockData[0]])).to.be.true;
                    done();
                });
            });

            it('should catch an error coming from service side', function() {
                // Setup
                var errorMessage = {msg: 'Internal Server Error'};
                var showLoaderSpy = sandbox.spy(supervisionWdiget, 'showLoader');
                var hideLoaderSpy = sandbox.spy(supervisionWdiget, 'hideLoader');
                sandbox.stub(Rest, 'deleteNotifyData').returns(Promise.reject(errorMessage));

                // Run
                supervisionWdiget.sortingOnDeletion().catch(function(error) {
                    expect(showLoaderSpy.callCount).to.equal(1);
                    expect(hideLoaderSpy.callCount).to.equal(1);
                    expect(error.message).to.equal(errorMessage.msg);
                });
            });
        });

        describe('supervision:showLoader', function() {
            it('should create a loader', function() {
                // Setup
                supervisionWdiget.getElement = sandbox.spy();

                // Run
                supervisionWdiget.showLoader();

                // Assert
                expect(supervisionWdiget.getElement.callCount).to.equal(1);
                expect(supervisionWdiget.loader).to.be.defined;
            });


            it('should destroy the loader if present and create a new one', function() {
                // Setup
                var destroySpy = sandbox.spy();
                supervisionWdiget.loader = {
                    destroy: destroySpy
                };
                supervisionWdiget.getElement = sandbox.spy();

                // Run
                supervisionWdiget.showLoader();

                // Assert
                expect(supervisionWdiget.getElement.callCount).to.equal(1);
                expect(supervisionWdiget.loader).to.be.defined;
                expect(destroySpy.callCount).to.equal(1);
            });
        });

        describe('hideLoader', function() {
            it('should destroy the loader if present', function() {
                // Setup
                supervisionWdiget.loader = {
                    destroy: sandbox.spy()
                };

                // Run
                supervisionWdiget.hideLoader();

                // Assert
                expect(supervisionWdiget.loader.destroy.callCount).to.equal(1);
            });

            it('should not destroy the loader if not present', function() {
                // Setup
                supervisionWdiget.loader = undefined;

                // Run
                supervisionWdiget.hideLoader();

                // Assert
                expect(supervisionWdiget.loader).to.not.be.defined;
            });
        });

        describe('setData()', function() {
            it('should set the data in the local tree ', function() {
                // Setup
                var data = {
                    payload: {}
                };

                // Run
                supervisionWdiget.setData(data);

                //Assert
                expect(supervisionWdiget.tree).to.deep.equal(data);
            });
        });

        describe('addManagedElementPoIdToFilterObjects()', function() {
            it('should add the poid and parent to object if tree is defined', function() {
                // Setup
                var filteredObject = [{
                    NodeName: 'nodeName1'
                }];
                var tree = [{
                    label: 'nodeName1',
                    id: 'id1',
                    parent: 'parent1'
                }, {
                    label: 'label2',
                    id: 'id2',
                    parent: 'parent2'
                }];
                supervisionWdiget.tree = tree;

                // Run
                supervisionWdiget.addManagedElementPoIdToFilterObjects(filteredObject);

                //Assert
                expect(filteredObject[0].managedElementPoId).to.equal(tree[0].id);
                expect(filteredObject[0].parent).to.equal(tree[0].parent);
            });
        });
    });
});
