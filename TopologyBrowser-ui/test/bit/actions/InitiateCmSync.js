/* global bitbox */
define([
    'jscore/core',
    'actionlibrary/ActionLibrary',
    'layouts/TopSection',
    'topologybrowser/actions/InitiateCmSync',
    'container/api',
    'test/resources/BitUtils',
    'test/resources/PersistentObjectRestMock',
    'test/resources/ScriptEngineRestMock',
    'test/resources/viewmodels/ActionBar',
    'test/resources/viewmodels/InitiateCmSync',
    'i18n!networkobjectlib/dictionary.json'
], function(core, ActionLibrary, TopSection, InitiateCmSync, Container, BitUtils, PersistentObjectRestMock, ScriptEngineRestMock, ActionBarViewModel, InitiateCmSyncViewModel, Dictionary) {

    describe('InitiateCmSync', function() {

        var currentApp, sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;
            sandbox.stub(Container, 'loadAppModule', function(path, callback) {
                callback(InitiateCmSync);
            });
            // app with top section to mimic Network Explorer's action bar
            var AppWithTopSection = core.App.extend({
                View: core.View.extend({
                    getTemplate: function() {
                        return '<div></div>';
                    }
                }),
                onStart: function() {
                    this.topsection = new TopSection({
                        context: this.getContext(),
                        title: 'Contextual Actions Test'
                    });
                    this.topsection.attachTo(this.getElement());
                }
            });
            currentApp = new AppWithTopSection();
            currentApp.start(core.Element.wrap(bitbox.getBody()));
        });

        afterEach(function() {
            currentApp.stop();
            sandbox.restore();
        });

        describe('Given an object in context', function() {
            describe('then show \'Inititate CM Sync\' action', function() {
                describe('and click sync button', function() {
                    [{
                        case: 'FAILED FDN : ',
                        icon: 'error',
                        responseStatus: 500
                    },{
                        case: 'SUCCESS FDN : ',
                        icon: 'tick',
                        responseStatus: 200
                    }].forEach(function(test) {
                        it('when rest returns a value containing "' +JSON.stringify(test.case)+ '", the node gets a ' +test.icon+ ' icon', function(done) {
                            this.timeout(8000);
                            var inititateCmSyncAction = {
                                defaultLabel: 'Inititate CM Sync',
                                plugin: 'topologybrowser/actions/InitiateCmSync'
                            };
                            var objects = [{
                                moType: 'TestMoType',
                                neType: 'TestNeType',
                                id: '2811111111111111'
                            }];
                            var transformedActions = [{
                                type: 'button',
                                name: inititateCmSyncAction.defaultLabel,
                                action: function() {
                                    ActionLibrary.executeAction(inititateCmSyncAction, objects, {
                                        onComplete: function() {
                                        },
                                        onFail: function() {
                                        }
                                    });
                                }
                            }];
                            var processId = '1234';

                            PersistentObjectRestMock.respondRootAssociations(sandbox.server, 200, [{
                                name: 'MyTestObject'
                            }]);
                            var cmFunctionFDN = 'NetworkElement=MyTestObject,CmFunction=1';
                            PersistentObjectRestMock.respondPerformActionOnMO(sandbox.server, cmFunctionFDN, 'sync', test.responseStatus, processId, [{}]);

                            BitUtils.runTestSteps([
                                function() {
                                    currentApp.getEventBus().publish('topsection:contextactions', transformedActions);
                                    return ActionBarViewModel.getActionButton();
                                },
                                function(inititateCmSyncActionButton) {
                                    expect(inititateCmSyncActionButton.textContent).to.equal(inititateCmSyncAction.defaultLabel);
                                    inititateCmSyncActionButton.click();
                                    return InitiateCmSyncViewModel.getSyncButton();
                                },
                                function(inititateCmSyncButton) {
                                    expect(inititateCmSyncButton.textContent).to.equal('Sync');
                                    inititateCmSyncButton.click();
                                    return InitiateCmSyncViewModel.getProgressRegion();
                                },
                                function(inititateCmSyncProgressRegion) {
                                    expect(inititateCmSyncProgressRegion.getAttribute('class')).to.equal('elNetworkObjectLib-progressRegion');
                                    return InitiateCmSyncViewModel.getOkButton();
                                },
                                InitiateCmSyncViewModel.getProgressRegion,
                                function(inititateCmSyncProgressRegion) {
                                    expect(inititateCmSyncProgressRegion.querySelector('table .ebIcon').getAttribute('class')).to.equal('ebIcon ebIcon_' + test.icon);
                                    return InitiateCmSyncViewModel.getOkButton();
                                },
                                function(inititateCmSyncOkButton) {
                                    expect(inititateCmSyncOkButton.textContent).to.equal('OK');
                                    inititateCmSyncOkButton.click();
                                }
                            ], done);
                        });
                    });
                });
            });
        });

        describe('Given an object in context', function() {
            describe('then show \'Inititate CM Sync\' action', function() {
                it('and click cancel button and ensure no progress region displayed', function(done) {
                    this.timeout(8000);
                    var inititateCmSyncAction = {
                        defaultLabel: 'Inititate CM Sync',
                        plugin: 'topologybrowser/actions/InitiateCmSync'
                    };
                    var objects = [{
                        moType: 'AnotherTestMoType',
                        neType: 'AnotherTestNeType',
                        id: '29222222222222'
                    }];
                    var transformedActions = [{
                        type: 'button',
                        name: inititateCmSyncAction.defaultLabel,
                        action: function() {
                            ActionLibrary.executeAction(inititateCmSyncAction, objects, {
                                onComplete: function() {
                                },
                                onFail: function() {
                                }
                            });
                        }
                    }];
                    var processId = '5678';

                    PersistentObjectRestMock.respondRootAssociations(sandbox.server, 200, [{
                        name: 'MyOtherTestObject'
                    }]);
                    var cmFunctionFDN = 'NetworkElement=MyOtherTestObject,CmFunction=1';
                    PersistentObjectRestMock.respondPerformActionOnMO(sandbox.server, cmFunctionFDN, 'sync', 200, processId, [{}]);

                    BitUtils.runTestSteps([
                        function() {
                            currentApp.getEventBus().publish('topsection:contextactions', transformedActions);
                            return ActionBarViewModel.getActionButton();
                        },
                        function(inititateCmSyncActionButton) {
                            expect(inititateCmSyncActionButton.textContent).to.equal(inititateCmSyncAction.defaultLabel);
                            inititateCmSyncActionButton.click();
                            return InitiateCmSyncViewModel.getNonSyncButtons();
                        },
                        function(nonInititateCmSyncButtons) {
                            var cancelButton = nonInititateCmSyncButtons[1];
                            expect(cancelButton.textContent).to.equal('Cancel');
                            cancelButton.click();
                            return InitiateCmSyncViewModel.getProgressRegion();
                        },
                        function(inititateCmSyncProgressRegion) {
                            expect(inititateCmSyncProgressRegion instanceof NodeList).to.equal(true);
                            expect(inititateCmSyncProgressRegion.length).to.equal(0);
                        }
                    ], done);
                });
            });
        });

        describe('Initiate CM Sync action should be backwards compatible', function() {
            this.timeout(8000);
            var inititateCmSyncAction = {
                defaultLabel: 'Inititate CM Sync',
                plugin: 'topologybrowser/actions/InitiateCmSync'
            };
            var objects = [{
                moType: 'TestMoType',
                neType: 'TestNeType',
                id: '2811111111111111'
            }];
            var transformedActions = [{
                type: 'button',
                name: inititateCmSyncAction.defaultLabel,
                action: function() {
                    ActionLibrary.executeAction(inititateCmSyncAction, objects, {
                        onComplete: function() {
                        },
                        onFail: function() {
                        }
                    });
                }
            }];

            it('when the Persistent Object Service perform-mo-action is not available it should fall back to script engine and succeed', function(done) {
                PersistentObjectRestMock.respondRootAssociations(sandbox.server, 200, [{ name: 'MyTestObject' }]);

                var cmFunctionFDN = 'NetworkElement=MyTestObject,CmFunction=1';
                var persistentObjectMockXhr = { errorCode: 998 };
                PersistentObjectRestMock.respondPerformActionOnMO(sandbox.server, cmFunctionFDN, 'sync', 404, persistentObjectMockXhr);

                var processId = '1234';
                ScriptEngineRestMock.respondCommand(sandbox.server, 200, processId, [{}]);
                ScriptEngineRestMock.respondCommandOutput(sandbox.server, 200, processId, [{value: 'SUCCESS FDN : '}]);

                BitUtils.runTestSteps([
                    function() {
                        currentApp.getEventBus().publish('topsection:contextactions', transformedActions);
                        return ActionBarViewModel.getActionButton();
                    },
                    function(inititateCmSyncActionButton) {
                        expect(inititateCmSyncActionButton.textContent).to.equal(inititateCmSyncAction.defaultLabel);
                        inititateCmSyncActionButton.click();
                        return InitiateCmSyncViewModel.getSyncButton();
                    },
                    function(inititateCmSyncButton) {
                        expect(inititateCmSyncButton.textContent).to.equal('Sync');
                        inititateCmSyncButton.click();
                        return InitiateCmSyncViewModel.getProgressRegion();
                    },
                    function(inititateCmSyncProgressRegion) {
                        expect(inititateCmSyncProgressRegion.getAttribute('class')).to.equal('elNetworkObjectLib-progressRegion');
                        return InitiateCmSyncViewModel.getOkButton();
                    },
                    InitiateCmSyncViewModel.getProgressRegion,
                    function(inititateCmSyncProgressRegion) {
                        expect(inititateCmSyncProgressRegion.querySelector('table .ebIcon').getAttribute('class')).to.equal('ebIcon ebIcon_' + 'tick');
                        return InitiateCmSyncViewModel.getOkButton();
                    },
                    function(inititateCmSyncOkButton) {
                        expect(inititateCmSyncOkButton.textContent).to.equal('OK');
                        inititateCmSyncOkButton.click();
                    }
                ], done);
            });

            describe('and should show and informative method when', function() {
                [
                    {
                        description: 'CM Supervision is disabled and Persistent Object Service perform-mo-action end point is available',
                        POSResponse: {
                            status: 500,
                            errorCode: 10022,
                            body: 'Please ensure that the active attribute in the CmNodeHeartbeatSupervision MO has been set to true.'
                        },
                        scriptEngineResponse: [{
                            dtoType: '', statusMessage: ''
                        }],
                        expectedMessage: Dictionary.get('errors.initiateCmSyncSupervisionDisabled.body')
                    },
                    {
                        description: 'CM Supervision is disabled and Persistent Object Service perform-mo-action end point is not available',
                        POSResponse: {
                            status: 404,
                            errorCode: 998,
                            body: ''
                        },
                        scriptEngineResponse: [{
                            dtoType: 'summary',
                            statusMessage: 'Please ensure that the active attribute in the CmNodeHeartbeatSupervision MO has been set to true.'
                        }],
                        expectedMessage: Dictionary.get('errors.initiateCmSyncSupervisionDisabled.body')
                    },
                    {
                        description: 'OverloadProtection no capacity error',
                        POSResponse: {
                            status: 429,
                            title: 'Unable to Retrieve Data',
                            body: 'There is currently no capacity to process the request due to a large amount of activity on the server. Please try again later.',
                            errorCode: 10106
                        },
                        scriptEngineResponse: [{
                            dtoType: 'summary',
                            statusMessage: 'Please ensure that the active attribute in the CmNodeHeartbeatSupervision MO has been set to true.'
                        }],
                        expectedMessage: Dictionary.get('errors.memoryProtectionDataRetrievalError.body')
                    }
                ].forEach(function(test) {
                    it(test.description, function(done) {
                        PersistentObjectRestMock.respondRootAssociations(sandbox.server, 200, [{ name: 'MyTestObject' }]);
                        var cmFunctionFDN = 'NetworkElement=MyTestObject,CmFunction=1';
                        PersistentObjectRestMock.respondPerformActionOnMO(sandbox.server, cmFunctionFDN, 'sync', test.POSResponse.status, test.POSResponse);

                        var processId = '1234';
                        ScriptEngineRestMock.respondCommand(sandbox.server, 200, processId, [{}]);
                        ScriptEngineRestMock.respondCommandOutput(sandbox.server, 200, processId, test.scriptEngineResponse);

                        BitUtils.runTestSteps([
                            function() {
                                currentApp.getEventBus().publish('topsection:contextactions', transformedActions);
                                return ActionBarViewModel.getActionButton();
                            },
                            function(inititateCmSyncActionButton) {
                                expect(inititateCmSyncActionButton.textContent).to.equal(inititateCmSyncAction.defaultLabel);
                                inititateCmSyncActionButton.click();
                                return InitiateCmSyncViewModel.getSyncButton();
                            },
                            function(inititateCmSyncButton) {
                                expect(inititateCmSyncButton.textContent).to.equal('Sync');
                                inititateCmSyncButton.click();
                                return InitiateCmSyncViewModel.getProgressRegion();
                            },
                            function(inititateCmSyncProgressRegion) {
                                expect(inititateCmSyncProgressRegion.getAttribute('class')).to.equal('elNetworkObjectLib-progressRegion');
                                return InitiateCmSyncViewModel.getOkButton();
                            },
                            InitiateCmSyncViewModel.getProgressRegion,
                            function(inititateCmSyncProgressRegion) {
                                expect(inititateCmSyncProgressRegion.querySelector('table .ebIcon').getAttribute('class')).to.equal('ebIcon ebIcon_error');
                                expect(inititateCmSyncProgressRegion.querySelector('table > tbody > tr > td > span').textContent).to.contain(test.expectedMessage);
                                return InitiateCmSyncViewModel.getOkButton();
                            },
                            function(inititateCmSyncOkButton) {
                                expect(inititateCmSyncOkButton.textContent).to.equal('OK');
                                inititateCmSyncOkButton.click();
                            }
                        ], done);
                    });
                });
            });
        });

    });
});
