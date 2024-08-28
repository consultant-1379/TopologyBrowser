define([
    'networkobjectlib/widgets/FormWidgets/BitsComboMultiSelectWidget/BitsComboMultiSelectWidget',
    'widgets/ComboMultiSelect'
], function(BitsComboMultiSelectWidget, ComboMultiSelect) {
    'use strict';

    describe('BitsComboMultiSelectWidget', function() {
        var sandbox,
            classUnderTest,
            optionsStub,
            bitsMembers,
            constraints,
            onChangeCallback,
            onInvalidCallback,
            innerOnChangeCallback,
            innerOnInvalidCallback;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            onChangeCallback = function() { };
            onInvalidCallback = function() { };
            innerOnChangeCallback = function() { };
            innerOnInvalidCallback = function() { };

            bitsMembers = [
                {
                    key: 'create',
                    value: 0
                },
                {
                    key: 'read',
                    value: 1
                },
                {
                    key: 'update',
                    value: 2
                },
                {
                    key: 'delete',
                    value: 3
                },
                {
                    key: 'exec',
                    value: 4
                }
            ];

            constraints = {
                bitsConstraint: {},
                nullable: true
            };

            optionsStub = {
                bitsMembers: bitsMembers,
                onChangeCallback: onChangeCallback,
                onInvalidCallback: onInvalidCallback,
                innerOnChangeCallback: innerOnChangeCallback,
                innerOnInvalidCallback: innerOnInvalidCallback,
                key: 'access-operations',
                keySectionDisabled: false,
                constraints: constraints,
                inputTitle: 'Type: UNION, Can be null: true, Member Types: [Type: STRING], [Type: BITS]',
                type: 'UNION',
                defaultValue: '*',
                value: 'read',
                modifier: {
                    'acceptNumbers': null,
                    'acceptStrings': null,
                    'acceptBoolean': null,
                    'acceptEnum': null,
                    'widgetType': 'Bits'

                },
                description: ''
            };

            classUnderTest = new BitsComboMultiSelectWidget(optionsStub);

        });

        afterEach(function() {
            sandbox.restore();
            classUnderTest = undefined;
        });

        describe('init()', function() {
            var options, expectedValues, expectedItemsList;
            beforeEach(function() {
                options = {
                    bitsMembers: [{
                        key: 'create',
                        value: 0
                    },
                    {
                        key: 'read',
                        value: 1
                    }]
                };
                expectedValues = ['create', 'read'];
                expectedItemsList = [
                    {
                        name: 'create',
                        value: 0,
                        title: 'create'
                    },
                    {
                        name: 'read',
                        value: 1,
                        title: 'read'
                    }
                ];
                sandbox.spy(classUnderTest, 'validate');
            });

            it('Should init the widget', function() {
                //Action
                classUnderTest.init(options);

                //Assert
                expect(classUnderTest.allBitsValues).to.eql(expectedValues);
                expect(classUnderTest.itemsList).to.eql(expectedItemsList);

            });
        });

        describe('onViewReady()', function() {
            var valueBoxedObject, comboMultiSelectWidget;
            beforeEach(function() {
                valueBoxedObject = {'setModifier': function() {} };
                comboMultiSelectWidget = new ComboMultiSelect({
                    value: this.selectedValues,
                    items: this.itemsList,
                    autoComplete: {
                        enabled: true,
                        message: {
                            notFound: 'No Result'
                        }
                    },
                    modifiers: [{
                        name: 'width',
                        value: 'full'
                    }],
                });
                sandbox.stub(classUnderTest.view, 'getKeyValue', function() { return valueBoxedObject; });
                sandbox.stub(classUnderTest, 'createComboMultiSelect', function() { return comboMultiSelectWidget; });
                sandbox.spy(classUnderTest, 'disable');
                sandbox.spy(valueBoxedObject, 'setModifier');
                sandbox.spy(classUnderTest, 'createModelInfoButton');
                sandbox.spy(comboMultiSelectWidget, 'addEventHandler');
                sandbox.spy(comboMultiSelectWidget, 'attachTo');
            });

            it('Should create the view components for the widget', function() {
               //Action
                classUnderTest.onViewReady();

                //Assert
                expect(classUnderTest.createComboMultiSelect.callCount).to.equal(1);

                expect(valueBoxedObject.setModifier.callCount).to.equal(0);
                expect(classUnderTest.disable.callCount).to.equal(0);
                expect(classUnderTest.createModelInfoButton.callCount).to.equal(1);

                expect(comboMultiSelectWidget.addEventHandler.callCount).to.equal(1);
                expect(comboMultiSelectWidget.attachTo.callCount).to.equal(1);

            });

            it('Should create the view components and disable for readOnly', function() {
                //Assemble
                classUnderTest.options.readOnly = true;

                //Action
                classUnderTest.onViewReady();

                //Assert
                expect(classUnderTest.disable.callCount).to.equal(1);

            });

            it('Should create the view components and hide keyValue for keySectionDisabled', function() {
                //Assemble
                classUnderTest.options.keySectionDisabled = true;

                //Action
                classUnderTest.onViewReady();

                //Assert
                expect(valueBoxedObject.setModifier.callCount).to.equal(1);

            });
        });

        describe('createComboMultiSelect()', function() {
            it('Should draw the enum values in combobox list', function() {

                //Assert as equality of the relevant fields in the widget and in the options data
                var widget = classUnderTest.createComboMultiSelect();
                widget.options.items.forEach(function(item, index) {
                    expect(item.name).to.equals(optionsStub.bitsMembers[index].key);
                    expect(item.value).to.equals(optionsStub.bitsMembers[index].value);
                    expect(item.title).to.equals(optionsStub.bitsMembers[index].key);
                });
                expect(classUnderTest.selectedValues.length).to.equal(2);
            });
        });

        describe('getValuesFromOptions()', function() {

            [
                {
                    description: 'empty array',
                    options: null,
                    expected: []

                },
                {
                    description: 'empty array',
                    options: '',
                    expected: []

                },
                {
                    description: '[read exec]',
                    options: 'read exec',
                    expected: ['read', 'exec']

                },
                {
                    description: '[create, read, update, delete, exec]',
                    options: '*',
                    expected: ['create','read' , 'update', 'delete', 'exec']

                }
            ].forEach(function(test) {
                it('Should get values \'' + test.description + '\' for option value: ' + test.options, function() {
                    //Assemble
                    classUnderTest.options.value = test.options;

                    //Action
                    var actual = classUnderTest.getValuesFromOptions();

                    //Assert
                    expect(actual).to.eql(test.expected);
                });
            });

        });

        describe('handleChangedEvent()', function() {

            beforeEach(function() {
                sandbox.spy(classUnderTest, 'validate');
                sandbox.spy(classUnderTest, 'doValid');
                sandbox.spy(classUnderTest, 'doInvalid');
            });

            it('Should handle change event for validation failures', function() {
                //Assemble
                sandbox.stub(classUnderTest.widget, 'getValue', function() { return []; });
                classUnderTest.options.constraints.nullable = false;

                //Action
                classUnderTest.handleChangedEvent();

                //Assert
                expect(classUnderTest.validate.callCount).to.equal(1);
                expect(classUnderTest.doInvalid.callCount).to.equal(1);


            });

            it('Should handle change event for success validation', function() {
                //Action
                classUnderTest.handleChangedEvent();

                //Assert
                expect(classUnderTest.validate.callCount).to.equal(1);
                expect(classUnderTest.doValid.callCount).to.equal(1);

            });
        });

        describe('validate()', function() {

            beforeEach(function() {
                constraints = {
                    isNullable: true,
                    validContentRegex: [],
                    bitsConstraint: {}
                };
                sandbox.spy(classUnderTest, 'validate');
            });

            it('Should throw error "Input cannot be null" when null values not accept', function() {
                constraints.isNullable = false;
                try {
                    classUnderTest.validate([],constraints);
                } catch (e) {
                    expect(e.message).to.equal('Input cannot be null');
                }
                expect(classUnderTest.validate.threw()).to.equal(true);

            });

            it('Should not throw error "Input cannot be null" when null values are accept', function() {
                try {
                    classUnderTest.validate([],constraints);
                } catch (e) {
                    expect(e.message).to.equal('Input cannot be null');
                }
                expect(classUnderTest.validate.threw()).to.equal(false);

            });

            it('Should throw error "Invalid bits value" when bitsConstraints set', function() {
                constraints.bitsConstraint.read = true;
                try {
                    classUnderTest.validate(['read'],constraints);
                } catch (e) {
                    expect(e.message).to.equal('Invalid bits value');
                }
                expect(classUnderTest.validate.threw()).to.equal(true);

            });

            it('Should not throw error "Invalid bits value" when bitsConstraints not set', function() {
                try {
                    classUnderTest.validate(['read'],constraints);
                } catch (e) {
                    expect(e.message).to.equal('Invalid bits value');
                }
                expect(classUnderTest.validate.threw()).to.equal(false);

            });

            it('Should throw error "Invalid bits value" for invalid values', function() {
                try {
                    classUnderTest.validate(['reads123'],constraints);
                } catch (e) {
                    expect(e.message).to.equal('Invalid bits value');
                }
                expect(classUnderTest.validate.threw()).to.equal(true);

            });

            it('Should validate bits values', function() {
                try {
                    classUnderTest.validate(['read', 'create'],constraints);
                } catch (e) {
                    expect(e.message).to.equal('Invalid bits value');
                }
                expect(classUnderTest.validate.threw()).to.equal(false);

            });
        });

        describe('doValid()', function() {

            beforeEach(function() {
                sandbox.spy(classUnderTest, 'isInputValuesIdentical');
                sandbox.spy(classUnderTest.options, 'onChangeCallback');
            });

            it('Should not set valid for a same value', function() {
                //Action
                classUnderTest.doValid('access-operations', 'read', 'UNION');

                //Assert
                expect(classUnderTest.isValid()).to.equal(true);
                expect(classUnderTest.isInputValuesIdentical.callCount).to.equal(1);
                expect(classUnderTest.view.getOuterWrapper().hasModifier('valid')).to.equals(false);
                expect(classUnderTest.options.onChangeCallback.callCount).to.equal(1);
            });

            ['create', 'create read', '*', null].forEach(function(test) {
                it('Should set valid for a value \'' + test + '\'', function() {
                    //Action
                    classUnderTest.doValid('access-operations', test, 'UNION');

                    //Assert
                    expect(classUnderTest.isValid()).to.equal(true);
                    expect(classUnderTest.isInputValuesIdentical.callCount).to.equal(1);
                    expect(classUnderTest.view.getOuterWrapper().hasModifier('valid')).to.equals(true);
                    expect(classUnderTest.options.onChangeCallback.callCount).to.equal(1);
                });
            });

        });

        describe('doInvalid()', function() {
            it('Should not set valid for a error', function() {
                //Assemble
                var message = 'Some message';
                sandbox.spy(classUnderTest, 'isInputValuesIdentical');
                sandbox.spy(classUnderTest.options, 'onInvalidCallback');
                sandbox.spy(classUnderTest, 'showError');

                //Action
                classUnderTest.doInvalid('access-operations', 'read', 'UNION', 'Some message');

                //Assert
                expect(classUnderTest.isValid()).to.equal(false);
                expect(classUnderTest.showError.callCount).to.equal(1);
                expect(classUnderTest.showError.getCall(0).args[0]).to.equal(message);
                expect(classUnderTest.view.getOuterWrapper().hasModifier('valid')).to.equals(false);
                expect(classUnderTest.options.onInvalidCallback.callCount).to.equal(1);
            });


        });

        describe('isInputValuesIdentical()', function() {
            it('Should check input value is same as previous value or not', function() {
                [
                    {
                        value: '',
                        previousValue: '',
                        expected: true
                    },
                    {
                        value: null,
                        previousValue: null,
                        expected: true
                    },
                    {
                        value: '*',
                        previousValue: '*',
                        expected: true
                    },
                    {
                        value: 'read',
                        previousValue: 'read',
                        expected: true
                    },
                    {
                        value: 'create read',
                        previousValue: 'read create',
                        expected: true
                    },
                    {
                        value: '',
                        previousValue: 'read',
                        expected: false
                    },
                    {
                        value: 'read',
                        previousValue: '',
                        expected: false
                    },
                    {
                        value: null,
                        previousValue: '',
                        expected: false
                    },
                    {
                        value: '',
                        previousValue: null,
                        expected: false
                    },
                    {
                        value: null,
                        previousValue: 'read',
                        expected: false
                    },
                    {
                        value: 'read',
                        previousValue: null,
                        expected: false
                    },
                    {
                        value: '*',
                        previousValue: null,
                        expected: false
                    },
                    {
                        value: '*',
                        previousValue: 'create delete read update exec',
                        expected: false
                    },
                ].forEach(function(test) {
                    expect(classUnderTest.isInputValuesIdentical(test.value, test.previousValue)).to.equals(test.expected);
                });

            });
        });

    });
});
