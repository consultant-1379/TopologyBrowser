define([
    'topologybrowser/TopologyBrowser',
    'jscore/ext/net',
    'webpush/main',
    'networkobjectlib/utils/customError',
    'networkobjectlib/AttributesRegion',
    'networkobjectlib/TopologyTree',
    'topologybrowser/widgets/Supervision/SupervisionWidget',
    'jscore/core',
    'container/api',
    'widgets/Dialog',
    'widgets/Notification',
    'jscore/ext/locationController',
    'i18n!topologybrowser/app.json',
    'networkobjectlib/utils/AccessControl',
    'networkobjectlib/utils/TopologyUtility',
    'topologybrowser/utils/Rest',
    'topologybrowser/utils/Utils'
], function(TopologyBrowser, net, WebPush, customError, SelectedNodeProperties, TopologyTree, Supervision, core, container, Dialog, Notification, locationController, i18n, AccessControl, TopologyUtility, Rest, Utils) {
    'use strict';

    describe('TopologyBrowser', function() {

        var topologyBrowser,
            mockContext,
            sandbox,
            eventBusStub,
            containerEventBusStub,
            viewStub,
            navigationDivProto,
            topologyTreeDivProto;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            topologyBrowser = new TopologyBrowser();

            //Mock SelectedNodeProperties
            topologyBrowser.selectedNodeProperties= new SelectedNodeProperties(topologyBrowser.getContext());

            // fake server
            this.xhr = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];

            this.xhr.onCreate = function(xhr) {
                requests.push(xhr);
            };

            //Mock Context For Event Bus
            mockContext = new core.AppContext();
            sandbox.stub(topologyBrowser, 'getContext', function() {
                return mockContext;
            });

            // WebPush stub
            sandbox.stub(WebPush, 'subscribe');

            //EventBusStub
            eventBusStub = sinon.createStubInstance(core.EventBus);
            mockContext.eventBus = eventBusStub;
            sandbox.stub(topologyBrowser, 'getEventBus', function() {
                return eventBusStub;
            });
            container.getEventBus().subscribe('container:loader', function() {
                var div = topologyTreeDivProto.find('.eaContainer-Spinner');
                if (div)
                    { div.setStyle('opacity', '1'); }
            }.bind(this));
            container.getEventBus().subscribe('container:loader-hide', function() {
                var div = topologyTreeDivProto.find('.eaContainer-Spinner');
                if (div)
                    { div.setStyle('opacity', '0'); }
            }.bind(this));

            //Mock the element
            navigationDivProto = new core.Element('navigationDiv');
            viewStub = {
                getNavigation: function() {
                    return navigationDivProto;
                },
                getSelectedTopologyText: function() {
                    return 'Network Data';
                },
                setMainViewStyle: function() {
                    return true;
                }
            };
            topologyBrowser.view = viewStub;

            // Mock username
            sandbox.stub(Utils, 'getCurrentUser').returns('username');
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();

        });

        it('TopologyBrowser should be defined', function() {
            expect(TopologyBrowser).not.to.be.undefined;
        });

        describe('onStart()',function() {
            it('should initialize the TopologyBrowser correctly', function(done) {
                sandbox.stub(topologyBrowser, 'createNewSelectedNodeRegion');
                sandbox.stub(topologyBrowser, 'createMainRegion').returns({
                    topologyVisualisation: {
                        topologyHeader: {
                            topologyDropdown: {
                                getValue: function() {
                                    return 'Network Data';
                                }
                            }
                        }
                    }
                });
                sandbox.spy(topologyBrowser, 'createLocationController');
                sandbox.stub(topologyBrowser, 'subscribeToEvents');
                sandbox.stub(topologyBrowser, 'addNavLayout');
                sandbox.stub(AccessControl.prototype, 'getResources', function() {
                    return Promise.resolve();
                });
                sandbox.stub(AccessControl.prototype, 'isAllowed');

                //ACT
                topologyBrowser.onStart();

                //verify that the sub methods are called once
                setTimeout(function() {
                    //verify that the sub methods are called once
                    //Because of 'getResources' asynchronous call we will call a timeout
                    expect(topologyBrowser.createNewSelectedNodeRegion.callCount).to.equal(1);
                    expect(topologyBrowser.createMainRegion.callCount).to.equal(1);
                    expect(topologyBrowser.createLocationController.callCount).to.equal(1);
                    expect(topologyBrowser.subscribeToEvents.callCount).to.equal(1);
                    expect(topologyBrowser.addNavLayout.callCount).to.equal(1);
                    done();
                });
            });
            it('verify that the correct number of parameters are passed into the inner methods', function(done) {
                sandbox.stub(topologyBrowser, 'createNewSelectedNodeRegion');
                sandbox.stub(topologyBrowser, 'createMainRegion').returns({
                    topologyVisualisation: {
                        topologyHeader: {
                            topologyDropdown: {
                                getValue: function() {
                                    return 'Network Data';
                                }
                            }
                        }
                    }
                });
                sandbox.spy(topologyBrowser, 'createLocationController');
                sandbox.stub(topologyBrowser, 'subscribeToEvents');
                sandbox.stub(topologyBrowser, 'addNavLayout');
                sandbox.stub(AccessControl.prototype, 'getResources', function() {
                    return Promise.resolve();
                });
                sandbox.stub(AccessControl.prototype, 'isAllowed');

                //ACT
                topologyBrowser.onStart();

                setTimeout(function() {
                    //verify that the sub methods are called once
                    expect(topologyBrowser.createNewSelectedNodeRegion.getCall(0).args.length).to.equal(0);
                    expect(topologyBrowser.createMainRegion.getCall(0).args.length).to.equal(0);
                    expect(topologyBrowser.createLocationController.getCall(0).args.length).to.equal(0);
                    expect(topologyBrowser.subscribeToEvents.getCall(0).args.length).to.equal(0);
                    done();
                });
            });
        });

        describe('handleWebPushEvent', function() {
            [
                {
                    message: 'should show the notification toast after enabling node supervision',
                    USER_NAME: 'administrator',
                    STATUS: 'SUCCESS',
                    ACTION: 'ENABLE',
                    notification: 'New notifications found. Please open the Notification panel to view the updates'
                },
                {
                    message: 'should show the notification toast when disable supervision of node is in progress',
                    USER_NAME: 'administrator',
                    STATUS: 'IN PROGRESS',
                    ACTION: 'DISABLE',
                    notification: 'New notifications found. Please open the Notification panel to view the updates'
                },
                {
                    message: 'should show the notification toast when supervision of node disabled',
                    USER_NAME: 'administrator',
                    STATUS: 'SUCCESS',
                    ACTION: 'DISABLE',
                    notification: 'New notifications found. Please open the Notification panel to view the updates'
                },
                {
                    message: 'should handle fail web push event',
                    USER_NAME: 'administrator',
                    STATUS: 'FAIL',
                    ACTION: 'DISABLE',
                    notification: 'New notifications found. Please open the Notification panel to view the updates'
                }
            ].forEach(function(testCase) {
                it(testCase.message, function() {
                    var payload = {
                        USER_NAME: testCase.USER_NAME,
                        STATUS: testCase.STATUS,
                        ACTION: testCase.ACTION
                    };
                    topologyBrowser.supervisionToast = {
                        destroy: sinon.spy()
                    };
                    var handleWebPushEventSpy = sinon.spy(topologyBrowser, 'handleWebPushEvent');
                    var showToastForOperationSpy = sinon.spy(topologyBrowser, 'showToastForOperation');
                    topologyBrowser.userName = 'administrator';
                    topologyBrowser.handleWebPushEvent(payload);
                    expect(handleWebPushEventSpy.calledOnce).to.be.true;
                    expect(handleWebPushEventSpy.calledWithExactly(payload)).to.be.true;
                    expect(showToastForOperationSpy.calledOnce).to.be.true;
                    expect(showToastForOperationSpy.calledWithExactly(testCase.notification, true, topologyBrowser.getElement())).to.be.true;
                });
            });
        });

        describe('initApp()',function() {
            it('should initialize the TopologyBrowser correctly', function(done) {
                topologyBrowser.locationController={};
                sandbox.stub(topologyBrowser.locationController);
                sandbox.stub(topologyBrowser, 'updateActionBar');
                topologyBrowser.locationController={ start: function() {}};
                sandbox.stub(topologyBrowser.locationController);
                sandbox.stub(topologyBrowser, 'subscribeToEvents');
                sandbox.stub(topologyBrowser, 'onActionSuccessCallBack');
                expect(topologyBrowser.launcherUtils).to.be.undefined;

                //ACT
                topologyBrowser.initApp();

                //verify that the sub methods are called once
                expect(topologyBrowser.updateActionBar.callCount).to.equal(1);
                expect(topologyBrowser.subscribeToEvents.callCount).to.equal(1);
                expect(topologyBrowser.launcherUtils).to.be.defined;
                done();
                // });
            });
        });

        describe('subscribeToEvents()',function() {
            it('should subscribe to setLocation and nodeSelectedEvent ',function() {
                //act
                topologyBrowser.subscribeToEvents();

                expect(topologyBrowser.getEventBus().subscribe.calledWith('attributesRegion:save:success')).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.calledWith('topologyTree:object:select')).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.calledWith('layouts:rightpanel:afterchange')).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.calledWith('topologyTree:fetch:subtree:error:closed')).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.calledWith('topologyTree:contextMenu:show')).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.calledWith('layouts:panelaction')).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.calledWith('supervision:resultCell:removeCell')).to.equal(true);

            });

            it('verify call order and also that the parameters passed into the methods are valid',function() {

                var savedAttributeChangeEventName = 'attributesRegion:save:success';
                var onNodeSelectEvent = 'topologyTree:object:select';

                //act
                topologyBrowser.subscribeToEvents();

                //verify call order
                expect(topologyBrowser.getEventBus().subscribe.getCall(0).calledWith(
                    savedAttributeChangeEventName)).to.equal(true);
                expect(topologyBrowser.getEventBus().subscribe.getCall(1).calledWith(
                    onNodeSelectEvent)).to.equal(true);
            });

        });

        describe('setLocation()', function() {
            beforeEach(function() {
                topologyBrowser.locationController = sinon.createStubInstance(locationController);
            });

            it('should set location to poid and change previousPoid', function() {
                var poid = '12345';

                topologyBrowser.setLocation({poid: poid});

                expect(topologyBrowser.locationController.setLocation.calledWith('topologybrowser?poid='+poid, false, false)).to.equal(true);
                expect(topologyBrowser.previousPoid).to.be.equal(poid);
            });

            it('should set location to poid without changing previous poid', function() {
                var previousPoid = '123';
                var poid = '12345';

                topologyBrowser.previousPoid = previousPoid;
                topologyBrowser.setLocation({poid: poid}, true, true);

                expect(topologyBrowser.locationController.setLocation.calledWith('topologybrowser?poid='+poid, true, true)).to.equal(true);
                expect(topologyBrowser.previousPoid).to.be.equal(previousPoid);
            });

            it('should set location to topologybrowser with no poid parameter if poid undefined', function() {
                topologyBrowser.setLocation();

                expect(topologyBrowser.locationController.setLocation.calledWith('topologybrowser', false, false)).to.equal(true);
            });

            it('should set location to topology and change previousTopology', function() {
                //Arange
                var topology = '12345';

                //Action
                topologyBrowser.setLocation({topology: topology});

                //Assert
                expect(topologyBrowser.locationController.setLocation.calledWith('topologybrowser?topology=' + topology, false, false)).to.equal(true);
                expect(topologyBrowser.previousTopology).to.be.equal(topology);
            });

            it('should set location to topology without changing previous topology ', function() {
                var previousTopology = '123';
                var topology = '12345';

                topologyBrowser.previousTopology = previousTopology;
                topologyBrowser.setLocation({topology: topology}, true, true);

                expect(topologyBrowser.locationController.setLocation.calledWith('topologybrowser?topology=' + topology, true, true)).to.equal(true);
                expect(topologyBrowser.previousTopology).to.be.equal(previousTopology);
            });

            it('should set location to poid when topology is networkData', function() {
                var previousTopology = '123';
                var previousPoid = '456';
                var topology = 'networkData';
                var poid = '987';

                topologyBrowser.previousPoid = previousPoid;
                topologyBrowser.previousTopology = previousTopology;
                topologyBrowser.setLocation({topology: topology, poid: poid}, true, true);

                expect(topologyBrowser.locationController.setLocation.calledWith('topologybrowser?poid=' + poid, true, true)).to.equal(true);
                expect(topologyBrowser.previousTopology).to.be.equal(previousTopology);
                expect(topologyBrowser.previousPoid).to.be.equal(previousPoid);
            });
        });

        describe('launchNetworkExplorer()', function() {
            afterEach(function() {
                location.hash = '#';
            });

            it('should launch Network Explorer with correct URL and parameters ', function() {
                // ARRANGE
                var expectedNetworkExplorerLink = '#networkexplorer/?goto=topologybrowser?poid=562949953883465&returnType=singleObject';

                var getTopologyBrowserGotoParams = 'topologybrowser?poid=562949953883465';
                var getTopologyBrowserSingleSelectionParams = '&returnType=singleObject';

                sandbox.stub(topologyBrowser, 'getTopologyBrowserSingleSelectionParams', function() {
                    return getTopologyBrowserSingleSelectionParams;
                });
                sandbox.stub(topologyBrowser, 'getTopologyBrowserGotoParams', function() {
                    return getTopologyBrowserGotoParams;
                });

                topologyBrowser.currentTopology = 'networkData';

                //ACT
                topologyBrowser.launchNetworkExplorer();
                var locationchange = decodeURIComponent(location.hash);

                //ASSERT
                expect(locationchange).to.equal(expectedNetworkExplorerLink);

            });
        });

        describe('getTopologyBrowserGotoParams()', function() {
            it('getTopologyBrowserGotoParams should return goto parameter of url', function() {
                // ARRANGE
                var hashLocation = '#topologybrowser?poid=562949953883465';
                var getTopologyBrowserGotoParams = 'topologybrowser%3Fpoid%3D562949953883465';

                //ACT
                var returnHash = topologyBrowser.getTopologyBrowserGotoParams(hashLocation);

                //ASSERT
                expect(returnHash).to.equal(getTopologyBrowserGotoParams);
            });
        });

        describe('getTopologyBrowserSingleSelectionParams()', function() {
            it('getTopologyBrowserSingleSelectionParams should append url with singleSelection parameter', function() {
                // ARRANGE
                var getTopologyBrowserSingleSelectionParams = '#topologybrowser?poid=562949953883465&returnType=singleObject';

                //ACT
                var returnHash = '#topologybrowser?poid=562949953883465' + topologyBrowser.getTopologyBrowserSingleSelectionParams();

                //ASSERT
                expect(returnHash).to.equal(getTopologyBrowserSingleSelectionParams);
            });
        });

        describe('isValidPoId()', function() {
            it('It should return if the poid is valid', function() {
                //ASSERT
                expect(topologyBrowser.isValidPoId('abc')).to.equal(false);
                expect(topologyBrowser.isValidPoId(123)).to.equal(true);
                expect(topologyBrowser.isValidPoId(null)).to.equal(false);
            });
        });

        describe('isRootPoId()', function() {

            it('should return if the poid is valid', function() {
                //ASSERT
                expect(topologyBrowser.isRootPoId(null)).to.equal(true);
                expect(topologyBrowser.isRootPoId('')).to.equal(true);
                expect(topologyBrowser.isRootPoId()).to.equal(true);
                expect(topologyBrowser.isRootPoId(123)).to.equal(false);
                expect(topologyBrowser.isRootPoId('abc')).to.equal(false);
            });
        });

        /*
         * This tast case is related to a new widget and move or redraw is in planning but formal test of this
         * feature is wanted and necessary to grant integrity of application now.
         */

        describe('onLocationChange()', function() {
            beforeEach(function() {
                topologyBrowser.onStart();

                sandbox.stub(topologyBrowser, 'getPoidFromLaunchContext');
                sandbox.stub(topologyBrowser, 'getLaunchContextIdParam');
                sandbox.spy(topologyBrowser, 'isValidPoId');
                sandbox.stub(topologyBrowser, 'showErrorMessage');
            });

            it('should load tree if poid is valid', function() {
                //ARRANGE
                var expectedPoId = '123';
                var hash = '?poid=' + expectedPoId;
                var expected =                 {
                    select: 'networkData',
                    poid: expectedPoId
                };

                //ACT
                topologyBrowser.onLocationChange(hash);

                //ASSERT
                expect(topologyBrowser.poidParam).to.equal('123');
                expect(topologyBrowser.isValidPoId.callCount).to.equal(1);
                expect(topologyBrowser.getEventBus().publish.calledWith('topologyHeader:topologyDropdown:change', expected)).to.be.true;
            });

            it('should show error if poid is invalid', function(done) {
                //ARRANGE
                var expectedPoId = ' abc';
                var hash = '?poid=' + expectedPoId;

                //ACT
                topologyBrowser.onLocationChange(hash);

                //ASSERT
                expect(topologyBrowser.isValidPoId.callCount).to.equal(1);
                expect(topologyBrowser.isValidPoId.firstCall.returnValue).to.equal(false);

                setTimeout(function() {
                    expect(topologyBrowser.showErrorMessage.callCount).to.equal(1);
                    expect(topologyBrowser.showErrorMessage.getCall(0).args[0]).to.be.instanceof(customError.NetworkObjectNotFound);
                    done();
                }, 120);
            });

            it('should call handleLocationChange without any poid', function() {
                //ACT
                topologyBrowser.onLocationChange();

                //ASSERT
                expect(topologyBrowser.isValidPoId.callCount).to.equal(1);
            });

            it('should call getPoidFromLaunchContext and getLaunchContextIdParam if hash has has launchContextId', function() {
                //ARRANGE
                var hash = 'hash';
                var isValidLaunchContextId = true;

                sandbox.stub(topologyBrowser, 'isValidLaunchContextId', function() {
                    return isValidLaunchContextId;
                });

                //ACT
                topologyBrowser.onLocationChange(hash);

                //ASSERT
                expect(topologyBrowser.getPoidFromLaunchContext.callCount).to.equal(1);
                expect(topologyBrowser.getLaunchContextIdParam.callCount).to.equal(1);
                expect(topologyBrowser.getLaunchContextIdParam.getCall(0).calledWith(hash)).to.equal(true);
            });

            it('should load tree if topology is valid', function() {
                //ARRANGE
                var expectedTopology = '123';
                var hash = '?topology=' + expectedTopology;
                var topologyState;
                var expected =  { topologyState: topologyState, select: expectedTopology };

                //ACT
                topologyBrowser.onLocationChange(hash);

                //ASSERT
                expect(topologyBrowser.topologyParam).to.equal(expectedTopology);
                expect(topologyBrowser.isValidPoId.callCount).to.equal(1);
                expect(topologyBrowser.getEventBus().publish.calledWith('topologyHeader:topologyDropdown:change', expected)).to.be.false;
            });

            it('should show error if topology is invalid', function(done) {
                //ARRANGE
                var expectedTopology = ' abc';
                var hash = '?topology=' + expectedTopology;

                //ACT
                topologyBrowser.onLocationChange(hash);

                //ASSERT
                expect(topologyBrowser.isValidPoId.callCount).to.equal(1);
                expect(topologyBrowser.isValidPoId.firstCall.returnValue).to.equal(false);

                setTimeout(function() {
                    expect(topologyBrowser.showErrorMessage.callCount).to.equal(1);
                    expect(topologyBrowser.showErrorMessage.getCall(0).args[0]).to.be.instanceof(customError.NetworkObjectNotFound);
                    done();
                }, 120);
            });

            it('should show warning dialog when changing url from custom topology to network data', function() {
                //ARRANGE
                var expectedPoid = '123';
                var hash = '?poid=' + expectedPoid;
                topologyBrowser.currentTopology = 'topology';
                sandbox.spy(TopologyUtility, 'createDialog');

                //ACT
                topologyBrowser.onLocationChange(hash);

                //ASSERT
                expect(TopologyUtility.createDialog.callCount).to.equal(1);
            });
        });

        describe('getPOIdParam()', function() {
            it('should return the poid param if there is a poid in the hash', function() {
                // ACT
                var poidParam1 = topologyBrowser.getPOIdParam('#topologybrowser?poid=12345');
                var poidParam2 = topologyBrowser.getPOIdParam('#topologybrowser?poid=12345&test=1');
                var poidParam3 = topologyBrowser.getPOIdParam('#topologybrowser?teste=1&poid=12345');
                var poidParam4 = topologyBrowser.getPOIdParam('#topologybrowser?poid=12345&poid=67890');

                // ASSERT
                expect(poidParam1).to.equal('12345');
                expect(poidParam2).to.equal('12345');
                expect(poidParam3).to.equal('12345');
                expect(poidParam4).to.equal('12345');
            });
            it('should return null if there is no poid in the hash', function() {
                // ACT
                var poidParam1 = topologyBrowser.getPOIdParam('#topologybrowser?randomParameter=12345');
                var poidParam2 = topologyBrowser.getPOIdParam('#topologybrowser#poid=12345');

                // ASSERT
                expect(poidParam1).to.equal(undefined);
                expect(poidParam2).to.equal(undefined);
            });
        });

        describe('getLaunchContextIdParam()', function() {
            it('should return the launchContextId param if there is a launchContextId in the hash', function() {
                // ACT
                var launchContextIdParam1 = topologyBrowser.getLaunchContextIdParam('#topologybrowser?launchContextId=12345');
                var launchContextIdParam2 = topologyBrowser.getLaunchContextIdParam('#topologybrowser?launchContextId=12345&test=1');
                var launchContextIdParam3 = topologyBrowser.getLaunchContextIdParam('#topologybrowser?teste=1&launchContextId=12345');
                var launchContextIdParam4 = topologyBrowser.getLaunchContextIdParam('#topologybrowser?launchContextId=12345&launchContextId=67890');

                // ASSERT
                expect(launchContextIdParam1).to.equal('12345');
                expect(launchContextIdParam2).to.equal('12345');
                expect(launchContextIdParam3).to.equal('12345');
                expect(launchContextIdParam4).to.equal('12345');
            });
            it('should return null if there is no launchContextId in the hash', function() {
                // ACT
                var launchContextIdParam1 = topologyBrowser.getLaunchContextIdParam('#topologybrowser?randomParameter=12345');
                var launchContextIdParam2 = topologyBrowser.getLaunchContextIdParam('#topologybrowser#launchContextId=12345');

                // ASSERT
                expect(launchContextIdParam1).to.equal(null);
                expect(launchContextIdParam2).to.equal(null);
            });
        });

        describe('handleAttributeChange()', function() {

            var sandbox ;

            beforeEach(function() {

                sandbox = sinon.sandbox.create();
            });

            afterEach(function() {

                sandbox.restore();
            });

            it('should show notification with Success',function() {
                var data = {
                    attributes: []
                };
                sandbox.stub(Notification.prototype, 'init');
                sandbox.stub(Notification.prototype, 'attachTo');
                sandbox.spy(topologyBrowser, 'getElement');

                //test execution
                topologyBrowser.handleAttributeChange(data);

                //Assertion
                expect(Notification.prototype.init.callCount).to.equal(1);
                expect(Notification.prototype.attachTo.getCall(0).calledWith(topologyBrowser.getElement())).to.equal(true);
                expect(Notification.prototype.attachTo.getCall(0).thisValue.options.content).to.equal('success');
            });

        });

        describe('onNodeSelect()', function() {
            beforeEach(function() {
                sandbox.stub(topologyBrowser, 'setLocation');
                sandbox.stub(topologyBrowser, 'updateActionBar');
            });

            it('should select a clicked node',function() {
                topologyBrowser.onNodeSelect({
                    networkObjects: [{id: '2'}],
                    nestedCollections: [],
                    lastSelectedObject: {id: '2'}
                });
                expect(topologyBrowser.getEventBus.callCount).to.equal(1);
                expect(topologyBrowser.setLocation.callCount).to.equal(1);
            });

            it('should update/hide action bar context',function() {
                topologyBrowser.previousPoid = '10';
                topologyBrowser.topologyFDN = { pathWidget: { setText: function() { return true; }}};

                var objects = [
                    { id: '1', type: 'a', neType: 'a'},
                    { id: '2', type: 'b', neType: 'b' }
                ];
                var objects2 = [];

                topologyBrowser.onNodeSelect({
                    networkObjects: objects,
                    nestedCollections: []
                });
                topologyBrowser.onNodeSelect({
                    networkObjects: objects2,
                    nestedCollections: []
                });
                expect(topologyBrowser.updateActionBar.callCount).to.equal(2);
            });

            it('should select a collection root',function() {
                topologyBrowser.onNodeSelect({
                    networkObjects: [{id: '2', parentId: null, type: 'BRANCH', parents: []}],
                    nestedCollections: [],
                    lastSelectedObject: {id: '2', parentId: null, type: 'BRANCH', parents: []}
                });
                // expect(topologyBrowser.poidParam).to.equal('2');
                //should load the collection details panel in attribute panel
                expect(topologyBrowser.getEventBus.callCount).to.equal(1);
                //should not change location
                //TODO this may change after location change
                expect(topologyBrowser.setLocation.callCount).to.equal(1);
                //should update action bar
                expect(topologyBrowser.updateActionBar.callCount).to.equal(1);
            });

        });

        describe('updateActionBar', function() {
            beforeEach(function(done) {
                sandbox.stub(AccessControl.prototype, 'getResources', function() {
                    return Promise.resolve();
                });
                sandbox.stub(AccessControl.prototype, 'isAllowed');

                topologyBrowser.onStart();
                setTimeout(function() {
                    sandbox.stub(topologyBrowser.launcherUtils, 'createLauncherAction', function() {
                        return Promise.resolve([{name: i18n.actionSearchWithNetworkExplorer},
                                {type: 'separator'},
                                {name: 'Locate in Topology'}
                        ]
                        );
                    });
                    done();
                });
            });

            it('should update action bar with available actions',function() {
                sandbox.spy(topologyBrowser, 'updateActionBar');
                var objects = [
                        { id: '1', type: 'a', neType: 'a'}
                ];

                topologyBrowser.updateActionBar(objects);
                expect(topologyBrowser.launcherUtils.createLauncherAction.callCount).to.equal(1);
            });

            it('should not update action bar when no objects are passed',function() {
                sandbox.spy(topologyBrowser, 'updateActionBar');

                topologyBrowser.updateActionBar();
                expect(topologyBrowser.launcherUtils.createLauncherAction.callCount).to.equal(0);
            });
        });

        describe('onContextMenu()', function() {
            it('should display context menu immediately if actions do not need to be fetched',function() {
                // ARRANGE
                sandbox.stub(topologyBrowser, 'displayContextMenu');
                // ACT
                topologyBrowser.onContextMenu('event', false);
                // ASSERT
                expect(topologyBrowser.contextMenuEvent).to.equal('event');
                expect(topologyBrowser.displayContextMenu.callCount).to.equal(1);
            });
            it('should not show context menu if actions need to be fetched',function() {
                // ARRANGE
                sandbox.stub(topologyBrowser, 'displayContextMenu');
                // ACT
                topologyBrowser.onContextMenu('event', true);
                // ASSERT
                expect(topologyBrowser.contextMenuEvent).to.equal('event');
                expect(topologyBrowser.displayContextMenu.callCount).to.equal(0);
            });
        });

        describe('displayContextMenu()', function() {
            beforeEach(function() {
                containerEventBusStub = sinon.createStubInstance(core.EventBus);
                sandbox.stub(container, 'getEventBus', function() {
                    return containerEventBusStub;
                });
            });
            it('do not show actions in context menu if a right click event is not present',function() {
                // ARRANGE
                var actions = [{}];
                topologyBrowser.contextMenuEvent = undefined;

                // ACT
                topologyBrowser.displayContextMenu(actions);

                // ASSERT
                expect(topologyBrowser.contextMenuEvent).to.equal(undefined);
                expect(container.getEventBus().publish.callCount).to.equal(0);
            });
            it('do not show actions in context menu if no actions are present',function() {
                // ARRANGE
                var actions = [];
                topologyBrowser.contextMenuEvent = 'e';

                // ACT
                topologyBrowser.displayContextMenu(actions);

                // ASSERT
                expect(topologyBrowser.contextMenuEvent).to.equal(undefined);
                expect(container.getEventBus().publish.callCount).to.equal(0);
            });
            it('show actions in context menu if a right click event is present',function() {
                // ARRANGE
                var actions = {
                    contextMenuActions: ['']
                };
                topologyBrowser.contextMenuEvent = 'e';

                // ACT
                topologyBrowser.displayContextMenu(actions);

                // ASSERT
                expect(topologyBrowser.contextMenuEvent).to.equal(undefined);
                expect(container.getEventBus().publish.callCount).to.equal(1);
            });
        });

        describe('showActionsErrorDialog()', function() {
            it('should show actions error dialog and hide context menu if actions cannot be fetched',function() {
                // ARRANGE
                var hideContextMenuEvent = false;
                sandbox.stub(Dialog.prototype, 'show');
                container.getEventBus().subscribe('contextmenu:hide', function() {
                    hideContextMenuEvent = true;
                });

                // ACT
                topologyBrowser.showActionsErrorDialog();

                // ASSERT
                expect(Dialog.prototype.show.callCount).to.equal(1);
                expect(hideContextMenuEvent).to.equal(true);
            });
        });

        describe('openTopologyFDN()', function() {
            it('should create and show the Topology FDN',function() {
                // ARRANGE
                topologyBrowser.currentFDN = 'LTE001';

                // ACT
                topologyBrowser.openTopologyFDN();

                // ASSERT
                expect(topologyBrowser.topologyFDN).to.exist;
                expect(topologyBrowser.topologyFDN.pathWidget.text).to.equal(topologyBrowser.currentFDN);
            });
        });

        describe('updateCurrentFDN()', function() {
            it('should record the latest FDN selected',function() {
                // ARRANGE
                var currentFDN = 'LTE002';
                var previousFDN = 'LTE001';
                topologyBrowser.currentFDN = previousFDN;

                // ACT
                topologyBrowser.updateCurrentFDN(currentFDN);

                // ASSERT
                expect(topologyBrowser.currentFDN).to.not.equal(previousFDN);
                expect(topologyBrowser.currentFDN).to.equal(currentFDN);
            });
        });

        describe('handleNotificationPanel', function() {
            it('should publish a flyout:show event if the event is supervision', function() {
                // Setup
                containerEventBusStub = {
                    publish: sandbox.stub()
                };
                topologyBrowser.mainRegion = {
                    topologyVisualisation: {
                        topologyHeader: {
                            topologyDropdown: {
                                getValue: function() {
                                    return 'Transport topology';
                                }
                            }
                        }
                    }
                };
                var getNotificationsStub = sandbox.stub(topologyBrowser, 'getNotifications');
                topologyBrowser.supervisionWidget = {mockWidget: 'widget'};
                sandbox.stub(container, 'getEventBus').returns(containerEventBusStub);


                // Run
                topologyBrowser.handleNotificationPanel('Supervisions');


                // Assert
                expect(getNotificationsStub.called).to.be.true;
                expect(containerEventBusStub.publish.calledOnce).to.be.true;
                expect(containerEventBusStub.publish.getCall(0).args).to.deep.equal(['flyout:show', {
                    header: 'Notifications',
                    content: topologyBrowser.supervisionWidget
                }]);
            });

            it('should not publish an event if event is not supervision', function() {
                // Setup
                containerEventBusStub = {
                    publish: sandbox.stub()
                };
                var getNotificationsStub = sandbox.stub(topologyBrowser, 'getNotifications');
                topologyBrowser.supervisionWidget = { mockWidget: 'widget' };
                sandbox.stub(container, 'getEventBus').returns(containerEventBusStub);


                // Run
                topologyBrowser.handleNotificationPanel('somethingElse');


                // Assert
                expect(getNotificationsStub.called).to.be.true;
                expect(containerEventBusStub.publish.calledOnce).to.be.false;
            });
        });

        describe('getNotifications', function() {
            it('should call the rest endpoint', function() {
                // Setup
                var fetchNotificationsStub = sandbox.stub(Rest, 'fetchNotifications', function() {
                    return Promise.resolve({
                        message: ''
                    });
                });

                // Act
                topologyBrowser.getNotifications();

                // Assert
                expect(fetchNotificationsStub.calledOnce).to.be.true;
            });

            it('should publish a supervision:setWebPushData event with the data from the rest call', function(done) {
                // Setup
                var res = {
                    message: {
                        'START_TIME': 1658484259,
                        'NodeName': 'Transport42ML04',
                        'USER_NAME': 'administrator',
                        'STATUS': 'SUCCESS',
                        'ACTION': 'ENABLE',
                        'InventorySupervision': true,
                        'PROGRESS': 100,
                        'ConfigurationManagementSupervision': true,
                        'PerformanceSupervision': true,
                        'CURRENT_TIME': 1658484259,
                        'FaultManagementSupervision': true,
                        'POID': 108080
                    }
                };
                sandbox.stub(Rest, 'fetchNotifications', function() {
                    return Promise.resolve(res);
                });

                // Run
                topologyBrowser.getNotifications().then(function() {
                    // Expect
                    expect(topologyBrowser.getEventBus().publish.getCall(1).args).to.deep.equal(['supervision:setWebPushData', [res.message]]);
                    done();
                });
            });

            it('should add an error to the object if the request returns a fail message', function(done) {
                // Setup
                var res = {
                    message: {
                        'START_TIME': 1658484259,
                        'NodeName': 'Transport42ML04',
                        'USER_NAME': 'administrator',
                        'STATUS': 'FAIL',
                        'ACTION': 'ENABLE',
                        'InventorySupervision': true,
                        'PROGRESS': 100,
                        'ConfigurationManagementSupervision': true,
                        'PerformanceSupervision': true,
                        'CURRENT_TIME': 1658484259,
                        'FaultManagementSupervision': true,
                        'POID': 108080
                    }
                };
                sandbox.stub(Rest, 'fetchNotifications', function() {
                    return Promise.resolve(res);
                });

                // Run
                topologyBrowser.getNotifications().then(function() {
                    // Expect
                    expect(topologyBrowser.getEventBus().publish.getCall(1).args[1][0].ERROR).to.eql('Operation Timed out, please try again');
                    done();
                });

            });

            it('should publish a supervision:hideLoader event on REST call failure', function(done) {
                // Setup
                var error = {
                    message: 'Failed to fetch notifications',
                    body: 'Test body'
                };
                sandbox.stub(Rest, 'fetchNotifications', function() {
                    return Promise.reject(error);
                });
                
                var showDialogSpy = sandbox.spy(Utils, 'showDialog');
              
                // Act
                topologyBrowser.getNotifications()
                    .then(function(err) {
                        // Expect
                        expect(topologyBrowser.getEventBus().publish.callCount).to.eql(2);
                        expect(topologyBrowser.getEventBus().publish.calledWith('supervision:hideLoader')).to.be.true;
                        expect(showDialogSpy.callCount).to.eql(1);
                        expect(showDialogSpy.calledWith('error', error.message, error.body)).to.be.true;
                        done();
                    });
            });
              
        });

        describe('removeRow', function() {
            it('should call the removeRowData from the supervision', function() {
                // Setup
                topologyBrowser.supervisionWidget = new Supervision({
                    eventbus: eventBusStub
                });
                var removeRowDataStub = sandbox.stub(topologyBrowser.supervisionWidget, 'removeRowData');
                var data = ['', 1];

                // Act
                topologyBrowser.removeRow(data);

                // Assert
                expect(removeRowDataStub.calledOnce).to.be.true;
                expect(removeRowDataStub.calledWith(data)).to.be.true;
            });
        });
    });
});
