define([
    'networkobjectlib/widgets/FormWidgets/YANG/CaseDetailsForm/CaseDetailsForm',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer'
], function(CaseDetailsForm, WidgetsProducer) {
    'use strict';

    describe('Case Details Form', function() {
        var sandbox,
            optionsStub,
            element,
            caseDetailsForm,
            attributeValueChangedCallback,
            invalidAttributeValueChangedCallback,
            nodeProducerMock = new WidgetsProducer();

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            attributeValueChangedCallback = function() {
            };
            invalidAttributeValueChangedCallback = function() {
            };

            optionsStub = [{
                activeChoiceCase: {
                    caseName: 'strict-bgp-tracking',
                    choiceName: 'stub-router-opt'
                },
                constraints: {
                    nullable: true
                },
                defaultValue: null,
                description: 'type empty',
                isNonPersistent: false,
                key: 'strict-bgp-tracking',
                readOnly: false,
                type: 'BOOLEAN',
                value: null
            }];
            element = {
                activeChoiceCase: {
                    caseName: 'strict-bgp-tracking',
                    choiceName: 'stub-router-opt'
                },
                constraints: {
                    nullable: true
                },
                defaultValue: null,
                description: 'type empty',
                isNonPersistent: false,
                key: 'strict-bgp-tracking',
                readOnly: false,
                type: 'BOOLEAN',
                value: null,

                onChangeCallback: attributeValueChangedCallback,
                onInvalidCallback: invalidAttributeValueChangedCallback,
                innerOnChangeCallback: attributeValueChangedCallback,
                innerOnInvalidCallback: invalidAttributeValueChangedCallback
            };

            sandbox.spy(element, 'onChangeCallback') ;
            sandbox.spy(element, 'onInvalidCallback') ;
            sandbox.spy(element, 'innerOnChangeCallback') ;
            sandbox.spy(element, 'innerOnInvalidCallback') ;

            caseDetailsForm = new CaseDetailsForm(optionsStub, false, nodeProducerMock, 'strict-bgp-tracking', function() {});

        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('renderForm', function() {

            it('Should render widget based on type', function() {

                caseDetailsForm.renderForm();

                expect(caseDetailsForm.attrNotFound.options.label).to.equal('Persistent');
                expect(caseDetailsForm.caseName).to.equal('strict-bgp-tracking');
                expect(caseDetailsForm.options[0].activeChoiceCase.choiceName).to.equal('stub-router-opt');
            });
        });
        
        describe('attributeValueChangedCallback()', function() {
        
            beforeEach(function() {
                caseDetailsForm.valuesToBeSaved = [];
                sandbox.stub(caseDetailsForm,'handleChangedValue');


            });

            it('Should Not Add UnChanged Key-Value Pair to Be Saved', function() {

                expect(caseDetailsForm.handleChangedValue.callCount).to.equal(0);
                caseDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'OriginalValue'
                });

                expect(caseDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(caseDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should Remove Changed and Reverted Key-Value Pair to Be Saved', function() {

                caseDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'UserValue'
                });

                caseDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'OriginalValue'
                });

                expect(caseDetailsForm.valuesToBeSaved.length).to.equal(0);

            });

            it('Should Not add ReadOnly Key Value Pairs', function() {

                caseDetailsForm.attributeValueChangedCallback({
                    'key': 'collectTraceStatus',
                    'value': 'New Value'
                });

                expect(caseDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(caseDetailsForm.handleChangedValue.callCount).to.equal(1);
            });   

            it('Should Remove Valid Changed Key-Value Pair from list of invalid values', function() {

                caseDetailsForm.invalidValues = [];

                caseDetailsForm.invalidValues.push({
                    'key': 'userLabel',
                    'value': 'InValid value'
                });

                caseDetailsForm.attributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'NewValue'
                });

                expect(caseDetailsForm.invalidValues.length).to.equal(0);
                expect(caseDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

        });
        
        //Widgets Validates input, and calls this method with value if invalid
        //Values cannot appear on both valuesToBeSaved and invalid values
        describe('invalidAttributeValueChangedCallback()', function() {
        
            beforeEach(function() {
                caseDetailsForm.valuesToBeSaved = [];
                caseDetailsForm.invalidValues = [];
                sandbox.stub(caseDetailsForm,'handleChangedValue');
            });

            it('Should Add Invalid Value to List of Invalid Values', function() {

                caseDetailsForm.invalidAttributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'Invalid value' //form widget does not do any validation
                });

                expect(caseDetailsForm.invalidValues[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'Invalid value'
                });

                expect(caseDetailsForm.handleChangedValue.callCount).to.equal(1);
            });

            it('Should remove invalid values from list of valid values', function() {

                caseDetailsForm.valuesToBeSaved.push({
                    'key': 'userLabel',
                    'value': 'Valid value'
                });

                caseDetailsForm.invalidAttributeValueChangedCallback({
                    'key': 'userLabel',
                    'value': 'Invalid value' //form widget does not do any validation
                });

                expect(caseDetailsForm.invalidValues.length).to.equal(1);

                expect(caseDetailsForm.invalidValues[0]).to.deep.equal({
                    'key': 'userLabel',
                    'value': 'Invalid value'
                });

                expect(caseDetailsForm.valuesToBeSaved.length).to.equal(0);
                expect(caseDetailsForm.handleChangedValue.callCount).to.equal(1);
            });
        });
    });
});

