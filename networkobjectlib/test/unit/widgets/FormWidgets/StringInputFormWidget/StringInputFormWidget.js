define([
    'networkobjectlib/widgets/FormWidgets/StringInputFormWidget/StringInputFormWidget',
    'jscore/core'
], function(StringInput) {
    'use strict';

    describe('String Input Widget', function() {
        var sandbox,
            classUnderTest,
            optionsStub;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            optionsStub = {
                'key': 'userLabel',
                'value': 'randomValue',
                'readOnly': false,
                'type': 'STRING',
                'defaultValue': '',
                'description': 'Label for free use.',
                'isMultiEdit': true,
                'validateOnStart': true,
                onChangeCallback: sinon.stub(),
                onInvalidCallback: sinon.stub()
            };
            classUnderTest = new StringInput(optionsStub);


        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('handleChangedEvent', function() {

            it('Should call handleChangedValue', function() {
                sandbox.stub(classUnderTest, 'handleChangedValue');

                classUnderTest.view.getTextInput().setValue('valid');
                classUnderTest.handleChangedEvent();

                expect(classUnderTest.handleChangedValue.calledOnce).to.be.true;
            });

            it('Should call doValid when value is empty in multiEdit flow', function() {
                sandbox.stub(classUnderTest, 'doValid');
                sandbox.stub(classUnderTest.view.getOuterWrapper(), 'removeModifier');

                classUnderTest.handleChangedEvent();

                expect(classUnderTest.doValid.calledOnce).to.be.true;
                expect(classUnderTest.view.getOuterWrapper().removeModifier.calledOnce).to.be.true;
            });
        });

        describe('handleChangedValue', function() {
            beforeEach(function() {
                sandbox.stub(classUnderTest, 'doValid');
                sandbox.stub(classUnderTest, 'doInvalid');
            });

            [
                {
                    isNullable: true,
                    value: null
                },
                {
                    isNullable: null,
                    value: "null"
                },
                {
                    isNullable: null,
                    value: "<null>"
                },
                {
                    isNullable: null,
                    value: ""
                }
            ].forEach(function(data) {
                it('Should call Valid() if validation constraint passes :' + data.value + ' (type=' + typeof data.value + ')', function() {

                    //Set constraint to nullable
                    var constraintsToValidate = {
                        isNullable: data.isNullable
                    };

                    //Set value to null
                    classUnderTest.handleChangedValue(data.value,constraintsToValidate);

                    expect(classUnderTest.doValid.callCount).to.equal(1);
                    expect(classUnderTest.doInvalid.callCount).to.equal(0);

                });
            })

            it('Should call Invalid() if validation constraint fails', function() {

                //Set constraint to not nullable
                var constraintsToValidate = {
                    checkInteger: true
                };

                //Set value to null
                classUnderTest.handleChangedValue(null,constraintsToValidate);

                expect(classUnderTest.doInvalid.callCount).to.equal(1);
                expect(classUnderTest.doValid.callCount).to.equal(0);

            });



        });

        describe('doValid', function() {
            it('Should call onChangeCallback when value changes ', function() {
                sandbox.stub(classUnderTest, 'setValid');
                sandbox.stub(classUnderTest, 'hideError');
                sandbox.stub(classUnderTest.view.getOuterWrapper(), 'setModifier');

                classUnderTest.doValid('key','value','type', false);

                expect(classUnderTest.setValid.calledWith(true)).to.be.true;
                expect(classUnderTest.hideError.calledOnce).to.be.true;
                expect(optionsStub.onChangeCallback.calledTwice).to.be.true;
                expect(classUnderTest.view.getOuterWrapper().setModifier.calledOnce).to.be.true;
            });

            it('Should call onChangeCallback when value does not change', function() {
                sandbox.stub(classUnderTest, 'setValid');
                sandbox.stub(classUnderTest, 'hideError');
                sandbox.stub(classUnderTest.view.getOuterWrapper(), 'removeModifier');

                classUnderTest.doValid('key',optionsStub.value,'type', false);

                expect(classUnderTest.setValid.calledWith(true)).to.be.true;
                expect(classUnderTest.hideError.calledOnce).to.be.true;
                expect(optionsStub.onChangeCallback.calledTwice).to.be.true;
                expect(classUnderTest.view.getOuterWrapper().removeModifier.calledOnce).to.be.true;
            });
        });

        describe('doInvalid', function() {
            it('Should call onInValidCallback', function() {
                sandbox.stub(classUnderTest, 'setValid');
                sandbox.stub(classUnderTest, 'showError');

                var message = 'Error';
                classUnderTest.doInvalid('key','value','type', false, message);

                expect(classUnderTest.setValid.calledWith(false)).to.be.true;
                expect(classUnderTest.showError.calledWith(message)).to.be.true;
                expect(optionsStub.onInvalidCallback.calledOnce).to.be.true;
            });
        });

        describe('OnViewReady', function() {
            it('should populate a placeholder in textbox, If it is multi-edit flow', function() {
                var expectedPlaceHolderValue  = 'Enter a Value';

                classUnderTest.onViewReady();
                expect(classUnderTest.view.getTextInput().getAttribute('placeholder')).to.equal(expectedPlaceHolderValue);

            });

            it('should call handleChangedEvent if validateOnStart is set', function() {
                sandbox.stub(classUnderTest, 'handleChangedEvent');
                classUnderTest.onViewReady();
                expect(classUnderTest.handleChangedEvent.calledOnce).to.be.true;
            });
        });

    });
});
