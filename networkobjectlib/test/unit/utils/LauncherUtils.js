define([
    'networkobjectlib/utils/LauncherUtils',
    'networkobjectlib/utils/LauncherUtilsRest',
    'networkobjectlib/utils/TopologyUtility',
    'i18n!networkobjectlib/dictionary.json',
    'jscore/core',
    'container/api',
    'actionlibrary/ActionLibrary',
    'actionlibrary/RecentActions'
],function(launcherUtils, LauncherUtilsRest, TopologyUtility, Dictionary, core, Container, ActionLibrary, RecentActions) {

    describe('LauncherUtils', function() {

        var sandbox,classUnderTest, sourceApp, actionName = 'Search for an Object';

        beforeEach(function() {
            //Setup to prepare fake stuffs
            sandbox = sinon.sandbox.create();
            sourceApp = 'topologybrowser';
            var defaultActions = [
                {
                    name: actionName,
                    link: '#networkexplorer',
                    action: function() {}
                }
            ];


            classUnderTest = new launcherUtils(defaultActions);

            sandbox.stub(Container, 'getConfig', function() {
                return {defaultApp: sourceApp};
            });

            sandbox.stub(ActionLibrary, 'createMetaObject');
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('createLauncherAction()', function() {
            describe('one available action', function() {

                beforeEach(function() {
                    sandbox.stub(classUnderTest, 'getMetaObject');
                    sandbox.stub(ActionLibrary, 'getAvailableActions', function() {
                        return Promise.resolve([{
                            'defaultLabel': 'Locate in Topology',
                            'name': 'topologybrowser-locate-in-topology',
                            'plugin': 'topologybrowser/topologybrowser-locate-in-topology',
                            'applicationId': 'topologybrowser',
                            'multipleSelection': false,
                            'primary': true,
                            'category': 'Application Primary Action'
                        }]);
                    });

                    sandbox.stub(RecentActions, 'getRecentActions', function() {
                        return Promise.resolve([{
                            availableActions: actionName,
                            actionBarActions: '',
                            contextMenuActions: ''
                        }]);
                    });

                    sandbox.stub(RecentActions, 'getRecentActionDropdown', function() {
                        return [{
                        }];
                    });

                    sandbox.stub(classUnderTest, 'getContextMenuActions', function() {
                        return [{
                        }];
                    });

                });

                it('should show available actions for selection', function(done) {

                    var selection = [{
                        id: '281474977611630',
                        moType: 'ManagedElement',
                        neType: 'RadioNode'
                    }];

                    //ACT
                    classUnderTest.createLauncherAction(selection)
                        .then(function(returnedActions) {
                            expect(returnedActions.availableActions[0].name).to.equal(actionName);
                            expect(returnedActions.availableActions[1].type).to.equal('separator');
                            expect(returnedActions.availableActions[2].name).to.equal('Locate in Topology');

                            expect(returnedActions.contextMenuActions[1].name).to.equal(actionName);
                            expect(returnedActions.contextMenuActions[2].type).to.equal('separator');
                            expect(returnedActions.contextMenuActions[3].name).to.equal('Locate in Topology');

                            expect(returnedActions.actionBarActions[1].name).to.equal(actionName);
                            expect(returnedActions.actionBarActions[2].type).to.equal('separator');
                            expect(returnedActions.actionBarActions[3].name).to.equal('Locate in Topology');
                            done();
                        });

                    expect(classUnderTest.getMetaObject.callCount).to.equal(1);
                    expect(ActionLibrary.getAvailableActions.callCount).to.equal(1);
                });

                it('should show remove actions for selection', function(done) {
                    var selection = [{
                        id: '281474977611630',
                        moType: 'ManagedElement',
                        neType: 'RadioNode',
                        enableRemoveNodeButton: true,
                        enableMoveToCollectionButton: true
                    }];

                    //ACT
                    classUnderTest.createLauncherAction(selection)
                        .then(function(returnedActions) {
                            expect(returnedActions.availableActions[0].name).to.equal(actionName);
                            expect(returnedActions.availableActions[1].type).to.equal('separator');
                            expect(returnedActions.availableActions[2].name).to.equal('Remove from Collection');
                            expect(returnedActions.availableActions[3].name).to.equal('Move to Collection');
                            expect(returnedActions.availableActions[4].type).to.equal('separator');
                            expect(returnedActions.availableActions[5].name).to.equal('Locate in Topology');

                            expect(returnedActions.contextMenuActions[1].name).to.equal(actionName);
                            expect(returnedActions.contextMenuActions[2].type).to.equal('separator');
                            expect(returnedActions.contextMenuActions[3].name).to.equal('Remove from Collection');
                            expect(returnedActions.contextMenuActions[4].name).to.equal('Move to Collection');
                            expect(returnedActions.contextMenuActions[5].type).to.equal('separator');
                            expect(returnedActions.contextMenuActions[6].name).to.equal('Locate in Topology');

                            expect(returnedActions.actionBarActions[1].name).to.equal(actionName);
                            expect(returnedActions.actionBarActions[2].type).to.equal('separator');
                            expect(returnedActions.actionBarActions[3].name).to.equal('Remove from Collection');
                            expect(returnedActions.actionBarActions[4].name).to.equal('Move to Collection');
                            expect(returnedActions.actionBarActions[5].type).to.equal('separator');
                            expect(returnedActions.actionBarActions[6].name).to.equal('Locate in Topology');

                            done();
                        });

                    expect(classUnderTest.getMetaObject.callCount).to.equal(1);
                    expect(ActionLibrary.getAvailableActions.callCount).to.equal(1);
                });
            });

            describe('createLauncherAction() for UN/VSN nodes', function() {

                beforeEach(function() {
                    sandbox.stub(classUnderTest, 'getMetaObject');
                    sandbox.stub(ActionLibrary, 'getAvailableActions', function() {
                        return Promise.resolve([{
                            'defaultLabel': 'Locate in Topology',
                            'multipleSelection': false,
                            'primary': true,
                            'category': 'Application Primary Action'
                        }]);
                    });
                    sandbox.stub(RecentActions, 'getRecentActions', function(res) {
                        res = { actionList: [{ 'name': 'Manage Links'},{ 'name': 'Add Node'}] };
                        return Promise.resolve(res);
                    });
                    sandbox.stub(RecentActions, 'getRecentActionDropdown', function() {
                        return [{ }];
                    });
                    sandbox.stub(classUnderTest, 'getContextMenuActions', function() {
                        return [{ }];
                    });
                });
    
                it('should call createLauncherAction', function() {
                    var selectedElement = [
                        {
                            'elementType': 'MO',
                            'moName': 'NCM_1',
                            'moType': 'MeContext',
                            'managementState': 'NORMAL',
                            'neType': 'Unmanaged',
                            'id': '62243'
                        }
                    ];
                    classUnderTest.hasUnVsn = true;
                    sandbox.spy(classUnderTest, 'createLauncherAction');
                    classUnderTest.createLauncherAction(selectedElement);
                    expect(classUnderTest.createLauncherAction.callCount).to.equal(1);
                });

                it('should call removeActionsForUnVsn', function() {
                    var actions = [ { 'name': 'Monitor Alarms' }, { 'name': 'Upgrade Node Software' } ];
                    classUnderTest.hasUnVsn = true;
                    sandbox.spy(classUnderTest, 'removeActionsForUnVsn');
                    classUnderTest.removeActionsForUnVsn(actions);
                    expect(classUnderTest.removeActionsForUnVsn.callCount).to.equal(1);
                });
            });

            describe('multiple available actions', function() {

                beforeEach(function() {
                    sandbox.stub(classUnderTest, 'getMetaObject');
                    sandbox.stub(ActionLibrary, 'getAvailableActions', function() {
                        return Promise.resolve([{
                            'defaultLabel': 'Action 1',
                            'category': 'categoryA'
                        }, {
                            'defaultLabel': 'Action 2',
                            'category': 'categoryB'
                        }, {
                            'defaultLabel': 'Action 3',
                            'category': 'categoryB'
                        }, {
                            'defaultLabel': 'Action 4',
                            'category': 'categoryC'
                        }]
                        );
                    });
                    sandbox.stub(RecentActions, 'getRecentActions', function() {
                        return Promise.resolve([{
                            availableActions: actionName,
                        }]);
                    });

                    sandbox.stub(RecentActions, 'getRecentActionDropdown', function() {
                        return [{
                        }];
                    });

                    sandbox.stub(classUnderTest, 'getContextMenuActions', function() {
                        return [{
                        }];
                    });
                });

                it('should show available actions for selection ordered with separators', function(done) {

                    var selection = [{
                        id: '281474977611630',
                        moType: 'ManagedElement',
                        neType: 'RadioNode'
                    }];

                    //ACT
                    classUnderTest.createLauncherAction(selection)
                        .then(function(returnedActions) {
                            expect(returnedActions.availableActions[0].name).to.equal(actionName);
                            expect(returnedActions.availableActions[1].type).to.equal('separator');
                            expect(returnedActions.availableActions[2].name).to.equal('Action 1');
                            expect(returnedActions.availableActions[3].type).to.equal('separator');
                            expect(returnedActions.availableActions[4].name).to.equal('Action 2');
                            expect(returnedActions.availableActions[5].name).to.equal('Action 3');
                            expect(returnedActions.availableActions[6].type).to.equal('separator');
                            expect(returnedActions.availableActions[7].name).to.equal('Action 4');

                            expect(returnedActions.contextMenuActions[1].name).to.equal(actionName);
                            expect(returnedActions.contextMenuActions[2].type).to.equal('separator');
                            expect(returnedActions.contextMenuActions[3].name).to.equal('Action 1');
                            expect(returnedActions.contextMenuActions[4].type).to.equal('separator');
                            expect(returnedActions.contextMenuActions[5].name).to.equal('Action 2');
                            expect(returnedActions.contextMenuActions[6].name).to.equal('Action 3');
                            expect(returnedActions.contextMenuActions[7].type).to.equal('separator');
                            expect(returnedActions.contextMenuActions[8].name).to.equal('Action 4');

                            expect(returnedActions.actionBarActions[1].name).to.equal(actionName);
                            expect(returnedActions.actionBarActions[2].type).to.equal('separator');
                            expect(returnedActions.actionBarActions[3].name).to.equal('Action 1');
                            expect(returnedActions.actionBarActions[4].type).to.equal('separator');
                            expect(returnedActions.actionBarActions[5].name).to.equal('Action 2');
                            expect(returnedActions.actionBarActions[6].name).to.equal('Action 3');
                            expect(returnedActions.actionBarActions[7].type).to.equal('separator');
                            expect(returnedActions.actionBarActions[8].name).to.equal('Action 4');
                            done();
                        });

                    expect(classUnderTest.getMetaObject.callCount).to.equal(1);
                    expect(ActionLibrary.getAvailableActions.callCount).to.equal(1);
                });
            });
        });

        describe('getMetaData', function() {
            it('should create metadata when multiple objects selected', function() {

                var selection = [{'moType': 'ManagedElement', poid: '281474977364121'},
                                 {'moType': 'ManagedElement', poid: '281474977364122'}];

                classUnderTest.getMetaObject(selection);

                expect(ActionLibrary.createMetaObject.getCall(0).calledWith(
                    sourceApp,
                    'ManagedObject',
                    selection
                )).to.be.true;
            });
            it('should create metadata when collection objects selected', function() {

                var selection = [{'type': 'NESTED', 'subType': 'BRANCH', poid: '281474977364121', 'hybrid': null}];

                var expectedDataCalledWith = [{'type': 'NESTED', 'subType': 'BRANCH', poid: '281474977364121', 'hybrid': false}];

                classUnderTest.getMetaObject(selection);

                expect(ActionLibrary.createMetaObject.getCall(0).calledWith(
                    sourceApp,
                    'Collection',
                    expectedDataCalledWith
                )).to.be.true;
            });
        });

        describe('createActionButtons', function() {
            it('should create button for supplied action', function() {
                var selection = [];
                var actions = [
                    { defaultLabel: 'Locate in Topology' },
                    { defaultLabel: 'Open Alarm' }
                ];

                var buttons = classUnderTest.createActionButtons(actions, selection);

                expect(buttons[0].name).to.equal('Locate in Topology');
                expect(buttons[1].name).to.equal('Open Alarm');
            });
            it('should create button with icon for supplied action if it declares an optional icon', function() {
                var selection = [];
                var actions = [
                    { defaultLabel: 'Locate in Topology' },
                    { defaultLabel: 'Open Alarm', icon: 'testIcon' }
                ];

                var buttons = classUnderTest.createActionButtons(actions, selection);

                expect(buttons[0].name).to.equal('Locate in Topology');
                expect(buttons[0].icon).to.equal(undefined);
                expect(buttons[1].name).to.equal('Open Alarm');
                expect(buttons[1].icon).to.equal('testIcon');
            });
        });

        describe('formatSelection', function() {

            [
                {
                    description: 'SEARCH_CRITERIA',
                    selections: [
                        {
                            query: true
                        }
                    ],
                    expected: {
                        subType: 'SEARCH_CRITERIA',
                        type: 'NESTED'
                    }
                },
                {
                    description: 'LEAF',
                    selections: [
                        {
                            type: 'LEAF'
                        }
                    ],
                    expected: {
                        subType: 'LEAF',
                        type: 'NESTED'
                    }
                },
                {
                    description: 'BRANCH',
                    selections: [
                        {
                            type: 'BRANCH'
                        }
                    ],
                    expected: {
                        subType: 'BRANCH',
                        type: 'NESTED'
                    }
                }
            ].forEach(function(test) {
                it('Should format correctly for - ' + test.description, function() {
                    //Action
                    var actual = classUnderTest.formatSelection(test.selections);

                    //Assert
                    expect(actual[0].type).to.equal(test.expected.type);
                    expect(actual[0].subType).to.equal(test.expected.subType);
                });
            });
        });

        describe('preActionCheck', function() {
            var alarmMonitorRemoteShowAction = {name: 'alarmmonitor-remote-show'};
            [{
                scenario: 'has objects',
                action: {
                    name: alarmMonitorRemoteShowAction.name
                },
                objects: [{
                    id: '1000',
                    type: 'NESTED'
                }],
                stubbedApiReturnValue: {objects: true},
                checkCollectionHasNodesCallCount: 1,
                expectedPreActionCheckReturnValue: false,
                expectedShowDialogCount: 0
            }, {
                scenario: 'has no objects',
                action: {
                    name: alarmMonitorRemoteShowAction.name
                },
                objects: [{
                    id: '1001',
                    type: 'BRANCH'
                }],
                stubbedApiReturnValue: {objects: false},
                checkCollectionHasNodesCallCount: 1,
                expectedPreActionCheckReturnValue: true,
                expectedShowDialogCount: 1
            }, {
                scenario: 'has objects',
                action: {
                    name: alarmMonitorRemoteShowAction.name
                },
                objects: [{
                    id: '1002',
                    type: 'LEAF'
                }],
                stubbedApiReturnValue: {objects: true},
                checkCollectionHasNodesCallCount: 1,
                expectedPreActionCheckReturnValue: false,
                expectedShowDialogCount: 0
            }, {
                scenario: 'is an object',
                action: {
                    name: alarmMonitorRemoteShowAction.name
                },
                objects: [{
                    id: '2000',
                    type: 'ManagedElement'
                }],
                expectedPreActionCheckReturnValue: false,
                expectedShowDialogCount: 0
            }, {
                scenario: 'is an object',
                action: {
                    name: alarmMonitorRemoteShowAction.name
                },
                objects: [{
                    id: '2001',
                    type: 'MeContext'
                }],
                expectedPreActionCheckReturnValue: false,
                expectedShowDialogCount: 0
            }].forEach(function(testData) {
                it('should return ' + testData.expectedPreActionCheckReturnValue + ' when the action is ' + testData.action.name
                    +  ' and when the objects are of type ' + testData.objects[0].type + ' and the selection ' + testData.scenario, function() {
                    sandbox.spy(classUnderTest, 'showDialog');
                    sandbox.spy(TopologyUtility, 'isCollection');
                    sandbox.stub(LauncherUtilsRest, 'checkCollectionHasNodes').returns(Promise.resolve(testData.stubbedApiReturnValue));

                    var actual = classUnderTest.preActionCheck(testData.action, testData.objects);

                    actual.then(function(stopAction) {
                        expect(classUnderTest.showDialog.callCount).to.eql(testData.expectedShowDialogCount);
                        expect(stopAction).to.eql(testData.expectedPreActionCheckReturnValue);
                    });
                    expect(TopologyUtility.isCollection.callCount).to.eql(1);
                });
            });

            it('should throw an error if a server issue is encountered', function(done) {
                var objects = [{
                    id: '1002',
                    type: 'LEAF'
                }];
                var data = JSON.stringify({
                    code: -999,
                    body: Dictionary.get('emptyCollectionError.body'),
                    title: Dictionary.get('emptyCollectionError.title')
                });
                sandbox.stub(LauncherUtilsRest, 'checkCollectionHasNodes').returns(Promise.reject(new Error(data)));

                classUnderTest.preActionCheck(alarmMonitorRemoteShowAction, objects)
                    .then(function() {
                        // failure
                    })
                    .catch(function(error) {
                        expect(error.code).to.eql(data.code);
                        expect(error.body).to.eql(data.body);
                        expect(error.title).to.eql(data.title);
                        done();
                    });
            });
        });

        describe('launchAction', function() {
            [{
                scenario: 'proceed and execute the action',
                preActionCheckReturnValue: false,
                expectedExecuteActionCallCount: 1
            },{
                scenario: 'not proceed and prevent the execute the action',
                preActionCheckReturnValue: true,
                expectedExecuteActionCallCount: 0
            }].forEach(function(testData) {
                it('should ' + testData.scenario + ' when preActionCheck returns ' + testData.preActionCheckReturnValue, function(done) {
                    sandbox.stub(classUnderTest, 'preActionCheck').returns(Promise.resolve(testData.preActionCheckReturnValue));
                    sandbox.stub(ActionLibrary, 'executeAction');

                    classUnderTest.launchAction('test-action', [{}]);

                    setTimeout(function() {
                        expect(ActionLibrary.executeAction.callCount).to.eql(testData.expectedExecuteActionCallCount);
                        done();
                    });
                });
            });

            it('should show an error dialog if a server issue is encountered', function(done) {
                classUnderTest.dialog = sinon.createStubInstance(core.Widget);
                var error = {
                    code: -999,
                    body: Dictionary.get('emptyCollectionError.body'),
                    title: Dictionary.get('emptyCollectionError.title')
                };
                sandbox.spy(classUnderTest, 'showDialog');
                sandbox.stub(classUnderTest, 'preActionCheck').returns(Promise.reject(error));

                classUnderTest.launchAction('test-action', [{}]);

                setTimeout(function() {
                    expect(classUnderTest.showDialog.callCount).to.eql(1);
                    expect(classUnderTest.showDialog.calledWith('error', error.title, error.body)).to.eql(true);
                    done();
                });
            });

        });

        describe('createMoveToCollectionAction', function() {
            var expected = {
                category: 'Collection Modification Actions',
                name: 'Remove from Collection',
                type: 'button'
            };

            [
                {
                    description: 'SEARCH_CRITERIA',
                    selections: [
                        {
                            query: true
                        }
                    ]
                },
                {
                    description: 'LEAF',
                    selections: [
                        {
                            type: 'LEAF'
                        }
                    ]
                },
                {
                    description: 'BRANCH',
                    selections: [
                        {
                            type: 'BRANCH'
                        }
                    ]
                }
            ].forEach(function(test) {
                it('Should format correctly for - ' + test.description, function() {
                    //Action
                    var actual = classUnderTest.createRemoveNodesAction(test.selections);

                    //Assert
                    expect(actual.name).to.equal(expected.name);
                });
            });
        });

        describe('createRemoveNodesAction', function() {
            var expected = {
                category: 'Collection Modification Actions',
                name: 'Move to Collection',
                type: 'button'
            };

            [
                {
                    description: 'SEARCH_CRITERIA',
                    selections: [
                        {
                            query: true
                        }
                    ]
                },
                {
                    description: 'LEAF',
                    selections: [
                        {
                            type: 'LEAF'
                        }
                    ]
                },
                {
                    description: 'BRANCH',
                    selections: [
                        {
                            type: 'BRANCH'
                        }
                    ]
                }
            ].forEach(function(test) {
                it('Should format correctly for - ' + test.description, function() {
                    //Action
                    var actual = classUnderTest.createMoveToCollectionAction(test.selections);

                    //Assert
                    expect(actual.name).to.equal(expected.name);
                });
            });
        });

        describe('getContextMenuActions', function() {
            [{
                description: '[]',
                data: []
            }, {
                description: '[action1, action2]',
                data: ['action1', 'action2']
            }].forEach(function(test) {
                it('Should get context menu actions correctly for - ' + test.description, function() {
                    //Setup
                    sandbox.stub(RecentActions, 'getRecentActionGroup', function(actionList) {
                        return actionList;
                    });

                    //Action
                    var actual = classUnderTest.getContextMenuActions(test.data);

                    //Assert
                    expect(actual[0]).to.eql(test.data[0]);
                });
            });
        });



    });
});
