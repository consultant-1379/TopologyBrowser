define([
    'networkobjectlib/widgets/NodeDetailsForm/NodeDetailsForm',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'widgets/Accordion',
    'jscore/core'
], function(NodeDetailsForm, WidgetsProducer, Accordion, core) {
    'use strict';

    describe('NodeDetailsForm', function() {
        var sandbox,
            nodeDetailsForm,
            formElementsContainerElement,
            viewStub,
            mockSaveButton,
            nodeProducerMock = new WidgetsProducer(),
            expansionListMock = {};

        //Type ENUM, STRING, LONG, BOOLEAN, ReadOnly, Complex_Ref
        var nodeAttributeValuesAndDefinitions = [
            {
                'key': 'ipAddress',
                'value': '100.00.00.1',
                'readOnly': false,
                'constraints': null,
                'type': 'IP_ADDRESS'
            },
            {
                'key': 'userLabel',
                'value': 'OriginalValue',
                'readOnly': false,
                'constraints':
                {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                },
                'type': 'STRING'
            },
            {
                'key': 'collectLogsStatus',
                'value': 'Enabled',
                'readOnly': false,
                'constraints': null,
                'type': 'BOOLEAN'
            },
            {
                'key': 'collectTraceStatus',
                'value': null,
                'readOnly': true,
                'constraints': null,
                'type': 'STRING'
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
            },
            {
                'key': 'lastUpdatedTimeStamp',
                'value': 1455099723418,
                'readOnly': false,
                'isNonPersistent': false,
                'defaultValue': null,
                'description': 'Time in Date format which represents last updated time',
                'constraints': {
                    'nullable': false
                },
                'type': 'TIMESTAMP'
            },
            {
                key: 'dnsLookupOnTai',
                'readOnly': false,
                'type': 'ENUM_REF',
                'value': 'ON',
                'defaultValue': 'ON',
                'description': 'Controls if the Trackin...es effect: Immediately.',
                'enumeration': {
                    'key': 'DnsLookup',
                    'description': 'DnsLookup',
                    'enumMembers': [
                        {
                            'key': 'OFF',
                            'value': 0,
                            'description': 'OFF'
                        },
                        {
                            'key': 'ON',
                            'value': 1,
                            'description': 'ON'
                        }
                    ]
                }

            },
            {
                'key': 'eNodeBPlmnId',
                'value': [
                    {
                        'key': 'mcc',
                        'value': 3
                    },
                    {
                        'key': 'mnc',
                        'value': true
                    },
                    {
                        'key': 'mncLength',
                        value: 'hello'
                    }
                ],
                'readOnly': false,	//could be true?
                'type': 'COMPLEX_REF',
                'constraints': null, //
                'defaultValue': null, //would be a complex ref
                'description': 'Status of logs collection, initiated with operation collectAutIntLogs.',
                'complexRef': {
                    'key': 'PlmnIdentity',
                    'description': 'CollectLogsStatus',
                    attributes: [
                        {
                            'key': 'mcc',
                            'value': 3,
                            'readOnly': false,
                            'type': 'LONG',
                            'constraints': {
                                'nullable': false,
                                'minValue': -34,
                                'maxValue': 29
                            },
                            'defaultValue': 24,
                            'description': 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).\n\nResolution: 1\nDependencies: Will only be used then dscpUsage is active.\nTakes effect: Node restart'
                        },
                        {
                            'key': 'mnc',
                            'value': true,
                            'readOnly': false,
                            'type': 'BOOLEAN',
                            'defaultValue': true,
                            'description': 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).\n\nResolution: 1\nDependencies: Will only be used then dscpUsage is active.\nTakes effect: Node restart'
                        },
                        {
                            'key': 'mncLength',
                            value: 'hello',
                            'readOnly': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': false,
                                'maxLength': 1028,
                                'validContentRegex': null
                            },
                            'defaultValue': '',
                            'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                        }
                    ]
                }

            }

        ];


        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            var saveButtonStub = new core.Element('mockDiv');

            var buttons = {
                saveButton: {
                    setModifier: function() { return saveButtonStub; },
                    removeModifier: function() { },
                    hasModifier: function() { },
                },
                cancelButton: {},
                attributeValuesNotSaved: {
                    setText: function() {}
                }
            };

            //TODO Create Proper function for testing callback
            //Test filtering Properly
            //buttons, options, filterString, filterCounter, nonPersistentCallback, nonPersistentExpanded, persistentErrorMessage, expansionList, widgetsProducer
            nodeDetailsForm = new NodeDetailsForm(buttons, nodeAttributeValuesAndDefinitions, 'string', function() {}, false, '', expansionListMock, nodeProducerMock);

            //Mock the elements
            formElementsContainerElement = new core.Element('container');


            mockSaveButton = new core.Element('div');
            mockSaveButton.setAttribute('class', 'saveButton');
            viewStub = {
                getFormContainer: function() {
                    return formElementsContainerElement;
                },
                getCancelButton: function() {

                },

                setNumberOfAttributeValuesNotSaved: function() {

                },
                getSaveButton: function() {
                    return  mockSaveButton;
                }

            };
            sandbox.spy(viewStub, 'setNumberOfAttributeValuesNotSaved');
            nodeDetailsForm.view = viewStub;
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('createNonPersistentContainer()', function() {

            var viewStub,formContainerStub;

            beforeEach(function() {
                formContainerStub = new core.Element('mockDiv');
                sandbox.stub(Accordion.prototype, 'init');
                sandbox.stub(Accordion.prototype, 'attachTo');

                viewStub = {
                    getFormContainer: function() {
                        return formContainerStub;
                    }
                };
                nodeDetailsForm.view = viewStub;
            });

            it('Should create accordion for non persistent attributes',function() {
                nodeDetailsForm.createNonPersistentContainer();

                //ASSERT
                expect(Accordion.prototype.init.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.callCount).to.equal(1);
                //expect(Accordion.prototype.attachTo.getCall(0).calledWith(viewStub.getFormContainer())).to.equal(true);
            });
        });

        describe('setNonPersistentContent()', function() {

            var content;

            beforeEach(function() {
                content = [];
                nodeDetailsForm.accordionNonPersistent = {
                    setContent: function() {}
                };
                sandbox.stub(nodeDetailsForm.accordionNonPersistent, 'setContent');
            });

            it('Should set content for non persistent',function() {
                nodeDetailsForm.setNonPersistentContent(content);

                //ASSERT
                expect(nodeDetailsForm.accordionNonPersistent.setContent.callCount).to.equal(1);
                expect(nodeDetailsForm.accordionNonPersistent.setContent.getCall(0).calledWith()).to.equal(true);
            });
        });

        describe('addEventHandlers()', function() {

            var content;

            beforeEach(function() {
                content = [];
                sandbox.spy(nodeDetailsForm.accordionNonPersistent, 'addEventHandler');
            });

            it('Should add event handler to the non-persistent accordion',function() {
                nodeDetailsForm.addEventHandlers(content);

                //ASSERT
                expect(nodeDetailsForm.accordionNonPersistent.addEventHandler.callCount).to.equal(1);
            });
        });

        describe('renderForm', function() {

            beforeEach(function() {
                sandbox.stub(nodeProducerMock, 'attachWidget');
            });

            it('Should initalize the tokens', function() {
                //SETUP
                //Due to timezone offset difference we need to get offset difference here and apply it to our test
                // var hour = 10;
                // var date = new Date();
                // var timeOffset = parseInt(date.getTimezoneOffset());
                // var newHourOffset = hour - (timeOffset/60);

                //Before
                expect(nodeProducerMock.attachWidget.callCount).to.equal(0);

                //ACT
                nodeDetailsForm.renderForm();

                //ASSERT
                expect(nodeProducerMock.attachWidget.callCount).to.equal(8);
/*
                TODO:TEST TO HAVE BEEN MOVED TO WidgetsProducer
                expect(nodeDetailsForm.drawElement_STRING.callCount).to.equal(2);
                expect(nodeDetailsForm.drawElement_BOOLEAN.callCount).to.equal(1);
                expect(nodeDetailsForm.drawElement_LONG.callCount).to.equal(1);
                expect(nodeDetailsForm.drawElement_READONLY.callCount).to.equal(1);
                expect(nodeDetailsForm.drawElement_ENUM_REF.callCount).to.equal(1);
                expect(nodeDetailsForm.drawElement_COMPLEX_REF.callCount).to.equal(1);
*/

                //For first String Instance
/*
                 TODO:TEST TO HAVE BEEN MOVED TO WidgetsProducer
                expect(nodeProducerMock.attachWidget.getCall(0).calledWithMatch(
                    {
                        "key":"userLabel",
                        "value":"OriginalValue",
                        "readOnly":false,
                        "constraints":
                        {
                            "nullable":false,
                            "maxLength":1028,
                            "validContentRegex":null
                        },
                        "type":"STRING"
                    }
                )).to.equal(true);

                expect(nodeProducerMock.attachWidget.getCall(0).args[0]).to.have.property("onChangeCallback");

                //For second String Instance when type is TIMESTAMP
                expect(nodeProducerMock.attachWidget.getCall(1).calledWithMatch(
                    {
                        "key": "lastUpdatedTimeStamp",
                        "value": 1455099723418,
                        "formattedTimestamp" : "02/10/2016  " + newHourOffset + ":22:03",
                        "readOnly": false,
                        "isNonPersistent": false,
                        "defaultValue": null,
                        "description": "Time in Date format which represents last updated time",
                        "constraints": {
                            "nullable": false
                        },
                        "type": "TIMESTAMP",
                        "itemsNew": {
                            "description": "Time in Date format which represents last updated time",
                            "inputTitle": "Type: String, Can be null: false",
                            "key": "lastUpdatedTimeStamp",
                            "value": "02/10/2016  " + newHourOffset + ":22:03"
                        }
                    }
                )).to.equal(true);

                expect(nodeProducerMock.attachWidget.getCall(1).args[0]).to.have.property("onChangeCallback");
*/

/*
                //For Boolean
                expect(nodeDetailsForm.drawElement_BOOLEAN.getCall(0).calledWithMatch(
                    {
                        "key":"collectLogsStatus",
                        "value":"Enabled",
                        "readOnly":false,
                        "constraints":null,
                        "type":"BOOLEAN"
                    }
                )).to.equal(true);

                expect(nodeDetailsForm.drawElement_BOOLEAN.getCall(0).args[0]).to.have.property("onChangeCallback");

                //For Long
                expect(nodeDetailsForm.drawElement_LONG.getCall(0).calledWithMatch(
                    {
                        "key":"dlAccGbrAdmThresh",
                        "value":1000,
                        "readOnly":false,
                        "constraints":
                        {
                            "nullable":false,
                            "minValue":-34,
                            "maxValue":29
                        },
                        "type":"LONG"
                    }
                )).to.equal(true);

                expect(nodeDetailsForm.drawElement_LONG.getCall(0).args[0]).to.have.property("onChangeCallback");


                //For Read OPnly
                expect(nodeDetailsForm.drawElement_READONLY.getCall(0).calledWithMatch(
                    {
                        "key":"collectTraceStatus",
                        "value":null,
                        "readOnly":true,
                        "constraints":null,
                        "type":"STRING"
                    }
                )).to.equal(true);

                expect(nodeDetailsForm.drawElement_READONLY.getCall(0).args[0]).to.not.have.property("onChangeCallback");

                //For Enum
                expect(nodeDetailsForm.drawElement_ENUM_REF.getCall(0).calledWithMatch(
                    {
                        key:"dnsLookupOnTai",
                        "readOnly":false,
                        "type":"ENUM_REF",
                        "value":"ON",
                        "defaultValue": "ON",
                        "description":"Controls if the Trackin...es effect: Immediately.",
                        "enumeration":{
                            "key":"DnsLookup",
                            "description":"DnsLookup",
                            "enumMembers":[
                                {
                                    "key":"OFF",
                                    "value":0,
                                    "description":"OFF"
                                },
                                {
                                    "key":"ON",
                                    "value":1,
                                    "description":"ON"
                                }
                            ]
                        }

                    }
                )).to.equal(true);

                expect(nodeDetailsForm.drawElement_ENUM_REF.getCall(0).args[0]).to.have.property("onChangeCallback");

                //For Complex
                expect(nodeDetailsForm.drawElement_COMPLEX_REF.getCall(0).calledWithMatch(
                    {
                        "key": "eNodeBPlmnId",
                        "value": [
                            {
                                "key": "mcc",
                                "value": 3
                            },
                            {
                                "key": "mnc",
                                "value": true
                            },
                            {
                                "key": "mncLength",
                                value: 'hello'
                            }
                        ],
                        "readOnly": false,	//could be true?
                        "type": "COMPLEX_REF",
                        "constraints": null, //
                        "defaultValue": null, //would be a complex ref
                        "description": "Status of logs collection, initiated with operation collectAutIntLogs."
                        /!*    Nested Value Failing
                        "complexRef": {
                            "key": "PlmnIdentity",
                            "description": "CollectLogsStatus",
                            attributes: [
                                {
                                    "key": "mcc",
                                    "value": 3,
                                    "readOnly": false,
                                    "type": "LONG",
                                    "constraints": {
                                        "nullable": false,
                                        "minValue": -34,
                                        "maxValue": 29
                                    },
                                    "defaultValue": 24
                                    },
                                {
                                    "key": "mnc",
                                    "value": true,
                                    "readOnly": false,
                                    "type": "BOOLEAN",
                                    "defaultValue": true
                                },
                                {
                                    "key": "mncLength",
                                    value: 'hello',
                                    "readOnly": false,
                                    "type": "STRING",
                                    "constraints": {
                                        "nullable": false,
                                        "maxLength": 1028,
                                        "validContentRegex": null
                                    },
                                    "defaultValue": ""
                                }
                            ]
                        }
                        *!/
                    }

                )).to.equal(true);

                expect(nodeDetailsForm.drawElement_COMPLEX_REF.getCall(0).args[0]).to.have.property("onChangeCallback");
*/

            });
        });

        describe('attributeValueChangedCallback()', function() {

            beforeEach(function() {
                nodeDetailsForm.valuesToBeSaved = [];

                sandbox.stub(nodeDetailsForm,'handleChangedValue');


            });

            it('Should Add First Changed Key-Value Pair to Be Saved', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(nodeDetailsForm.valuesToBeSaved[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Not Add UnChanged Key-Value Pair to Be Saved', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'OriginalValue'
                });

                expect(nodeDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Changed and Reverted Key-Value Pair to Be Saved', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'UserValue'
                });

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'OriginalValue'
                });

                expect(nodeDetailsForm.valuesToBeSaved.length).to.equal(0);

            });

            it('Should Not add ReadOnly Key Value Pairs', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'collectTraceStatus',
                    'value': 'New Value'
                });

                expect(nodeDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Add First Changed Key-Value Pair to Be Saved for Complex Data Types', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 2
                        },
                        {
                            'key': 'mnc',
                            'value': false
                        },
                        {
                            'key': 'mncLength',
                            value: 'NewValue'
                        }
                    ]
                });

                expect(nodeDetailsForm.valuesToBeSaved[0]).to.deep.equal({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 2
                        },
                        {
                            'key': 'mnc',
                            'value': false
                        },
                        {
                            'key': 'mncLength',
                            value: 'NewValue'
                        }
                    ]
                });

                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Add First Partially Changed Key-Value Pair to Be Saved for Complex Data Types', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 3
                        },
                        {
                            'key': 'mnc',
                            'value': true
                        },
                        {
                            'key': 'mncLength',
                            value: 'NewValue'
                        }
                    ]
                });

                expect(nodeDetailsForm.valuesToBeSaved[0]).to.deep.equal({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 3
                        },
                        {
                            'key': 'mnc',
                            'value': true
                        },
                        {
                            'key': 'mncLength',
                            value: 'NewValue'
                        }
                    ]
                });

                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Not Add UnChanged Key-Value Pair to Be Saved for Complex Data Type', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 3
                        },
                        {
                            'key': 'mnc',
                            'value': true
                        },
                        {
                            'key': 'mncLength',
                            value: 'hello'
                        }
                    ]
                });

                expect(nodeDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Changed and Reverted Key-Value Pair to Be Saved for Complex Data Type', function() {

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 2
                        },
                        {
                            'key': 'mnc',
                            'value': false
                        },
                        {
                            'key': 'mncLength',
                            value: 'NewValue'
                        }
                    ]
                });

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 3
                        },
                        {
                            'key': 'mnc',
                            'value': true
                        },
                        {
                            'key': 'mncLength',
                            value: 'hello'
                        }
                    ]
                });

                expect(nodeDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(2);
            });

            it('Should Remove Valid Changed Key-Value Pair from list of invalid values', function() {

                nodeDetailsForm.invalidValues = [];

                nodeDetailsForm.invalidValues.push({
                    'key': 'userLabel',
                    'value': 'InValid value'
                });

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(nodeDetailsForm.invalidValues.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Valid Changed Key-Value Pair from list of invalid values for complex Data Type', function() {

                nodeDetailsForm.invalidValues = [];

                nodeDetailsForm.invalidValues.push({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 3
                        },
                        {
                            'key': 'mnc',
                            'value': true
                        },
                        {
                            'key': 'mncLength',
                            value: 'hello'
                        }
                    ]
                });

                nodeDetailsForm.attributeValueChangedCallback({
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 2
                        },
                        {
                            'key': 'mnc',
                            'value': false
                        },
                        {
                            'key': 'mncLength',
                            value: 'NewValue'
                        }
                    ]
                }
                );

                expect(nodeDetailsForm.invalidValues.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });


        });

        //Widgets Validates input, and calls this method with value if invalid
        //Values cannot appear on both valuesToBeSaved and invalid values
        describe('invalidAttributeValueChangedCallback()', function() {

            beforeEach(function() {
                nodeDetailsForm.valuesToBeSaved = [];
                nodeDetailsForm.invalidValues = [];
                sandbox.stub(nodeDetailsForm,'handleChangedValue');
            });

            it('Should Add Invalid Value to List of Invalid Values', function() {

                nodeDetailsForm.invalidAttributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'Invalid value' //form widget does not do any validation
                });

                expect(nodeDetailsForm.invalidValues[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'Invalid value'
                });

                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should remove invalid values from list of valid values', function() {

                nodeDetailsForm.valuesToBeSaved.push({
                    'key': 'userLabel',
                    'value': 'Valid value'
                });

                nodeDetailsForm.invalidAttributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'Invalid value' //form widget does not do any validation
                });

                expect(nodeDetailsForm.invalidValues.length).to.equal(1);

                expect(nodeDetailsForm.invalidValues[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'Invalid value'
                });

                expect(nodeDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });
        });

        describe('updateFiltering', function() {

            var mockFormElements, mockDiv1, mockDiv2, mockDiv3, mockDiv4;

            beforeEach(function() {
                mockDiv1 = new core.Element('div');
                mockDiv2 = new core.Element('div');
                mockDiv3 = new core.Element('div');
                mockDiv4 = new core.Element('div');

                mockFormElements =[
                    {
                        getElement: function() {
                            return  mockDiv1;
                        },
                        options: {
                            key: 'abc'
                        }
                    },
                    {
                        getElement: function() {
                            return  mockDiv2;
                        },
                        options: {
                            key: 'abd'
                        }
                    },
                    {
                        getElement: function() {
                            return  mockDiv3;
                        },
                        options: {
                            key: 'bbb'
                        }
                    },
                    {
                        getElement: function() {
                            return  mockDiv4;
                        },
                        options: {
                            key: 'add'
                        }
                    }

                ];

                nodeDetailsForm.formElements =  mockFormElements;
            });

            it('Should filter on first letter', function() {
                var result = nodeDetailsForm.updateFiltering('a');

                expect(result.filtered).to.equal(3);
                expect(result.total).to.equal(4);
            });

            it('Should filter on first two letters', function() {
                var result = nodeDetailsForm.updateFiltering('ab');

                expect(result.filtered).to.equal(2);
                expect(result.total).to.equal(4);
            });

            it('Should filter on first three letters', function() {
                var result = nodeDetailsForm.updateFiltering('abc');

                expect(result.filtered).to.equal(1);
                expect(result.total).to.equal(4);
            });

            it('Should filter all items when no match', function() {
                var result = nodeDetailsForm.updateFiltering('xyz');

                expect(result.filtered).to.equal(0);
                expect(result.total).to.equal(4);
            });

            it('Should hide unmatched attributes', function() {
                nodeDetailsForm.updateFiltering('ab');

                expect(mockFormElements[2].getElement().getStyle('display')).to.equal('none');
                expect(mockFormElements[3].getElement().getStyle('display')).to.equal('none');

            });
        });

        describe('setValuesToBeSaved()', function() {
            var attributes;
            beforeEach(function() {
                attributes = {
                    nonPersistentValuesToBeSaved: [
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
                    ],
                    nonPersistentInvalidValues: [
                        {
                            'key': 'collectLogsStatusInvalid',
                            'value': null
                        }
                    ]
                };
                sandbox.stub(nodeDetailsForm,'handleChangedValue');
            });

            it('Should Add non-persistent attributes and invalid attributes to lists', function() {
                //ACT
                nodeDetailsForm.setValuesToBeSaved(attributes);

                //ASSERT
                expect(nodeDetailsForm.nonPersistentValuesToBeSaved.length).to.equal(3);
                expect(nodeDetailsForm.nonPersistentInvalidValues.length).to.equal(1);
                expect(nodeDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

        });

        describe('handleChangedValue', function() {
            [
                {
                    description: 'Should not set \'Changes\' and disable save button',
                    data: {
                        invalidValues: [],
                        nonPersistentInvalidValues: [],
                        valuesToBeSaved: [],
                        nonPersistentValuesToBeSaved: []
                    },
                    expected: {
                        text: '',
                        setModifier: 1,
                        removeModifier: 0
                    }
                },
                {
                    description: 'Should set \'Changes\' and enable save button',
                    data: {
                        invalidValues: [],
                        nonPersistentInvalidValues: [],
                        valuesToBeSaved: ['1'],
                        nonPersistentValuesToBeSaved: []
                    },
                    expected: {
                        text: 'Changes: (1)',
                        setModifier: 0,
                        removeModifier: 1
                    }
                }
            ].forEach(function(test) {
                it(test.description, function() {
                    //Setup
                    nodeDetailsForm.addEventHandler =
                    sandbox.spy(nodeDetailsForm.attributeValuesNotSaved, 'setText');
                    sandbox.spy(nodeDetailsForm.saveButton, 'setModifier');
                    sandbox.spy(nodeDetailsForm.saveButton, 'removeModifier');

                    nodeDetailsForm.invalidValues = test.data.invalidValues;
                    nodeDetailsForm.nonPersistentInvalidValues = test.data.nonPersistentInvalidValues;
                    nodeDetailsForm.valuesToBeSaved = test.data.valuesToBeSaved;
                    nodeDetailsForm.nonPersistentValuesToBeSaved = test.data.nonPersistentValuesToBeSaved;

                    //Action
                    nodeDetailsForm.handleChangedValue();

                    //Assert
                    expect(nodeDetailsForm.attributeValuesNotSaved.setText.firstCall.calledWith(test.expected.text)).to.equal(true);
                    expect(nodeDetailsForm.saveButton.setModifier.callCount).to.equal(test.expected.setModifier);
                    expect(nodeDetailsForm.saveButton.removeModifier.callCount).to.equal(test.expected.removeModifier);
                });
            });
        });

    });
});
