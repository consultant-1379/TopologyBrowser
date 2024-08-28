define([
    'networkobjectlib/widgets/FormWidgets/NumberInputFormWidget/NumberInputFormWidget'
], function(NumberInput) {
    'use strict';

    describe('Number Input Widget', function() {
        var sandbox,
            classUnderTest,
            optionsStub;


        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            optionsStub = {
                'key': 'pmZtemporary34',
                'value': '',
                'readOnly': false,
                'type': 'LONG',
                'defaultValue': null,
                'description': 'Normally this counter',
                'isMultiEdit': true,
                'validateOnStart': true,
                onChangeCallback: sinon.stub(),
                onInvalidCallback: sinon.stub()
            };

            classUnderTest = new NumberInput(optionsStub);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('handleChangedEvent', function() {

            it('Should call handleChangedValue', function() {
                sandbox.stub(classUnderTest, 'handleChangedValue');

                classUnderTest.view.getTextInput().setValue(0);
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

            it('Should call Valid() if validation constraint passes :null', function() {
                //Set constraint to nullable
                var constraintsToValidate = {
                    isNullable: true,
                };

                //Set value to null
                classUnderTest.handleChangedValue(null,constraintsToValidate);

                expect(classUnderTest.doValid.callCount).to.equal(1);
                expect(classUnderTest.doInvalid.callCount).to.equal(0);
            });

            it('Should call Valid() if validation constraint passes : 1', function() {
                //Set constraint to nullable
                var constraintsToValidate = { };

                //Set value to 1
                classUnderTest.handleChangedValue(1,constraintsToValidate);

                expect(classUnderTest.doValid.callCount).to.equal(1);
                expect(classUnderTest.doInvalid.callCount).to.equal(0);
            });

            it('Should call Valid() if validation constraint {maxValue: 4294967295, minValue: 0} passes for long string value: -0099', function() {
                //Set constraint
                var constraintsToValidate = {
                    checkInteger: true,
                    checkNumberRange:true,
                    valueRangeConstraints:[{maxValue: 4294967295, minValue: 0}],
                };

                classUnderTest.handleChangedValue('-0099',constraintsToValidate);

                expect(classUnderTest.doValid.callCount).to.equal(0);
                expect(classUnderTest.doInvalid.callCount).to.equal(1);
            });

            it('Should call Valid() if validation constraint {maxValue: 4294967295, minValue: -4294967295} passes for long string value: 99', function() {
                //Set constraint
                var constraintsToValidate = {
                    checkInteger: true,
                    checkNumberRange:true,
                    valueRangeConstraints:[{maxValue: 4294967295, minValue: -4294967295}],
                };

                classUnderTest.handleChangedValue('99',constraintsToValidate);

                expect(classUnderTest.doValid.callCount).to.equal(1);
                expect(classUnderTest.doInvalid.callCount).to.equal(0);
            });

            it('Should call Valid() if validation constraint {maxValue: -100, minValue: -4294967295} passes for long string value: -101', function() {
                //Set constraint
                var constraintsToValidate = {
                    checkInteger: true,
                    checkNumberRange:true,
                    valueRangeConstraints:[{maxValue: -100, minValue: -4294967295}],
                };

                classUnderTest.handleChangedValue('-101',constraintsToValidate);

                expect(classUnderTest.doValid.callCount).to.equal(1);
                expect(classUnderTest.doInvalid.callCount).to.equal(0);
            });

            it('Should call Valid() if validation constraint {maxValue: -100, minValue: -4294967295} fails for long string value: 101', function() {
                //Set constraint
                var constraintsToValidate = {
                    checkInteger: true,
                    checkNumberRange:true,
                    valueRangeConstraints:[{maxValue: -100, minValue: -4294967295}],
                };

                classUnderTest.handleChangedValue('101',constraintsToValidate);

                expect(classUnderTest.doValid.callCount).to.equal(0);
                expect(classUnderTest.doInvalid.callCount).to.equal(1);
            });

            it('Should call Invalid() if validation constraint fails', function() {
                //Set constraint to not nullable
                var constraintsToValidate = {
                    checkInteger: true,
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

                classUnderTest.doValid('key','value','type');

                expect(classUnderTest.setValid.calledWith(true)).to.be.true;
                expect(classUnderTest.hideError.calledOnce).to.be.true;
                expect(optionsStub.onChangeCallback.calledTwice).to.be.true;
                expect(classUnderTest.view.getOuterWrapper().setModifier.calledOnce).to.be.true;
            });

            it('Should call onChangeCallback when value does not change', function() {
                sandbox.stub(classUnderTest, 'setValid');
                sandbox.stub(classUnderTest, 'hideError');
                sandbox.stub(classUnderTest.view.getOuterWrapper(), 'removeModifier');

                classUnderTest.doValid('key',optionsStub.value,'type');

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
                classUnderTest.doInvalid('key','value','type',message);

                expect(classUnderTest.setValid.calledWith(false)).to.be.true;
                expect(classUnderTest.showError.calledWith(message)).to.be.true;
                expect(optionsStub.onInvalidCallback.calledOnce).to.be.true;
            });
        });

        describe('showError', function() {
            it('Should display Error Message when called', function() {
                //Assemble
                var message = 'Error';
                var errorInfo = [];

                //Act
                classUnderTest.showError(message);

                errorInfo.push(classUnderTest.view.getErrorContainer().getNative().className);
                errorInfo.push(classUnderTest.view.getTextInput().getNative().className);
                errorInfo.push(classUnderTest.view.getErrorOuterContainer().getNative().className);

                //Assert
                expect(classUnderTest.view.getErrorMessage().getText()).to.equal(message);

                expect(errorInfo[0].indexOf('status_error')).to.be.gt(-1);
                expect(errorInfo[1].indexOf('ebInput_borderColor_red')).to.be.gt(-1);
                expect(errorInfo[2].indexOf('numberInput-error_displayed')).to.be.gt(-1);

            });
        });

        describe('setIndex', function() {
            it('Should update display with index', function() {
                //Assemble
                classUnderTest.baseKeyValue = 'Test';
                var keyValue = 'Key';

                //Act
                classUnderTest.setIndex(keyValue);

                //Assert
                expect(classUnderTest.getKeyValue()).to.equal(classUnderTest.baseKeyValue + keyValue);
                expect(classUnderTest.view.getKeyValue().getText()).to.equal(keyValue);
            });
        });

        describe('updateDisplayWIthKeyValue', function() {
            it('Should update display with Key Value', function() {
                //Assemble
                var keyValue = 'TestKey';

                //Act
                classUnderTest.updateDisplayWIthKeyValue(keyValue);

                //Assert
                expect(classUnderTest.view.getKeyValue().getText()).to.equal(keyValue);
            });
        });

        describe('getKeyValue', function() {
            it('Should return Key Value', function() {
                //Assemble
                classUnderTest.keyValue = 'TestKey';

                //Act
                classUnderTest.getKeyValue();

                //Assert
                expect(classUnderTest.getKeyValue()).to.equal(classUnderTest.keyValue);
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
