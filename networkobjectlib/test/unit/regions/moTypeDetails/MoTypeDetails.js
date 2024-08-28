define([
    'networkobjectlib/regions/moTypeDetails/MoTypeDetails',
    'networkobjectlib/widgets/NodeDetailsForm/NodeDetailsForm',
    'networkobjectlib/widgets/NodePropertyList/NodePropertyList',
    'networkobjectlib/widgets/NonPersistentAttrForm/NonPersistentAttrForm',
    'networkobjectlib/widgets/NonPersistentAttrList/NonPersistentAttrList',
    'jscore/ext/net',
    'jscore/core',
    'networkobjectlib/widgets/FormWidgets/LoadingAnimationWidget/LoadingAnimationWidget',
    'networkobjectlib/regions/moTypeDetails/Rest',
    'networkobjectlib/utils/AccessControl'
], function(MoTypeDetails, NodeDetailsForm,NodePropertyList,NonPersistentAttrForm, NonPersistentAttrList, net,core, LoadingAnimationWidget, Rest, AccessControl) {

    describe('MoTypeDetails', function() {
        var nodeProperties = {
            'type': 'ENodeBFunction',
            'poId': '8444249301369273',
            'fdn': 'MeContext=Test_ERBS_003_Test,ManagedElement=Test_ManagedElement_003_Test,ENodeBFunction=Stockholm_01',

            attributes: [
                {'key': 'administraticeState123', 'value': 'LOCKED'}
            ]
        };

        var sandbox,
            selectedNodePropertiesProto,
            selectedNodePropertiesContainerElement,
            viewStub,
            editPropertiesButtonStub,
            eventBusStub,
            mockContext;

        beforeEach(function() {
            //SETUP
            sandbox = sinon.sandbox.create();

            selectedNodePropertiesProto = new MoTypeDetails();
            mockContext = new core.AppContext();
            sandbox.stub(selectedNodePropertiesProto, 'getContext', function() {
                return mockContext;
            });
            eventBusStub = {
                publish: function() {},
                subscribe: function() {},
                dataLoad: function() {}
            };
            mockContext.eventBus = eventBusStub;
            sandbox.spy(eventBusStub, 'publish');
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'dataLoad');

            sandbox.stub(selectedNodePropertiesProto, 'getEventBus', function() {
                return eventBusStub;
            });

            //Mock the element
            editPropertiesButtonStub  = new core.Element('contentDiv');

            selectedNodePropertiesContainerElement = new core.Element('propertiesDiv');
            selectedNodePropertiesContainerElement.setAttribute('class', '.elNetworkObjectLib-attributesRegion');

            selectedNodePropertiesProto.formWidget = {
                destroy: function() {},
                setNonPersistentContent: function() {},
                valuesToBeSaved: function() {}
            };

            viewStub = {
                updateSelectedNodeLabel: function(moName) {
                    new core.Element('nodeNameDiv').setText(moName);
                },
                getSelectedNodePropertiesContentDiv: function() {
                    return new core.Element('nodeNameDiv');
                },

                enableEditPropertiesButton: function() {

                },

                getControlPanel: function() {
                    return new core.Element('div');
                },

                getEditPropertiesButtonHolder: function() {
                    return new core.Element('div');
                },

                disableEditPropertiesButton: function() {

                },

                getEditPropertiesButton: function() {
                    return editPropertiesButtonStub;
                },

                getModifiedHolder: function() {
                    var holderElement = new core.Element('div');
                    holderElement.setProperty('class', 'fakeClass');
                    return holderElement;
                },

                getSelectedNodePropertiesMessageArea: function() {
                    var containerElement = new core.Element('div');
                    containerElement.setProperty('class', 'eaTopologyBrowser-wNodePropertyList-message');
                    return containerElement;
                },

                hide: function() {
                    return selectedNodePropertiesContainerElement.removeModifier('show');
                },
                show: function() {
                    return   selectedNodePropertiesContainerElement.setModifier('show', 'true');
                },

                getSaveButton: function() {
                    return  new core.Element('div');
                },

                getCancelButton: function() {
                    return  new core.Element('div');
                },

                getAttributeValuesNotSaved: function() {
                    return  new core.Element('div');
                },
                getPropertyListContainer: function() {
                    return  new core.Element('div');
                }

            };

            sandbox.spy(viewStub, 'getSelectedNodePropertiesContentDiv');
            sandbox.spy(viewStub, 'enableEditPropertiesButton');
            sandbox.spy(viewStub, 'disableEditPropertiesButton');
            sandbox.spy(viewStub, 'getControlPanel');
            sandbox.spy(viewStub, 'getEditPropertiesButtonHolder');
            sandbox.spy(viewStub, 'getCancelButton');
            sandbox.spy(viewStub, 'getAttributeValuesNotSaved');
            sandbox.spy(viewStub, 'updateSelectedNodeLabel');
            sandbox.spy(viewStub, 'getSelectedNodePropertiesMessageArea');
            selectedNodePropertiesProto.view = viewStub;

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onViewReady()',function() {
            it('Should call addFilter, clearAttributesPanel and addEventHandler', function() {
                sandbox.stub(selectedNodePropertiesProto, 'addFilter');
                sandbox.stub(selectedNodePropertiesProto, 'clearAttributesPanel');
                sandbox.stub(selectedNodePropertiesProto.view.getEditPropertiesButton(), 'addEventHandler');

                expect(selectedNodePropertiesProto.addFilter.callCount).to.equal(0);
                expect(selectedNodePropertiesProto.clearAttributesPanel.callCount).to.equal(0);
                expect(viewStub.getEditPropertiesButton().addEventHandler.callCount).to.equal(0);

                //ACT
                selectedNodePropertiesProto.onViewReady();

                //verify that the sub methods are called once
                expect(selectedNodePropertiesProto.addFilter.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.clearAttributesPanel.callCount).to.equal(1);
                expect(viewStub.getEditPropertiesButton().addEventHandler.callCount).to.equal(1);
                expect(viewStub.getEditPropertiesButton().addEventHandler.getCall(0).calledWith('click')).to.equal(true);
            });

            [
                {
                    title: 'should not call remove getEditPropertiesButton',
                    data: [{actions: ['read', 'update']}],
                    expectedRemoveCallCount: 0
                },
                {
                    title: 'should call remove getEditPropertiesButton',
                    data: [{actions: ['read']}],
                    expectedRemoveCallCount: 1
                }
            ].forEach(function(testData) {
                it(testData.title, function(done) {
                    var accessControlStub = sandbox.stub(AccessControl.prototype, 'getResources').returns(Promise.resolve(testData.data));
                    var removeStub = sandbox.stub(selectedNodePropertiesProto.view.getEditPropertiesButton(), 'remove');
                    sandbox.stub(selectedNodePropertiesProto, 'addFilter');

                    selectedNodePropertiesProto.onViewReady();

                    setTimeout(function() {
                        expect(accessControlStub.callCount).to.equal(1);
                        expect(accessControlStub.calledWith('persistentObjectService')).to.equal(true);
                        expect(removeStub.callCount).to.equal(testData.expectedRemoveCallCount);
                        done();
                    }, done);
                });
            });
        });

        describe('clearAttributesPanel()', function() {

            beforeEach(function() {
                var mockUpdateSelectedNodeLabel = new core.Element('fakeDiv');
                viewStub = {
                    updateSelectedNodeLabel: function() {
                        return mockUpdateSelectedNodeLabel;
                    }
                };
                selectedNodePropertiesProto.view = viewStub;
                sandbox.stub(selectedNodePropertiesProto, 'showMessageArea');
            });

            it('Should call correct functions when clearAttributesPanel is called ',function() {
                //ACTing
                selectedNodePropertiesProto.clearAttributesPanel();

                //ASSERT
                expect(selectedNodePropertiesProto.showMessageArea.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.showMessageArea.getCall(0).args[0].title).to.equal('No Attributes Found');
                expect(selectedNodePropertiesProto.showMessageArea.getCall(0).args[0].message).to.equal('Select an Object to view its attributes');
            });
        });

        describe('requestMoAttributes()', function() {

            beforeEach(function() {
                sandbox.stub(selectedNodePropertiesProto, 'clearAttributesPanel', function() {});
                sandbox.stub(selectedNodePropertiesProto, 'moAttributeDataReceived', function() {});
                sandbox.stub(selectedNodePropertiesProto, 'createErrorContent', function() {});
            });

            it('should call correct functions for success response from ajax request',function(done) {
                var poid = '12345';

                //Simple Mocked Response
                var JSONResponse = {
                    'attributes': [],
                    'fdn': 'SubNetwork=ENM1,MeContext=LTE01ERBS00017,ManagedElement=1',
                    'name': '1',
                    'namespace': 'ERBS_NODE_MODEL',
                    'namespaceVersion': '6.1.101',
                    'poId': 281475000992622,
                    'id': '281475000992622',
                    'type': 'ManagedElement',
                    'networkDetails': [{'key': 'syncStatus', 'value': 'SYNCHRONIZED'}, {
                        'key': 'ipAddress',
                        'value': '10.34.67.68'
                    }]
                };
                sandbox.stub(net, 'ajax').yieldsTo('success', JSONResponse);

                //Acting
                selectedNodePropertiesProto.requestMoAttributes(poid, true, true);

                setTimeout(function() {
                    //ASSERT
                    expect(selectedNodePropertiesProto.moAttributeDataReceived.callCount).to.equal(1);
                    expect(selectedNodePropertiesProto.moAttributeDataReceived.getCall(0).calledWith(true, {
                        'attributes': [],
                        'fdn': 'SubNetwork=ENM1,MeContext=LTE01ERBS00017,ManagedElement=1',
                        'name': '1',
                        'namespace': 'ERBS_NODE_MODEL',
                        'namespaceVersion': '6.1.101',
                        'poId': '281475000992622',
                        'id': '281475000992622',
                        'type': 'ManagedElement',
                        'networkDetails': [{'key': 'CM syncStatus', 'value': 'SYNCHRONIZED'}, {
                            'key': 'ipAddress',
                            'value': '10.34.67.68'
                        }]
                    })).to.equal(true);

                    done();
                }, 50);
            });

            it('should call correct functions for failure response from ajax request',function(done) {
                var poid = '12345';

                sandbox.stub(Rest, 'getAttributes', function() {
                    return Promise.reject({
                        message: 'Not Found',
                        errorCode: 1000
                    });
                });


                //Acting
                selectedNodePropertiesProto.requestMoAttributes(poid, true, true);

                setTimeout(function() {
                //ASSERT
                    expect(selectedNodePropertiesProto.createErrorContent.callCount).to.equal(1);
                    expect(selectedNodePropertiesProto.createErrorContent.getCall(0).args[0]).to.equal('Not Found');
                    expect(selectedNodePropertiesProto.createErrorContent.getCall(0).args[1]).to.equal(true);
                    done();
                });
            });

        });

        describe('createErrorContent()', function() {
            var message, includeAllAttrbs;

            beforeEach(function() {
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrWidget');
            });

            it('Should create non persistent attribute widget', function() {
                message = 'Not Found';
                includeAllAttrbs = true;

                //ACT
                selectedNodePropertiesProto.createErrorContent(message, includeAllAttrbs);

                // ASSERT
                expect(selectedNodePropertiesProto.createNonPersistentAttrWidget.callCount).to.equal(1);
            });
        });

        describe('updateAttributesRegion()', function() {

            it('It should Enable The edit Properties Button', function() {
                //ACT
                selectedNodePropertiesProto.updateAttributesRegion(nodeProperties);
                // ASSERT
                expect(viewStub.getControlPanel.callCount).to.equal(1);
                expect(viewStub.getEditPropertiesButtonHolder.callCount).to.equal(1);

            });

        });

        describe('onEditProperties()', function() {

            beforeEach(function() {
                selectedNodePropertiesProto.nonPersistentExpanded = true;
                sandbox.stub(selectedNodePropertiesProto, 'createNodeDetailsForm');
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrForm');
            });

            it('Should disable edit details link when it is clicked ',function() {
                //ACT
                selectedNodePropertiesProto.onEditProperties();

                //ASSERT
                expect(selectedNodePropertiesProto.createNodeDetailsForm.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.createNonPersistentAttrForm.callCount).to.equal(1);
            });
        });

        describe('requestAttributeDefintions()', function() {
            var neType, neVersion, modelVersion, modelNameSpace, type ;
            beforeEach(function() {
                selectedNodePropertiesProto.nonPersistentExpanded = true;
                neType = null;
                neVersion = null;
                modelVersion =  '1.1.1';
                modelNameSpace =  'OSS_NE_CM_DEF';
                type = 'ENodeBFunction';

            });

            it('Should make a Request for teh model Definition for the current moType of the fdn ',function() {
                //SETUP
                sandbox.stub(net, 'ajax', function() {});
                //ACT: Call Handle Location Change With Valid poid --> requestSubTree --> net.ajax
                selectedNodePropertiesProto.requestAttributeDefintions(neType, neVersion, modelNameSpace, type, modelVersion);

                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                console.log(net.ajax.getCall(0));

                //Partial Match, success callback ignored
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/persistentObject/model/null/null/OSS_NE_CM_DEF/ENodeBFunction/1.1.1/attributes' + '?includeNonPersistent=true',
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });

            it('Should convert namespace to proper format and make a Request for the model Definition ',function() {
                //SETUP
                sandbox.stub(net, 'ajax', function() {});
                //ACT
                selectedNodePropertiesProto.requestAttributeDefintions(neType, neVersion, 'http://test/yang/url', type, modelVersion);

                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                console.log(net.ajax.getCall(0));

                //Partial Match, success callback ignored
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/persistentObject/model/null/null/http:._.._.test._.yang._.url/ENodeBFunction/1.1.1/attributes' + '?includeNonPersistent=true',
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });
        });

        describe('setAttributesPanelMessage()', function() {
            var message, includeAllAttrbs;

            beforeEach(function() {
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrWidget');
                sandbox.stub(selectedNodePropertiesProto, 'createNodePropertyList');
                sandbox.stub(selectedNodePropertiesProto.filter, 'resetFilter');
                sandbox.stub(selectedNodePropertiesProto, 'filterAttributes');
            });

            it('Should create non persistent attribute widget', function() {
                message = 'Not Found';
                includeAllAttrbs = true;
                selectedNodePropertiesProto.selectedNodeProperties = {
                    attributes: ['test']
                };

                //ACT
                selectedNodePropertiesProto.setAttributesPanelMessage(message, includeAllAttrbs);

                // ASSERT
                expect(selectedNodePropertiesProto.createNonPersistentAttrWidget.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.selectedNodeProperties.attributes).to.deep.equal([]);
            });

            it('Should set persistent attributes panel message and reset filter', function() {
                message = 'Not Found';
                includeAllAttrbs = false;
                selectedNodePropertiesProto.selectedNodeProperties = {
                    attributes: ['test'],
                    type: 'Erbs',
                    name: 'LTE001'
                };

                //ACT
                selectedNodePropertiesProto.setAttributesPanelMessage(message, includeAllAttrbs);

                // ASSERT
                expect(selectedNodePropertiesProto.createNodePropertyList.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.createNodePropertyList.getCall(0).calledWith({
                    type: 'Erbs',
                    name: 'LTE001',
                    attributes: []
                })).to.equal(true);
                expect(selectedNodePropertiesProto.selectedNodeProperties.attributes).to.deep.equal([]);
                expect(selectedNodePropertiesProto.filter.resetFilter.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.getCall(0).calledWith('')).to.equal(true);
            });
        });

        describe('onAttributeDefinitionsReceived', function() {
            var data  = { 'attributes': [
                {
                    'key': 'zzzTemporary9',
                    'value': -2000000000
                },
                {
                    'key': 'nnsfMode',
                    'value': 'RPLMN_IF_SAME_AS_SPLMN'},
                {
                    'key': 'sctpRef',
                    'value': null
                },

            ]
            };

            beforeEach(function() {
                selectedNodePropertiesProto.selectedNodeProperties = {};
                selectedNodePropertiesProto.nonPersistentExpanded = false;
                data.choices = [];

                sandbox.stub(selectedNodePropertiesProto, 'toggleContentArea');
                sandbox.stub(selectedNodePropertiesProto, 'toggleMessageArea');
                sandbox.stub(selectedNodePropertiesProto, 'mapReponseToValues');
                sandbox.stub(selectedNodePropertiesProto, 'createChoices');
                sandbox.stub(selectedNodePropertiesProto, 'getSelectedNodeItems');
                sandbox.stub(selectedNodePropertiesProto, 'removeChoiceAttributesAndAddChoice');
                sandbox.stub(selectedNodePropertiesProto, 'splitPersistentNonPersistentAttributes', function() { return ' '; });
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrWidget');
                sandbox.stub(selectedNodePropertiesProto, 'filterAttributes');
                sandbox.stub(selectedNodePropertiesProto, 'requestAttributeDefintions');
                sandbox.stub(selectedNodePropertiesProto, 'getFilterText');
                sandbox.stub(selectedNodePropertiesProto.filter, 'resetFilter');
            });

            it('Should toggle Content area on and Message area Off', function() {
                selectedNodePropertiesProto.onAttributeDefinitionsReceived(data);

                expect(selectedNodePropertiesProto.toggleContentArea.calledWith(true)).to.be.true;
                expect(selectedNodePropertiesProto.toggleMessageArea.calledWith(false)).to.be.true;
            });
            it('Should map Response to values', function() {
                selectedNodePropertiesProto.onAttributeDefinitionsReceived(data);

                expect(selectedNodePropertiesProto.mapReponseToValues.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.getSelectedNodeItems.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.createChoices.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.removeChoiceAttributesAndAddChoice.calledOnce).to.be.true;
            });
            it('Should split persistent and non persistent attributes', function() {
                selectedNodePropertiesProto.onAttributeDefinitionsReceived(data);

                expect(selectedNodePropertiesProto.splitPersistentNonPersistentAttributes.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.createNonPersistentAttrWidget.calledOnce).to.be.true;
            });
            it('Should reset Filter', function() {
                selectedNodePropertiesProto.onAttributeDefinitionsReceived(data);

                expect(selectedNodePropertiesProto.filter.resetFilter.calledOnce).to.be.true;
            });
            it('Should set Filter Attributes', function() {
                selectedNodePropertiesProto.nonPersistentExpanded = true;
                selectedNodePropertiesProto.onAttributeDefinitionsReceived(data);

                expect(selectedNodePropertiesProto.filterAttributes.calledOnce).to.be.true;
            });

        });

        describe('createChoices', function() {
            it('Should call createChoiceObject twice and createCaseObject 4 times', function() {
                var data  = {
                    attributes: [
                        {
                            key: 'zzzTemporary9',
                            value: -2000000000,
                            activeChoiceCase: {caseName: 'Test1'}

                        },
                        {
                            key: 'nnsfMode',
                            value: 'RPLMN_IF_SAME_AS_SPLMN',
                            activeChoiceCase: {caseName: 'Test2'}

                        },
                        {
                            key: 'sctpRef',
                            value: null,
                            activeChoiceCase: {caseName: 'Test1'}
                        }
                    ]
                };

                var choices = [
                    { name: 'Test1', mandatory: true, cases: [{name: 'caseTest1'},{name: 'caseTest2'}]},
                    {name: 'Test2',mandatory: true, cases: [{name: 'caseTest1'},{name: 'caseTest2'}]                                    }
                ];
                selectedNodePropertiesProto.selectedNodeProperties = data;
                var attributes = selectedNodePropertiesProto.getSelectedNodeItems();
                sandbox.spy(selectedNodePropertiesProto, 'createChoiceObject');
                sandbox.spy(selectedNodePropertiesProto, 'createCaseObject');

                selectedNodePropertiesProto.createChoices(attributes,choices);
                expect(selectedNodePropertiesProto.createChoiceObject.callCount).to.equal(2);
                expect(selectedNodePropertiesProto.createCaseObject.callCount).to.equal(4);
            });

        });

        describe('clearFilter()', function() {
            it('Should call filterAttributes method', function() {
                sandbox.stub(selectedNodePropertiesProto, 'filterAttributes');

                selectedNodePropertiesProto.clearFilter();

                expect(selectedNodePropertiesProto.filterAttributes.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.calledWith('')).to.equal(true);

            });

        });

        describe('requestTimedout()', function() {

            it('Should show timeout error in node property list', function() {
                selectedNodePropertiesProto.nodePropertyList = sinon.createStubInstance(NodePropertyList);

                selectedNodePropertiesProto.requestTimedout();

                expect(selectedNodePropertiesProto.nodePropertyList.setNonPersistentContent.calledOnce).to.be.true;
            });

            it('Should show timeout error in form widget', function() {
                selectedNodePropertiesProto.nodePropertyList = null;
                selectedNodePropertiesProto.formWidget = sinon.createStubInstance(NodeDetailsForm);

                selectedNodePropertiesProto.requestTimedout();

                expect(selectedNodePropertiesProto.formWidget.setNonPersistentContent.calledOnce).to.be.true;
            });

        });

        describe('moAttributeDataReceived()', function() {

            it('Should call method sortNodeProperties and requestAttributeDefinitions', function() {
                var input  =
                    {
                        'attributes': [
                            {
                                'key': 'zzzTemporary9',
                                'value': -2000000000
                            },
                            {
                                'key': 'nnsfMode',
                                'value': 'RPLMN_IF_SAME_AS_SPLMN'},
                            {
                                'key': 'sctpRef',
                                'value': null
                            },
                            {
                                'key': 'x2WhiteList',
                                'value': null
                            },
                            {
                                'key': 'tHODataFwdReordering',
                                'value': 50
                            },
                            {
                                'key': 'pmHwUtilDl',
                                'value': null
                            },

                            {
                                'key': 'pmZtemporary34',
                                'value': null
                            }
                        ]
                    };
                sandbox.stub(selectedNodePropertiesProto, 'sortNodeProperties');
                sandbox.stub(selectedNodePropertiesProto, 'requestAttributeDefintions');

                selectedNodePropertiesProto.moAttributeDataReceived(false,input);

                expect(selectedNodePropertiesProto.sortNodeProperties.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.requestAttributeDefintions.calledOnce).to.be.true;
            });
        });

        describe('splitPersistentNonPersistentAttributes()', function() {

            var mappedValuesMock;

            beforeEach(function() {

                mappedValuesMock = [
                    {
                        'key': 'collectLogsStatus',
                        'value': null,
                        'readOnly': false,
                        'constraints': null,
                        'type': 'ENUM_REF',
                        'isNonPersistent': true
                    },
                    {
                        'key': 'collectTraceStatus',
                        'value': null,
                        'readOnly': false,
                        'constraints': null,
                        'type': 'ENUM_REF',
                        'isNonPersistent': false
                    },
                    {
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000,
                        'readOnly': false,
                        'constraints':
                        {
                            'nullable': false,
                            'minValue': -34,
                            'maxValue': 29
                        },
                        'type': 'LONG',
                        'isNonPersistent': true
                    }
                ];

            });

            it('Should create object containing persistent and non-persistent attributes split out',function() {
                //ACT
                var attributeObject = selectedNodePropertiesProto.splitPersistentNonPersistentAttributes(mappedValuesMock);

                //ASSERT
                expect(attributeObject.persistentAttributes.length).to.equal(1);
                expect(attributeObject.nonPersistentAttributes.length).to.equal(2);
            });
        });

        describe('createNodeDetailsForm()', function() {

            var mockNodeList, mappedValuesMock;

            beforeEach(function() {

                mappedValuesMock = [
                    {
                        'key': 'collectLogsStatus',
                        'value': null,
                        'readOnly': false,
                        'constraints': null,
                        'type': 'ENUM_REF'
                    },
                    {
                        'key': 'collectTraceStatus',
                        'value': null,
                        'readOnly': false,
                        'constraints': null,
                        'type': 'ENUM_REF'
                    },
                    {
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000,
                        'readOnly': false,
                        'constraints':
                        {
                            'nullable': false,
                            'minValue': -34,
                            'maxValue': 29
                        },
                        'type': 'LONG'
                    }
                ];



                sandbox.stub(selectedNodePropertiesProto, 'mapReponseToValues', function() {
                    return mappedValuesMock ;
                });
                sandbox.stub(selectedNodePropertiesProto, 'getSelectedNodeItems', function() {
                    return [] ;
                });

                mockNodeList= new core.Widget();
                selectedNodePropertiesProto.selectedNodeProperties =selectedNodePropertiesProto;

                selectedNodePropertiesProto.nodePropertyList = mockNodeList;
                selectedNodePropertiesProto.nodeAttributeValuesAndDefinitions = mappedValuesMock;
                sandbox.stub(mockNodeList, 'destroy');
                sandbox.stub(NodeDetailsForm.prototype, 'init');
                sandbox.stub(NodeDetailsForm.prototype, 'onViewReady');
                sandbox.stub(NodeDetailsForm.prototype, 'updateFiltering');
                sandbox.stub(NodeDetailsForm.prototype, 'attachOnCancelCallback');
                sandbox.stub(NodeDetailsForm.prototype, 'attachOnSaveCallback');

            });

            it('Should destroy the List widget and create a form widget',function() {
                var buttons = {
                    saveButton: {},
                    cancelButton: {},
                    attributeValuesNotSaved: {}

                };

                //Before
                expect(mockNodeList.destroy.callCount).to.equal(0);

                //ACT
                selectedNodePropertiesProto.createNodeDetailsForm({});

                //ASSERT
                expect(mockNodeList.destroy.callCount).to.equal(1);
                expect(NodeDetailsForm.prototype.init.callCount).to.equal(1);
                expect(NodeDetailsForm.prototype.init.getCall(0).calledWithMatch(buttons,selectedNodePropertiesProto.selectedNodeProperties.attributes, selectedNodePropertiesProto.getFilterText())).to.equal(true);
                expect(viewStub.getControlPanel.callCount).to.equal(1);
                expect(viewStub.getEditPropertiesButtonHolder.callCount).to.equal(1);
            });
        });

        describe('createNonPersistentAttrForm()', function() {

            var mappedValuesMock;

            beforeEach(function() {

                mappedValuesMock = [
                    {
                        'key': 'collectLogsStatus',
                        'value': null,
                        'readOnly': false,
                        'constraints': null,
                        'type': 'ENUM_REF'
                    },
                    {
                        'key': 'collectTraceStatus',
                        'value': null,
                        'readOnly': false,
                        'constraints': null,
                        'type': 'ENUM_REF'
                    },
                    {
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000,
                        'readOnly': false,
                        'constraints':
                        {
                            'nullable': false,
                            'minValue': -34,
                            'maxValue': 29
                        },
                        'type': 'LONG'
                    }
                ];

                selectedNodePropertiesProto.selectedNodeProperties =selectedNodePropertiesProto;
                selectedNodePropertiesProto.selectedNodeProperties.nonPersistentAttributes = mappedValuesMock;

                sandbox.stub(NonPersistentAttrForm.prototype, 'init');
                sandbox.stub(NonPersistentAttrForm.prototype, 'onViewReady');
                sandbox.stub(NonPersistentAttrForm.prototype, 'renderForm');
                sandbox.stub(selectedNodePropertiesProto, 'updateFilterAllAttributes');
                sandbox.stub(selectedNodePropertiesProto.formWidget, 'setNonPersistentContent');
            });


            it('Should create a non persistent attribute list',function() {
                //ACT
                selectedNodePropertiesProto.createNonPersistentAttrForm({});

                //ASSERt
                expect(NonPersistentAttrForm.prototype.init.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.formWidget.setNonPersistentContent.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.updateFilterAllAttributes.callCount).to.equal(1);
            });

        });

        describe('createNodePropertyList()', function() {

            var mockNodeList,mockNodePropertyList;

            beforeEach(function() {

                mockNodePropertyList = {

                    'name': '1',
                    'type': 'ENodeBFunction',
                    'poId': '844424930182391',
                    'fdn': 'MeContext=ERBS000,ManagedElement=1,ENodeBFunction=1',
                    'attributes': [
                        {
                            'key': 'collectLogsStatus',
                            'value': 'Enabled'
                        },
                        {
                            'key': 'collectTraceStatus',
                            'value': null
                        },
                        {
                            'key': 'dlAccGbrAdmThresh',
                            'value': 1000
                        }
                    ]
                };

                mockNodeList= new core.Widget();

                selectedNodePropertiesProto.loadAttributesPanel = true;
                selectedNodePropertiesProto.includeAllAttributes =true;

                selectedNodePropertiesProto.nodePropertyList = mockNodeList;
                sandbox.stub(mockNodeList, 'destroy');
                sandbox.stub(NodePropertyList.prototype, 'init');
                sandbox.stub(NodePropertyList.prototype, 'attachTo');
            });

            it('Should create a attribute list',function() {
                //Before
                expect(mockNodeList.destroy.callCount).to.equal(0);

                //ACT
                selectedNodePropertiesProto.createNodePropertyList(mockNodePropertyList);

                //ASSERT
                expect(mockNodeList.destroy.callCount).to.equal(1);
                expect(NodePropertyList.prototype.init.callCount).to.equal(1);
                expect(NodePropertyList.prototype.attachTo.callCount).to.equal(1);
                expect(viewStub.getControlPanel.callCount).to.equal(1);
                expect(viewStub.getEditPropertiesButtonHolder.callCount).to.equal(1);
            });
        });

        describe('createNonPersistentAttrWidget', function() {
            it('Should call createNodeDetailsForm', function() {
                selectedNodePropertiesProto.editMode = true;
                selectedNodePropertiesProto.formWidget = null;
                sandbox.stub(selectedNodePropertiesProto, 'createNodeDetailsForm');
                selectedNodePropertiesProto.createNonPersistentAttrWidget('');
                expect(selectedNodePropertiesProto.createNodeDetailsForm.calledOnce).to.be.true;
            });
            it('Should call createNonPersistentAttrForm', function() {
                selectedNodePropertiesProto.editMode = true;
                selectedNodePropertiesProto.formWidget = sinon.createStubInstance(NodeDetailsForm);
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrForm');
                selectedNodePropertiesProto.createNonPersistentAttrWidget('');
                expect(selectedNodePropertiesProto.createNonPersistentAttrForm.calledOnce).to.be.true;
            });
            it('Should call updateAttributesRegion', function() {
                selectedNodePropertiesProto.editMode = false;
                selectedNodePropertiesProto.nodePropertyList = null;
                sandbox.stub(selectedNodePropertiesProto, 'updateAttributesRegion');
                selectedNodePropertiesProto.createNonPersistentAttrWidget('');
                expect(selectedNodePropertiesProto.updateAttributesRegion.calledOnce).to.be.true;
            });

            it('Should call createNonPersistentAttrList', function() {
                selectedNodePropertiesProto.editMode = false;
                selectedNodePropertiesProto.nodePropertyList = sinon.createStubInstance(NodeDetailsForm);
                selectedNodePropertiesProto.loadNodePropertyList = false;
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrList');
                selectedNodePropertiesProto.createNonPersistentAttrWidget('');
                expect(selectedNodePropertiesProto.createNonPersistentAttrList.calledOnce).to.be.true;
            });
        });

        describe('createNonPersistentAttrList()', function() {

            var mockNodePropertyList;

            beforeEach(function() {
                mockNodePropertyList = {

                    'name': '1',
                    'type': 'ENodeBFunction',
                    'poId': '844424930182391',
                    'fdn': 'MeContext=ERBS000,ManagedElement=1,ENodeBFunction=1',
                    'attributes': [
                        {
                            'key': 'collectLogsStatus',
                            'value': 'Enabled'
                        },
                        {
                            'key': 'collectTraceStatus',
                            'value': null
                        },
                        {
                            'key': 'dlAccGbrAdmThresh',
                            'value': 1000
                        }
                    ]
                };

                sandbox.stub(NonPersistentAttrList.prototype, 'init');
                sandbox.stub(NonPersistentAttrList.prototype, 'onViewReady');

                selectedNodePropertiesProto.nodePropertyList = {
                    destroy: function() {},
                    setNonPersistentContent: function() {}
                };
                sandbox.stub(selectedNodePropertiesProto.nodePropertyList, 'setNonPersistentContent');
            });

            it('Should create non persistent attribute list',function() {
                //ACT
                selectedNodePropertiesProto.createNonPersistentAttrList(mockNodePropertyList);

                //ASSERT
                expect(NonPersistentAttrList.prototype.init.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.nodePropertyList.setNonPersistentContent.callCount).to.equal(1);
            });
        });

        describe('valuesToBeSaved()', function() {

            var attributes;

            beforeEach(function() {
                attributes = [
                    {
                        'key': 'collectLogsStatus',
                        'value': 'Enabled'
                    },
                    {
                        'key': 'collectTraceStatus',
                        'value': null
                    },
                    {
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000
                    }
                ];

                selectedNodePropertiesProto.formWidget = {
                    setValuesToBeSaved: function() {}
                };
                sandbox.stub(selectedNodePropertiesProto.formWidget, 'setValuesToBeSaved');
            });

            it('Should pass values to be saved to form',function() {
                //ACT
                selectedNodePropertiesProto.valuesToBeSaved(attributes);

                //ASSERT
                expect(selectedNodePropertiesProto.formWidget.setValuesToBeSaved.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.formWidget.setValuesToBeSaved.getCall(0).calledWith(attributes)).to.equal(true);
            });
        });

        describe('viewNonPersistentAttributes()', function() {

            var mockNodeList,mockNodePropertyList;

            beforeEach(function() {
                mockNodePropertyList = {

                    'name': '1',
                    'type': 'ENodeBFunction',
                    'poId': '844424930182391',
                    'fdn': 'MeContext=ERBS000,ManagedElement=1,ENodeBFunction=1',
                    'attributes': [
                        {
                            'key': 'collectLogsStatus',
                            'value': 'Enabled'
                        },
                        {
                            'key': 'collectTraceStatus',
                            'value': null
                        },
                        {
                            'key': 'dlAccGbrAdmThresh',
                            'value': 1000
                        }
                    ]
                };

                selectedNodePropertiesProto.selectedNodeProperties =mockNodePropertyList;

                sandbox.stub(selectedNodePropertiesProto, 'mapReponseToValues');
                sandbox.stub(selectedNodePropertiesProto, 'getSelectedNodeItems');
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrList');
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrForm');
                sandbox.stub(selectedNodePropertiesProto, 'requestMoAttributes');
                sandbox.stub(selectedNodePropertiesProto, 'createLoadingAnimation');
                sandbox.stub(selectedNodePropertiesProto, 'filterAttributes');
            });

            it('Should get the attributes from server',function() {
                selectedNodePropertiesProto.nonPersistentAttributesReceived = false;

                //ACT
                selectedNodePropertiesProto.viewNonPersistentAttributes(true);

                //ASSERT
                expect(selectedNodePropertiesProto.requestMoAttributes.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.requestMoAttributes.getCall(0).calledWith('844424930182391', true, false)).to.equal(true);
                expect(selectedNodePropertiesProto.createLoadingAnimation.callCount).to.equal(1);
            });

            it('Should display non persistent attributes List',function() {
                mockNodeList= new core.Widget();
                selectedNodePropertiesProto.nodePropertyList = mockNodeList;
                selectedNodePropertiesProto.nonPersistentAttributesReceived = true;
                selectedNodePropertiesProto.getFilterText = function() { return 'Test'; };

                //ACT
                selectedNodePropertiesProto.viewNonPersistentAttributes(true);

                //ASSERT
                expect(selectedNodePropertiesProto.createNonPersistentAttrList.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.getCall(0).calledWith('Test')).to.equal(true);
            });
            it('Should display non persistent attributes form',function() {
                var mockNodeForm= new core.Widget();
                selectedNodePropertiesProto.formWidget = mockNodeForm;
                selectedNodePropertiesProto.formWidget.nonPersistentValuesToBeSaved = [];
                selectedNodePropertiesProto.nonPersistentAttributesReceived = true;
                selectedNodePropertiesProto.getFilterText = function() { return 'Test'; };

                //ACT
                selectedNodePropertiesProto.viewNonPersistentAttributes(true);

                expect(selectedNodePropertiesProto.createNonPersistentAttrForm.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.getCall(0).calledWith('Test')).to.equal(true);
            });
            it('Should filter attributes',function() {
                selectedNodePropertiesProto.getFilterText = function() { return 'Test'; };

                //ACT
                selectedNodePropertiesProto.viewNonPersistentAttributes(false);

                //ASSERT
                expect(selectedNodePropertiesProto.filterAttributes.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filterAttributes.getCall(0).calledWith('Test')).to.equal(true);
            });

        });

        describe('createLoadingAnimation()', function() {

            var attributes;

            beforeEach(function() {

                sandbox.stub(LoadingAnimationWidget.prototype, 'init');
                sandbox.stub(LoadingAnimationWidget.prototype, 'onViewReady');
                sandbox.stub(LoadingAnimationWidget.prototype, 'showNonPersistentLoadingAnimation');

                selectedNodePropertiesProto.formWidget = {
                    setNonPersistentContent: function() {}
                };
                sandbox.stub(selectedNodePropertiesProto.formWidget, 'setNonPersistentContent');
            });

            it('Should pass values to be saved to form',function() {
                //ACT
                selectedNodePropertiesProto.createLoadingAnimation(attributes);

                //ASSERT
                expect(LoadingAnimationWidget.prototype.init.callCount).to.equal(1);
                expect(LoadingAnimationWidget.prototype.onViewReady.callCount).to.equal(1);
                expect(LoadingAnimationWidget.prototype.showNonPersistentLoadingAnimation.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.formWidget.setNonPersistentContent.callCount).to.equal(1);
            });
        });

        describe('mapReponseToValues()', function() {

            var mappedValuesExpected, mappedValuesActual, mockAttributes, mockDefinitions;

            beforeEach(function() {

                mappedValuesExpected = [
                    {
                        'activeChoiceCase': undefined,
                        'constraints': null,
                        'defaultValue': 'Enum Default',
                        'description': 'Enum Description',
                        'immutable': undefined,
                        'isNonPersistent': false,
                        'key': 'collectLogsStatus',
                        'memberTypes': undefined,
                        'moType': 'EUtranCell',
                        'readBehavior': 'FROM_PERSISTENT',
                        'readOnly': true,
                        'sensitive': false,
                        'trafficDisturbances': null,
                        'type': 'ENUM_REF',
                        'userExposure': 'READ_ONLY',
                        'value': 'Enabled',
                        'writeBehavior': undefined,
                        'namespace': 'ERBS_NODE_MODEL',
                        'namespaceVersion': '1.0.12',
                        'origValue': 'Enabled'
                    },
                    {
                        'activeChoiceCase': undefined,
                        'constraints': null,
                        'defaultValue': 'String Default',
                        'description': 'String Description',
                        'immutable': undefined,
                        'isNonPersistent': true,
                        'key': 'collectTraceStatus',
                        'memberTypes': undefined,
                        'moType': 'EUtranCell',
                        'readBehavior': 'FROM_DELEGATE',
                        'readOnly': true,
                        'sensitive': false,
                        'trafficDisturbances': 'Changing this attribute can affect traffic.',
                        'type': 'STRING',
                        'userExposure': 'ALWAYS',
                        'value': null,
                        'writeBehavior': undefined,
                        'namespace': 'ERBS_NODE_MODEL',
                        'namespaceVersion': '1.0.12',
                        'origValue': null

                    },
                    {
                        'activeChoiceCase': undefined,
                        'memberTypes': undefined,
                        'moType': 'EUtranCell',
                        'readBehavior': 'FROM_PERSISTENT',
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000,
                        'readOnly': false,
                        'sensitive': false,
                        'constraints':
                        {
                            'nullable': false,
                            'minValue': -34,
                            'maxValue': 29
                        },
                        'type': 'LONG',
                        'description': 'Long Description',
                        'immutable': undefined,
                        'defaultValue': 'Long Default',
                        'isNonPersistent': false,
                        'trafficDisturbances': null,
                        'userExposure': 'ALWAYS',
                        'writeBehavior': undefined,
                        'namespace': 'ERBS_NODE_MODEL',
                        'namespaceVersion': '1.0.12',
                        'origValue': 1000
                    }
                ];

                mockAttributes = {

                    'name': '1',
                    'type': 'ENodeBFunction',
                    'poId': '844424930182391',
                    'fdn': 'MeContext=ERBS000,ManagedElement=1,ENodeBFunction=1',
                    'attributes': [
                        {
                            'key': 'collectLogsStatus',
                            'value': 'Enabled'
                        },
                        {
                            'key': 'collectTraceStatus',
                            'value': null
                        },
                        {
                            'key': 'dlAccGbrAdmThresh',
                            'value': 1000
                        }
                    ]
                };

                mockDefinitions={

                    'attributes': [
                        {
                            'key': 'collectLogsStatus',
                            'readOnly': false,
                            'sensitive': false,
                            'userExposure': 'READ_ONLY',
                            'constraints': null,
                            'type': 'ENUM_REF',
                            'description': 'Enum Description',
                            'defaultValue': 'Enum Default',
                            'readBehavior': 'FROM_PERSISTENT',
                            'trafficDisturbances': null,
                            'lifeCycle': {
                                'state': 'CURRENT'
                            }

                        },
                        {
                            'key': 'collectTraceStatus',
                            'readOnly': false,
                            'sensitive': false,
                            'userExposure': 'ALWAYS',
                            'constraints': null,
                            'type': 'STRING',
                            'description': 'String Description',
                            'defaultValue': 'String Default',
                            'readBehavior': 'FROM_DELEGATE',
                            'trafficDisturbances': 'Changing this attribute can affect traffic.',
                            'lifeCycle': {
                                'state': 'OBSOLETE'
                            }
                        },
                        {
                            'key': 'dlAccGbrAdmThresh',
                            'readOnly': false,
                            'sensitive': false,
                            'userExposure': 'ALWAYS',
                            'constraints':
                            {
                                'nullable': false,
                                'minValue': -34,
                                'maxValue': 29
                            },
                            'type': 'LONG',
                            'description': 'Long Description',
                            'defaultValue': 'Long Default',
                            'readBehavior': 'FROM_PERSISTENT',
                            'trafficDisturbances': null,
                            'lifeCycle': {
                                'state': 'CURRENT'
                            }
                        }
                    ]};

                var selectedNodeProperties = {'type': 'EUtranCell','namespace': 'ERBS_NODE_MODEL','namespaceVersion': '1.0.12'};
                selectedNodePropertiesProto.selectedNodeProperties = selectedNodeProperties;
                mappedValuesActual = selectedNodePropertiesProto.mapReponseToValues(mockDefinitions, mockAttributes.attributes);
            });

            it('Should destroy the List widget and create a form widget',function() {
                expect(mappedValuesActual).to.deep.equal(mappedValuesExpected);
            });

            it('Should make user exposure read-only non editable',function() {
                expect(mappedValuesActual[0].readOnly).to.equal(true);
            });

            it('Should make lifeCycle OBSOLETE non editable',function() {
                expect(mappedValuesActual[1].readOnly).to.equal(true);
            });

        });

        describe('formClickCancelHandler', function() {
            it('Should call updateAttributesRegion, createNonPersistentAttrList and filterAttributes', function() {
                sandbox.stub(selectedNodePropertiesProto, 'updateAttributesRegion');
                sandbox.stub(selectedNodePropertiesProto, 'createNonPersistentAttrList');
                sandbox.stub(selectedNodePropertiesProto, 'filterAttributes');
                sandbox.stub(selectedNodePropertiesProto, 'getFilterText').returns('Test');
                selectedNodePropertiesProto.nonPersistentExpanded = true;

                selectedNodePropertiesProto.formClickCancelHandler();

                expect(selectedNodePropertiesProto.updateAttributesRegion.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.createNonPersistentAttrList.calledOnce).to.be.true;
                expect(selectedNodePropertiesProto.filterAttributes.calledOnce).to.be.true;
            });
        });

        describe('formClickSaveHandler', function() {
            var selectedNodePropertiesStub;

            beforeEach(function() {

                selectedNodePropertiesStub = {

                    formatRequestData: function() { return; },
                    putRequest: function() { return; }
                };

                sandbox.spy(selectedNodePropertiesStub, 'formatRequestData');
                sandbox.spy(selectedNodePropertiesStub, 'putRequest');
                sandbox.stub(selectedNodePropertiesProto, 'putRequest',selectedNodePropertiesStub.putRequest());
                sandbox.stub(selectedNodePropertiesProto, 'formatRequestData',selectedNodePropertiesStub.formatRequestData());
                sandbox.stub(selectedNodePropertiesProto.filter, 'resetFilter');

            });

            it('It should call the format and put functions', function() {

                //Mock data
                var valuesToBeSaved  = [
                    {
                        'key': 'collectLogsStatus',
                        'value': 'Enabled'
                    },
                    {
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000
                    }
                ];

                selectedNodePropertiesProto.formClickSaveHandler(valuesToBeSaved);

                // VERIFY

                expect(selectedNodePropertiesStub.formatRequestData.callCount).to.equal(1);
                expect(selectedNodePropertiesStub.putRequest.callCount).to.equal(1);
                expect(selectedNodePropertiesProto.filter.resetFilter.callCount).to.equal(1);
            });
        });

        describe('formatRequestData', function() {

            it('It should format the properties and its values to be saved', function() {

                //Mock data
                var valuesToBeSaved  = [
                    {
                        'key': 'collectLogsStatus',
                        'value': 'Enabled'
                    },
                    {
                        'key': 'dlAccGbrAdmThresh',
                        'value': 1000
                    }
                ];

                selectedNodePropertiesProto.selectedNodeProperties = new MoTypeDetails();

                var formatAttributes = selectedNodePropertiesProto.formatRequestData(valuesToBeSaved);

                // VERIFY

                expect(formatAttributes.attributes[0].key).to.equal('collectLogsStatus');
                expect(formatAttributes.attributes[0].value).to.equal('Enabled');
                expect(formatAttributes.attributes[1].key).to.equal('dlAccGbrAdmThresh');
                expect(formatAttributes.attributes[1].value).to.equal(1000);
            });
        });

        describe('sortItemsByKey()', function() {

            it('It should sort an Array By Key value', function() {

                var input  =
                    {
                        'attributes': [
                            {
                                'key': 'zzzTemporary9',
                                'value': -2000000000
                            },
                            {
                                'key': 'nnsfMode',
                                'value': 'RPLMN_IF_SAME_AS_SPLMN'
                            },
                            {
                                'key': 'sctpRef',
                                'value': null
                            },
                            {
                                'key': 'x2WhiteList',
                                'value': null
                            },
                            {
                                'key': 'tHODataFwdReordering',
                                'value': 50
                            },
                            {
                                'key': 'pmHwUtilDl',
                                'value': null
                            },

                            {
                                'key': 'pmZtemporary34',
                                'value': null
                            }
                        ]
                    };

                var expected  =
                    {
                        'attributes': [
                            {
                                'key': 'nnsfMode',
                                'value': 'RPLMN_IF_SAME_AS_SPLMN'
                            },
                            {
                                'key': 'pmHwUtilDl',
                                'value': null
                            },

                            {
                                'key': 'pmZtemporary34',
                                'value': null
                            },
                            {
                                'key': 'sctpRef',
                                'value': null
                            },
                            {
                                'key': 'tHODataFwdReordering',
                                'value': 50
                            },
                            {
                                'key': 'x2WhiteList',
                                'value': null
                            },
                            {
                                'key': 'zzzTemporary9',
                                'value': -2000000000
                            }
                        ]
                    };

                expect(input).not.to.deep.equal(expected);

                selectedNodePropertiesProto.sortNodeProperties(input);

                expect(input).to.deep.equal(expected);

            });
        });
    });
});



