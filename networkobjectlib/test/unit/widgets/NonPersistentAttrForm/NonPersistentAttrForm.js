define([
    'networkobjectlib/widgets/NonPersistentAttrForm/NonPersistentAttrForm',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'jscore/core'
], function(NonPersistentAttrForm, NodeProducer, core) {
    'use strict';

    describe('NonPersistentAttrForm', function() {
        var sandbox,
            nonPersistentAttrForm,
            testDiv,
            viewStub,
            nodeProducer,
            expansionList=[];

        //Type ENUM, STRING, LONG, BOOLEAN, ReadOnly, Complex_Ref
        var nodeAttributeValuesAndDefinitions = [
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
            nodeProducer = new NodeProducer();
            sandbox.stub(nodeProducer, 'attachWidget');
            sandbox.stub(nodeProducer, 'createWidget');
            nonPersistentAttrForm = new NonPersistentAttrForm(JSON.parse(JSON.stringify(nodeAttributeValuesAndDefinitions)), 'string', function() {}, null, expansionList, nodeProducer);

            //TODO Create Proper function for testing callback
            //Test filtering Properly

            //Mock the elements
            testDiv = new core.Element('testDiv');
            viewStub = {
                getFormContainer: function() {
                    return testDiv;
                },
                setNumberOfAttributeValuesNotSaved: function() {
                    return testDiv;
                },
                showNonPersistentAttrbsNotFoundMsg: function() {
                    return testDiv;
                },
                hideNonPersistentAttrbsNotFoundMsg: function() {
                    return testDiv;
                }
            };
            sandbox.spy(viewStub, 'setNumberOfAttributeValuesNotSaved');
            sandbox.spy(viewStub, 'showNonPersistentAttrbsNotFoundMsg');
            sandbox.spy(viewStub, 'hideNonPersistentAttrbsNotFoundMsg');
            nonPersistentAttrForm.view = viewStub;
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('renderForm', function() {
            it('Should initalize the form elements', function() {

                ////Before
                //onViewReady initialize the widget and call renderForm();
                expect(nodeProducer.attachWidget.callCount).to.equal(6);

                nonPersistentAttrForm.options.forEach(function(attributeDefinition, index) {
                    //Now we simulate to save the no persistent attributes
                    expect(nodeProducer.attachWidget.getCall(index).calledWith(attributeDefinition, nonPersistentAttrForm.options, nonPersistentAttrForm.formElements, testDiv, true)).to.equal(true);
                });
            });

            it('Should show non-persistent not found msg when no non-persistent attributes exist', function() {
                nonPersistentAttrForm.options = [];
                nonPersistentAttrForm.filterText = '';

                nonPersistentAttrForm.renderForm();

                //expect(viewStub.showNonPersistentAttrbsNotFoundMsg.callCount).to.equal(1);
            });

            it('Should hide non-persistent not found msg when non-persistent attributes exist', function() {
                nonPersistentAttrForm.options = [];
                nonPersistentAttrForm.filterText = 'test';

                nonPersistentAttrForm.renderForm();

                expect(viewStub.hideNonPersistentAttrbsNotFoundMsg.callCount).to.equal(1);
            });
        });

        describe('attributeValueChangedCallback()', function() {

            beforeEach(function() {
                nonPersistentAttrForm.options.forEach(function(attributeDefinition) {
                    var originalElement = nodeAttributeValuesAndDefinitions.filter(function(originalValue) {
                        return originalValue.key === attributeDefinition.key;
                    })[0];
                    //Now we simulate to save the no persistent attributes
                    if (!originalElement || !originalElement.readOnly) {
                        attributeDefinition.readOnly=false;
                    }
                });
                nonPersistentAttrForm.valuesToBeSaved = [];

                sandbox.stub(nonPersistentAttrForm,'handleChangedValue');
            });

            it('Should Add First Changed Key-Value Pair to Be Saved', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(nonPersistentAttrForm.valuesToBeSaved[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Not Add UnChanged Key-Value Pair to Be Saved', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'OriginalValue'
                });

                expect(nonPersistentAttrForm.valuesToBeSaved.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Changed and Reverted Key-Value Pair to Be Saved', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'UserValue'
                });

                nonPersistentAttrForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'OriginalValue'
                });

                expect(nonPersistentAttrForm.valuesToBeSaved.length).to.equal(0);

            });

            it('Should Not add ReadOnly Key Value Pairs', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
                    'key': 'collectTraceStatus',
                    'value': 'New Value'
                });

                expect(nonPersistentAttrForm.valuesToBeSaved.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Add First Changed Key-Value Pair to Be Saved for Complex Data Types', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
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

                expect(nonPersistentAttrForm.valuesToBeSaved[0]).to.deep.equal({
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

                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Add First Partially Changed Key-Value Pair to Be Saved for Complex Data Types', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
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

                expect(nonPersistentAttrForm.valuesToBeSaved[0]).to.deep.equal({
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

                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Not Add UnChanged Key-Value Pair to Be Saved for Complex Data Type', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
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

                expect(nonPersistentAttrForm.valuesToBeSaved.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Changed and Reverted Key-Value Pair to Be Saved for Complex Data Type', function() {

                nonPersistentAttrForm.attributeValueChangedCallback({
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

                nonPersistentAttrForm.attributeValueChangedCallback({
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

                expect(nonPersistentAttrForm.valuesToBeSaved.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(2);
            });

            it('Should Remove Valid Changed Key-Value Pair from list of invalid values', function() {

                nonPersistentAttrForm.invalidValues = [];

                nonPersistentAttrForm.invalidValues.push({
                    'key': 'userLabel',
                    'value': 'InValid value'
                });

                nonPersistentAttrForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(nonPersistentAttrForm.invalidValues.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Valid Changed Key-Value Pair from list of invalid values for complex Data Type', function() {

                nonPersistentAttrForm.invalidValues = [];

                nonPersistentAttrForm.invalidValues.push({
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

                nonPersistentAttrForm.attributeValueChangedCallback({
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

                expect(nonPersistentAttrForm.invalidValues.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });


        });

        //Widgets Validates input, and calls this method with value if invalid
        //Values cannot appear on both valuesToBeSaved and invalid values
        describe('invalidAttributeValueChangedCallback()', function() {

            beforeEach(function() {
                nonPersistentAttrForm.valuesToBeSaved = [];
                nonPersistentAttrForm.invalidValues = [];
                sandbox.stub(nonPersistentAttrForm,'handleChangedValue');
            });

            it('Should Add Invalid Value to List of Invalid Values', function() {

                nonPersistentAttrForm.invalidAttributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'Invalid value' //form widget does not do any validation
                });

                expect(nonPersistentAttrForm.invalidValues[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'Invalid value'
                });

                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should remove invalid values from list of valid values', function() {

                nonPersistentAttrForm.valuesToBeSaved.push({
                    'key': 'userLabel',
                    'value': 'Valid value'
                });

                nonPersistentAttrForm.invalidAttributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'Invalid value' //form widget does not do any validation
                });

                expect(nonPersistentAttrForm.invalidValues.length).to.equal(1);

                expect(nonPersistentAttrForm.invalidValues[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'Invalid value'
                });

                expect(nonPersistentAttrForm.valuesToBeSaved.length).to.equal(0);
                expect(nonPersistentAttrForm.handleChangedValue.callCount).to.equal(1);
            });
        });
    });
});
