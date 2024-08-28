/* eslint-disable no-unused-vars */
/* global beforeEach, Promise*/
define([
    'jscore/core',
    'test/resources/BitUtils',
    'networkobjectlib/regions/topologyHeader/TopologyHeader',
    'networkobjectlib/regions/topologyHeader/Rest',
    'networkobjectlib/utils/UserSettings',
    'widgets/SelectBox'
], function(core, BitUtils, TopologyHeader, Rest, UserSettings, SelectBox) {
    'use strict';

    describe('regions/TopologyHeader', function() {
        var sandbox, app, content, classUnderTest;

        beforeEach(function() {
            // create sandbox with fake server and auto respond to requests
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            // create app
            app = new core.App();
            app.start(new core.Element());

            // create div to hold the region
            content = new core.Element();
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);

            // create region
            classUnderTest = new TopologyHeader({
                context: app.getContext(),
                showTopology: true,
                showSearchNodeIcon: true
            });
            classUnderTest.start(content);
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });

        it('TopologyHeader should be defined', function() {
            expect(TopologyHeader).not.to.be.undefined;
        });

        it('checks the default content of SelectBox has been set as expected', function(done) {
            expect(classUnderTest.topologyDropdown.getValue().name).to.equal('Network Data');
            expect(classUnderTest.topologyDropdown.getValue().value).to.equal('networkData');
            done();
        });

        describe('onStart()', function() {
            it('Should initiate Topology Header', function(done) {
                //Assemble
                sandbox.spy(classUnderTest.view, 'getLinebar');
                //Act
                classUnderTest.onStart();

                //Assert
                expect(classUnderTest.topologyDropdown).not.to.be.undefined;
                expect(classUnderTest.view.getDropdown().getNative().children[0].className).to.equal('ebSelect');
                expect(classUnderTest.view.getLinebar.called).to.be.true;
                done();
            });

            [
                {
                    scenario: 'save the dropdown settings when a click event is triggered and the selected value is not newCustomTopology',
                    selected: {
                        value: 'networkData'
                    },
                    saveDropdownSettingsCallCount: 1
                },
                {
                    scenario: 'not save the user settings when a click event is triggered and the selected value is newCustomTopology',
                    selected: {
                        value: 'newCustomTopology',
                    },
                    saveDropdownSettingsCallCount: 0
                }
            ].forEach(function(testData) {
                it('should ' + testData.scenario, function(done) {
                    //Assemble
                    sandbox.stub(classUnderTest.topologyDropdown, 'getValue').returns(testData.selected);
                    sandbox.spy(classUnderTest.getEventBus(), 'publish');
                    sandbox.spy(UserSettings, 'saveDropdownSettings');

                    //Act
                    classUnderTest.topologyDropdown.trigger('change');

                    //Assert
                    expect(classUnderTest.getEventBus().publish.callCount).to.equal(1);
                    expect(UserSettings.saveDropdownSettings.callCount).to.eql(testData.saveDropdownSettingsCallCount);
                    done();
                });
            });
        });

        describe('changeDropdown', function() {
            var data = {
                select: 'networkData',
                poid: '1000',
                topologyState: {}
            };

            var settingsData = {
                id: 'dropdownSettings',
                value: {
                    id: '1000',
                    type: 'NetworkData'
                }
            };

            it('Should trigger "topologyHeader:topologyDropdown:changed" only for topology dropdown not set', function() {
                //Setup
                classUnderTest.options.showTopology = { showCustomTopology: true };
                sandbox.spy(classUnderTest.topologyDropdown, 'setValue');
                sandbox.spy(classUnderTest.getEventBus(), 'publish');

                //Action
                classUnderTest.getEventBus().publish('topologyHeader:topologyDropdown:change', data);

                //Assert
                expect(classUnderTest.topologyDropdown.setValue.callCount).to.equal(0);
                expect(classUnderTest.getEventBus().publish.callCount).to.equal(1);
            });

            it('Should set dropdown to "networkData" changing from none "networkData" topology where "showCustomTopology" set', function(done) {
                //Setup
                sandbox.spy(classUnderTest.topologyDropdown, 'setValue');
                sandbox.spy(classUnderTest.getEventBus(), 'publish');
                sandbox.stub(UserSettings, 'getDropdownSettings').returns(Promise.resolve(settingsData));

                //Action
                classUnderTest.getEventBus().publish('topologyHeader:topologyDropdown:change', data);

                //Assert
                setTimeout(function() {
                    expect(classUnderTest.getEventBus().publish.callCount).to.equal(2);
                    expect(classUnderTest.topologyDropdown.setValue.callCount).to.equal(1);
                    done();
                }, 100);

            });

            it('should enter the flow for loading the last saved user settings', function(done) {
                classUnderTest.options.showTopology = { showCustomTopology: true };
                sandbox.spy(classUnderTest.getEventBus(), 'publish');
                sandbox.stub(UserSettings, 'getDropdownSettings').returns(Promise.resolve({
                    id: 'dropdownSettings',
                    value: {
                        id: '4000',
                        type: 'CustomTopology'
                    }
                }));

                classUnderTest.getEventBus().publish('topologyHeader:topologyDropdown:change', {
                    select: 'networkData',
                    poid: null,
                    topologyState: {}
                });

                setTimeout(function() {
                    expect(UserSettings.getDropdownSettings.callCount).to.equal(1);
                    done();
                }, 100);

            });

            [
                {
                    scenario: 'enter the flow for loading the last opened custom topology',
                    showCustomTopology: true,
                    data: {
                        select: 'networkData',
                        poid: '1000',
                        topologyState: {}
                    },
                    publishCallCount: 1,
                    setValueCallCount: 0
                },
                {
                    scenario: 'enter the alternative flow for loading network data',
                    showCustomTopology: false,
                    data: {
                        select: 'networkData',
                        poid: '1000',
                        topologyState: {}
                    },
                    publishCallCount: 2,
                    setValueCallCount: 1
                }
            ].forEach(function(testData) {
                it('should ' + testData.scenario, function(done) {
                    classUnderTest.options.showTopology = {showCustomTopology: testData.showCustomTopology};
                    sandbox.spy(classUnderTest.getEventBus(), 'publish');
                    sandbox.spy(classUnderTest.topologyDropdown, 'setValue');
                    sandbox.stub(UserSettings, 'getDropdownSettings').returns(Promise.resolve({
                        id: 'dropdownSettings',
                        value: {
                            id: '4000',
                            type: 'CustomTopology'
                        }
                    }));

                    classUnderTest.getEventBus().publish('topologyHeader:topologyDropdown:change', {
                        select: '4000',
                        poid: null,
                        topologyState: {}
                    });

                    setTimeout(function() {
                        expect(classUnderTest.getEventBus().publish.callCount).to.eql(testData.publishCallCount);
                        expect(classUnderTest.topologyDropdown.setValue.callCount).to.eql(testData.setValueCallCount);
                        done();
                    }, 100);
                });
            });
        });

        describe('refreshButton', function() {
            beforeEach(function() {
                //Setup
                sandbox.spy(classUnderTest.view, 'getRefreshButton');
                sandbox.spy(classUnderTest.getEventBus(), 'publish');
            });

            it('Should renable button ', function() {
                //Action
                classUnderTest.getEventBus().publish('topologyTree:refreshComplete', []);
                //Assert
                expect(classUnderTest.view.getRefreshButton.called).to.be.true;
            });

            it('Should get button and publish an event ', function() {
                //Action
                classUnderTest.view.getRefreshButton().trigger('click');
                //Assert
                expect(classUnderTest.view.getRefreshButton.called).to.be.true;
                expect(classUnderTest.getEventBus().publish.callCount).to.equal(1);
            });
        });

        describe('processTopologyChange', function() {
            var data = {
                select: 'topology',
                poid: '1000',
                topologyState: {}
            };
            [
                {
                    description: 'Should select topology when process with selected topology exist',
                    items: [
                        {
                            value: 'topology',
                            name: 'Some Topology',
                            title: 'Some Topology',
                            type: 'CustomTopology'
                        },
                        {
                            value: 'other',
                            name: '12345',
                            title: '12345',
                            type: 'CustomTopology'
                        }
                    ],
                    expected: {
                        value: data.select,
                        name: 'Some Topology',
                        title: 'Some Topology',
                        type: 'CustomTopology'
                    }
                },
                {
                    description: 'Should show "Select a Topology" when process without topology',
                    items: [
                        {
                            value: 'other',
                            name: 'topology',
                            title: 'Topology',
                            type: 'CustomTopology'
                        }
                    ],
                    expected: {
                        value: data.select,
                        name: 'Select a Topology',
                        title: 'Select a Topology',
                        type: 'CustomTopology'
                    }
                }
            ].forEach(function(test) {
                it(test.description, function() {
                    //Setup
                    sandbox.spy(classUnderTest.topologyDropdown, 'setValue');
                    sandbox.spy(classUnderTest.getEventBus(), 'publish');

                    //Action
                    classUnderTest.processTopologyChange(test.items, data);

                    //Assert
                    expect(classUnderTest.getEventBus().publish.callCount).to.equal(1);
                    expect(classUnderTest.topologyDropdown.setValue.firstCall.calledWith(test.expected)).to.equal(true);


                });
            });


        });
    });


    describe('Dropdown options handle', function() {
        var _sandbox, app, content, region;
        var response = [
            {name: 'Transport Topology 1', title: 'Transport Topology 1', type: 'CustomTopology', value: '1'},
            {name: 'Transport Topology 2', title: 'Transport Topology 2', type: 'CustomTopology', value: '2'},
            {name: 'Transport Topology 3', title: 'Transport Topology 3', type: 'CustomTopology', value: '3'},
            {name: 'Transport Topology 4', title: 'Transport Topology 4', type: 'CustomTopology', value: '4'}
        ];

        beforeEach(function() {
            _sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            _sandbox.server.autoRespond = true;

            // create app
            app = new core.App();
            app.start(new core.Element());

            // create div to hold the region
            content = new core.Element();
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);
        });

        afterEach(function() {
            content.remove();
            app.stop();
            _sandbox.restore();
        });

        describe('Passing showTopology options for the Topology dropdown', function() {
            [
                {
                    visible: true,
                    text: 'should pass none options and  the Dropdown should be invisible'
                },
                {
                    showTopology: false,
                    visible: true,
                    text: 'should pass options showTopology: false and  the Dropdown should be invisible'
                },
                {
                    showTopology: true,
                    visible: true,
                    text: 'should pass options showTopology: true and  the Dropdown should be visible'
                },
                {
                    showTopology: {},
                    visible: true,
                    text: 'should pass options showTopology: {} and  the Dropdown should be visible'
                },
            ].forEach(function(test) {
                it(test.text, function(done) {
                    if (test.showTopology) {
                        //Assemble
                        region = new TopologyHeader({
                            context: app.getContext(),
                            showTopology: test.showTopology
                        });
                    } else {
                        region = new TopologyHeader({
                            context: app.getContext()
                        });
                    }
                    region.start();
                    if (test.visible === true) {
                        expect(region.topologyDropdown).not.to.be.undefined;
                    } else {
                        expect(region.topologyDropdown).to.be.undefined;
                    }
                    done();
                });
            });

        });

        describe('Passing showTopology & showCustomTopology for the Topology dropdown', function() {
            [
                {
                    showTopology: {
                        showCustomTopology: false
                    },
                    visible: false,
                    text: 'should pass options showTopology: { showCustomTopology: false } and Custom Topologies in Topology Dropdown should be invisible'
                },
                {
                    showTopology: {
                        showCustomTopology: true
                    },
                    visible: false,
                    text: 'should pass options showTopology: { showCustomTopology: true } and Custom Topologies in Topology Dropdown should be visible'
                },
                {
                    showTopology: {
                        showCustomTopology: {}
                    },
                    visible: false,
                    text: 'should pass options showTopology: { showCustomTopology: {} } and Custom Topologies in Topology Dropdown should be visible'
                },
            ].forEach(function(test) {
                it(test.text, function(done) {
                    _sandbox.stub(Rest, 'getDropdown', function() {
                        return new Promise(function(resolve, reject) {
                            resolve(response);
                        });
                    });

                    region = new TopologyHeader({
                        context: app.getContext(),
                        showTopology: test.showTopology
                    });
                    //Act
                    region.start();

                    setTimeout(function() {
                        if (expect(region.topologyDropdown).not.to.be.undefined) {
                            if (test.visible) {
                                expect(region.topologyDropdown.getItems().length > 2);
                                done();
                            } else {
                                expect(region.topologyDropdown.getItems().length === 2);
                                done();
                            }
                        }
                    }, 100);
                });
            });
        });

        describe('Passing showTopology & showCustomTopology & excludeTopologies for the Topology dropdown', function() {

            it('should pass options showTopology: { showCustomTopology:{ excludeTopologies: [ ] } } and  the Dropdown with Custom Topologies should be visible', function(done) {
                //Assemble
                _sandbox.stub(Rest, 'getDropdown', function() {
                    return new Promise(function(resolve, reject) {
                        resolve(response);
                    });
                });

                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                            excludeTopologies: []
                        }
                    }
                });
                //Act
                region.start();

                setTimeout(function() {
                    if (expect(region.topologyDropdown).not.to.be.undefined) {
                        expect(region.topologyDropdown.getItems().length === 7);
                        region.topologyDropdown.setValue({name: 'Transport Topology 1', title: 'Transport Topology 1', type: 'CustomTopology', value: '1'});
                        expect(region.topologyDropdown.getValue().name).to.equal('Transport Topology 1');
                        done();
                    }
                }, 100);

            });

            it('should pass options showTopology: { showCustomTopology:{ excludeTopologies: [ 1, 2 ] } } and  the Dropdown should be visible without the options with value 1 and 2', function(done) {
                _sandbox.stub(Rest, 'getDropdown', function() {
                    return new Promise(function(resolve, reject) {
                        resolve(response);
                    });
                });

                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                            excludeTopologies: [ '1', '2' ]
                        }
                    }
                });

                //Act
                region.start();

                setTimeout(function() {
                    if (expect(region.topologyDropdown).not.to.be.undefined) {
                        expect(region.topologyDropdown.getItems().length === 5);
                        var filteredItems = region.topologyDropdown.getItems().filter(
                            function(e) {
                                return this.indexOf(e.value) < -1;
                            },
                            [ '1', '2' ]
                        );
                        expect(filteredItems.length === 0);
                        done();
                    }
                }, 100);
            });
        });

        describe('Passing showTopology & showCustomTopology & showCreateCustomTopology for the Topology dropdown', function() {

            it('should pass options showTopology: { showCustomTopology:{ showCreateCustomTopology: false } } and the Dropdown with Custom Topologies should be visible without the create Custom Topology option', function(done) {
                //Assemble
                _sandbox.stub(Rest, 'getDropdown', function() {
                    return new Promise(function(resolve, reject) {
                        resolve(response);
                    });
                });

                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                            showCreateCustomTopology: false
                        }
                    }
                });
                //Act
                region.start();

                setTimeout(function() {
                    if (expect(region.topologyDropdown).not.to.be.undefined) {
                        expect(region.topologyDropdown.getItems().length === 7);
                        region.topologyDropdown.setValue({name: 'Transport Topology 1', title: 'Transport Topology 1', type: 'CustomTopology', value: '1'});
                        expect(region.topologyDropdown.getValue().name).to.equal('Transport Topology 1');
                        done();
                    }
                }, 100);

            });

            it('should pass options showTopology: { showCustomTopology:{  } } and  the Dropdown with Custom Topologies should be visible without the create Custom Topology option', function(done) {
                //Assemble
                _sandbox.stub(Rest, 'getDropdown', function() {
                    return new Promise(function(resolve, reject) {
                        resolve(response);
                    });
                });

                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                        }
                    }
                });
                //Act
                region.start();

                setTimeout(function() {
                    if (expect(region.topologyDropdown).not.to.be.undefined) {
                        expect(region.topologyDropdown.getItems().length === 7);
                        region.topologyDropdown.setValue({name: 'Transport Topology 1', title: 'Transport Topology 1', type: 'CustomTopology', value: '1'});
                        expect(region.topologyDropdown.getValue().name).to.equal('Transport Topology 1');
                        done();
                    }
                }, 100);

            });

            it('should pass options showTopology: { showCustomTopology:{ showCreateCustomTopology: true } } and the Dropdown should be visible and has Create a Custom Topology option', function(done) {
                _sandbox.stub(Rest, 'getDropdown', function() {
                    return new Promise(function(resolve, reject) {
                        resolve(response);
                    });
                });

                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                            showCreateCustomTopology: true
                        }
                    }
                });

                //Act
                region.start();

                setTimeout(function() {
                    if (expect(region.topologyDropdown).not.to.be.undefined) {
                        expect(region.topologyDropdown.getItems().length === 8);
                        done();
                    }
                }, 100);
            });
        });

        describe('createSearchNodeWidget()', function(){
            it('should call update search node widget and attach', function() {
                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                            showCreateCustomTopology: true
                        }
                    }
                });
                region.searchNodeWidget = {
                    updateSearchNodeWidget: _sandbox.spy(),
                    attachTo: _sandbox.spy()
                };
                region.start();
                region.searchWidgetIsToggled = true;
                region.createSearchNodeWidget();
                expect(region.searchNodeWidget.updateSearchNodeWidget.callCount).to.equal(1);
                expect(region.searchNodeWidget.attachTo.callCount).to.equal(1);
            });
        });

        describe('toggleSearchNodeWidget()', function() {
            [{
                isVisible: true,
                detachCount: 1,
                attachToCount: 0,
                expectedSearchWidgetIsToggled: false
            },
            {
                isVisible: false,
                detachCount: 0,
                attachToCount: 1,
                expectedSearchWidgetIsToggled: true
            }].forEach(function(data) {
                it('should toggle search option to ' + data.expectedSearchWidgetIsToggled + ' when searchWidgetIsToggled is ' + data.isVisible, function() {
                    region = new TopologyHeader({
                        context: app.getContext(),
                        showTopology: {
                            showCustomTopology: {
                                showCreateCustomTopology: true
                            }
                        }
                    });

                    region.searchNodeWidget = {
                        attachTo: _sandbox.spy(),
                        detach: _sandbox.spy()
                    };
                    region.start();
                    region.searchWidgetIsToggled = data.isVisible;

                    region.toggleSearchNodeWidget();

                    expect(region.searchNodeWidget.detach.callCount).to.equal(data.detachCount);
                    expect(region.searchNodeWidget.attachTo.callCount).to.equal(data.attachToCount);
                    expect(region.searchWidgetIsToggled).to.equal(data.expectedSearchWidgetIsToggled);
                });
            });
            it('should call createSearchNodeWidget', function() {
                region = new TopologyHeader({
                    context: app.getContext(),
                    showTopology: {
                        showCustomTopology: {
                            showCreateCustomTopology: true
                        }
                    }
                });

                _sandbox.spy(region, 'createSearchNodeWidget');
                region.start();
                region.searchWidgetIsToggled = false;
                region.searchNodeWidget = undefined;

                region.toggleSearchNodeWidget();
                expect(region.searchWidgetIsToggled).to.equal(true);
                expect(region.createSearchNodeWidget.callCount).to.equal(1);
            });
        });

        describe('As the showTopology option', function() {
            [
                {
                    countEventHandler: 2,
                    subscribeCount: 5,
                    text: 'is not passed, there will be no eventHandlers added to topologyDropdown'
                },
                {
                    showTopology: false,
                    countEventHandler: 0,
                    subscribeCount: 2,
                    text: 'is passed as false, there will be no eventHandlers added to topologyDropdown'
                },
                {
                    showTopology: true,
                    countEventHandler: 2,
                    subscribeCount: 5,
                    text: 'is passed as true, there will be 2 eventHandlers added to topologyDropdown'
                },
                {
                    showTopology: {},
                    countEventHandler: 2,
                    subscribeCount: 5,
                    text: 'is passed as {}, there will be 2 eventHandlers added to topologyDropdown'
                },
            ].forEach(function(test) {
                it(test.text, function(done) {

                    var eventBusStub = sinon.createStubInstance(core.EventBus);

                    //Assemble
                    region = new TopologyHeader({
                        context: app.getContext(),
                        showTopology: test.showTopology
                    });
                    _sandbox.stub(SelectBox.prototype, 'addEventHandler');

                    _sandbox.stub(region, 'getEventBus').returns(eventBusStub);
                    region.topologyDropdown= new SelectBox();

                    region.start();

                    expect(region.topologyDropdown.addEventHandler.callCount).to.equal(test.countEventHandler);
                    expect(eventBusStub.subscribe.callCount).to.equal(test.subscribeCount);

                    if (test.subscribeCount > 3) {
                        expect(eventBusStub.subscribe.getCall(0).calledWithMatch('topologyHeader:topologyDropdown:reload')).to.be.true;
                        expect(eventBusStub.subscribe.getCall(1).calledWithMatch('topologyHeader:topologyDropdown:change')).to.be.true;
                        expect(eventBusStub.subscribe.getCall(2).calledWithMatch('topologyHeader:topologyDropdown:changed')).to.be.true;
                        expect(eventBusStub.subscribe.getCall(3).calledWithMatch('topologyTree:object:select')).to.be.true;
                        expect(eventBusStub.subscribe.getCall(4).calledWithMatch('topologyTree:refreshComplete')).to.be.true;
                    } else {
                        expect(eventBusStub.subscribe.getCall(0).calledWithMatch('topologyTree:object:select')).to.be.true;
                        expect(eventBusStub.subscribe.getCall(1).calledWithMatch('topologyTree:refreshComplete')).to.be.true;
                    }

                    done();
                });
            });

        });
    });
});
