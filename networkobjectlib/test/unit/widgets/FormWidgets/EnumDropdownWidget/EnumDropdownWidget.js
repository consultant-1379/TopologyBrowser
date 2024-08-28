define([
    'networkobjectlib/widgets/FormWidgets/EnumDropdownWidget/EnumDropdownWidget'
], function(Enum) {
    'use strict';

    describe('Enum Dropdown Widget', function() {
        var sandbox,
            enumWidget,
            enumWidget2,
            optionsStub,
            duplicateEnumStub,
            onChangeCallback,
            onInvalidCallback,
            innerOnChangeCallback,
            innerOnInvalidCallback;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            onChangeCallback = function() {

            };
            onInvalidCallback = function() {

            };
            innerOnChangeCallback = function() {

            };
            innerOnInvalidCallback = function() {

            };

            optionsStub = {
                'key': 'collectLogsStatus',
                'value': 'Select a Value',
                'immutable': false,
                'writeBehavior': 'PERSIST',
                'readBehavior': 'FROM_PERSISTENCE',
                'type': 'ENUM_REF',
                'constraints': null,
                'defaultValue': null,
                'description': 'Status of logs collection, initiated with operation collectAutIntLogs.',
                'enumeration': {
                    'key': 'CollectLogsStatus',
                    'description': 'CollectLogsStatus',
                    'enumMembers': [
                        {
                            'key': 'COLLECTING',
                            'value': 0,
                            'description': 'Logs collection ongoing.'
                        },
                        {
                            'key': 'FAILED',
                            'value': 1,
                            'description': 'Log collection failed.'
                        },
                        {
                            'key': 'FINISHED',
                            'value': 2,
                            'description': 'Logs collection has finished OK.'
                        },
                        {
                            'key': 'NOT_STARTED',
                            'value': 3,
                            'description': 'Initial value.'
                        }
                    ]
                },
                isMultiEdit: true,
                onChangeCallback: onChangeCallback,
                onInvalidCallback: onInvalidCallback,
                innerOnChangeCallback: innerOnChangeCallback,
                innerOnInvalidCallback: innerOnInvalidCallback
            };
            duplicateEnumStub = {
                'key': 'administrativeState',
                'writeBehavior': 'PERSIST_AND_DELEGATE',
                'readBehavior': 'FROM_PERSISTENCE',
                'userExposure': 'ALWAYS',
                'immutable': false,
                'type': 'ENUM_REF',
                'constraints': null,
                'activeChoiceCase': null,
                'defaultValue': 'UNLOCKED',
                'description': 'The administrative state.',
                'namespaceversions': {
                    'ReqAntennaSystem': [
                        '3.21.0'
                    ]
                },
                'trafficDisturbances': 'Changing this attribute can cause loss of traffic.',
                'precondition': '',
                'dependencies': '',
                'sideEffects': '',
                'unit': '',
                'multiplicationFactor': '',
                'lifeCycle': {
                    'state': 'CURRENT',
                    'description': null
                },
                'enumeration': {
                    'key': 'AdmState',
                    'description': 'Administrative state of a resource.',
                    'enumMembers': [
                        {
                            'key': 'memberNamespace1$$$LOCKED',
                            'value': 0,
                            'description': 'LOCKEDdescription_INDEX_0.',
                            'lifeCycleState': 'CURRENT'
                        },
                        {
                            'key': 'memberNamespace2$$$LOCKED',
                            'value': 1,
                            'description': 'LOCKEDdescription_INDEX_1',
                            'lifeCycleState': 'CURRENT'
                        },
                        {
                            'key': 'UNLOCKED',
                            'value': 2,
                            'description': 'UNLOCKEDdescription',
                            'lifeCycleState': 'CURRENT'
                        },
                        {
                            'key': 'SHUTTINGDOWN',
                            'value': 3,
                            'description': 'SHUTTINGDOWNdescription',
                            'lifeCycleState': 'CURRENT'
                        }
                    ]
                },
                isMultiEdit: undefined,
                onChangeCallback: onChangeCallback,
                onInvalidCallback: onInvalidCallback,
                innerOnChangeCallback: innerOnChangeCallback,
                innerOnInvalidCallback: innerOnInvalidCallback
            };
            sandbox.spy(optionsStub, 'onChangeCallback') ;
            sandbox.spy(optionsStub, 'onInvalidCallback') ;
            sandbox.spy(duplicateEnumStub, 'onChangeCallback') ;
            sandbox.spy(duplicateEnumStub, 'onInvalidCallback') ;

            enumWidget = new Enum(optionsStub);
            enumWidget2 = new Enum(duplicateEnumStub);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onViewReady()', function() {
            it('Should create the view components for the widget', function() {
                //Create the view components for the ComboBox
                var valueBoxedObject = {'setModifier': function() {} };
                var comboBoxUIwidget = enumWidget.getWidget();
                sandbox.stub(enumWidget, 'createDropdown', function() { return comboBoxUIwidget; });
                sandbox.stub(enumWidget, 'getKeyValue', function() { return valueBoxedObject; }) ;
                sandbox.spy(valueBoxedObject, 'setModifier') ;
                sandbox.spy(comboBoxUIwidget, 'attachTo') ;

                enumWidget.onViewReady();

                expect(enumWidget.getWidget()).to.not.equal(null);
                expect(enumWidget.createDropdown.callCount).to.equal(1);
                expect(valueBoxedObject.setModifier.callCount).to.equal(0);
                expect(comboBoxUIwidget.attachTo.callCount).to.equal(1);
            });
        });

        describe('getWidget()', function() {
            it('Should return the enum combobox widget', function() {

                //Try to recover the Dropdown
                var comboBoxUIwidget = enumWidget.getWidget();

                expect(comboBoxUIwidget).to.not.equal(null);
            });
        });

        describe('createDropdown()', function() {
            it('Should draw the enum values in dropdown list', function() {

                //Assert as equality of the relevant fields in the widget and in the options data
                var dropdownElement = enumWidget.createDropdown();
                expect(dropdownElement).to.not.equal(null);

                // remove Select a Value (null option)
                dropdownElement.options.items.shift();

                dropdownElement.options.items.forEach(function(item, index) {
                    expect(item.name).to.equals(optionsStub.enumeration.enumMembers[index].key);
                    expect(item.value).to.equals(optionsStub.enumeration.enumMembers[index].value);
                    expect(item.title).to.equals(optionsStub.enumeration.enumMembers[index].description);
                });
            });
        });

        describe('createDropdown()', function() {
            it('Should draw duplicated enum values in the dropdown list', function() {

                //Assert as equality of the relevant fields in the widget and in the options data
                var dropdownElement = enumWidget2.createDropdown();
                expect(dropdownElement).to.not.equal(null);

                dropdownElement.options.items.forEach(function(item, index) {
                    var actualEnumKey, actualDescription;
                    if (duplicateEnumStub.enumeration.enumMembers[index].key.indexOf('$$$') !== -1) {
                        return actualEnumKey = duplicateEnumStub.enumeration.enumMembers[index].key.split('$$$')[1],
                        actualDescription = duplicateEnumStub.enumeration.enumMembers[index].description
                                + ' | nameSpace: ' + duplicateEnumStub.enumeration.enumMembers[index].key;
                    }
                    return actualEnumKey = duplicateEnumStub.enumeration.enumMembers[index].key,
                    actualDescription = duplicateEnumStub.enumeration.enumMembers[index].description;

                    // eslint-disable-next-line no-unreachable
                    expect(item.name).to.equals(actualEnumKey);
                    expect(item.value).to.equals(duplicateEnumStub.enumeration.enumMembers[index].value);
                    expect(item.title).to.equals(actualDescription);
                });
            });
        });


        describe('handleChangedValue()', function() {
            it('Should  have been called on enum item change', function() {

                enumWidget.invalidValues = [];
                enumWidget.valuesToBeSaved = [];

                enumWidget.handleChangedValue(1);

                expect(optionsStub.onChangeCallback.callCount).to.equal(1);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].value).to.deep.equal(1);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].key).to.equal('collectLogsStatus');
                expect(optionsStub.onChangeCallback.getCall(0).args[0].datatype).to.equal('ENUM_REF');
            });
        });

        describe('createNullButton()', function() {
            it('Should create the button set to null', function() {

                var button = enumWidget.createNullButton(enumWidget.getWidget());
                expect(button).to.not.equal(null);
            });
        });
        describe('showError()', function() {
            it('Should shown the error message', function() {
                //Try to recover the different kinds of ComboBox
                var expectedMessage1 = 'Input does not match regular exp';
                sandbox.spy(enumWidget.view, 'showError') ;
                enumWidget.showError(expectedMessage1);
                expect(enumWidget.view.showError.callCount).to.equal(1);
                expect(enumWidget.view.showError.getCall(0).args[0]).to.equal(expectedMessage1);

            });
        });

        describe('hideError()', function() {
            it('Should hidden the error message', function() {
                //Try to recover the different kinds of ComboBox
                sandbox.spy(enumWidget.view, 'hideError') ;
                enumWidget.hideError();
                expect(enumWidget.view.hideError.callCount).to.equal(1);

            });
        });

        describe('setIndex()', function() {
            it('Should set the new combobox selection index', function() {
                //Try to recover the different kinds of ComboBox
                var expectedIndex = 1;
                var expectedKey = enumWidget.baseKeyValue + expectedIndex;

                sandbox.spy(enumWidget, 'setKeyValue') ;
                sandbox.spy(enumWidget, 'updateDisplayWIthKeyValue') ;

                enumWidget.setIndex(expectedIndex);

                expect(enumWidget.setKeyValue.callCount).to.equal(1);
                expect(enumWidget.setKeyValue.getCall(0).args[0]).to.equal(expectedKey);
                expect(enumWidget.updateDisplayWIthKeyValue.callCount).to.equal(1);
                expect(enumWidget.updateDisplayWIthKeyValue.getCall(0).args[0]).to.equal(expectedIndex);
            });
        });

        describe('updateDisplayWIthKeyValue()', function() {
            it('Should update the selected key value', function() {
                //Try to recover the different kinds of ComboBox
                var expectedIndex = 1;
                var expectedKey = enumWidget.baseKeyValue + expectedIndex;
                var valueBoxedObject = {'setText': function() {} };
                enumWidget.view.getKeyValue = function() { return valueBoxedObject; } ;
                sandbox.spy(valueBoxedObject, 'setText') ;

                enumWidget.updateDisplayWIthKeyValue(expectedKey);

                sandbox.spy(enumWidget, 'setKeyValue') ;
                sandbox.spy(enumWidget, 'updateDisplayWIthKeyValue') ;

                expect(valueBoxedObject.setText.callCount).to.equal(1);
                expect(valueBoxedObject.setText.getCall(0).args[0]).to.equal(expectedKey);
            });
        });

        describe('setKeyValue()/getKeyValue()', function() {
            it('Should set and read a key value', function() {
                //Try to recover the different kinds of ComboBox
                var expectedIndex = 1;
                var expectedKey = enumWidget.baseKeyValue + expectedIndex;

                enumWidget.setKeyValue(expectedKey);
                var foundKeyValue = enumWidget.getKeyValue(expectedKey);

                expect(expectedKey).to.equal(foundKeyValue);
            });
        });

        describe('createDropdown()', function() {
            it('should populate a placeholder in SelectBox, If it is multi-edit flow', function() {
                var dropdownElement = enumWidget.createDropdown();
                expect(dropdownElement).to.not.equal(null);

                var expectedPlaceHolderValue  = 'Select a Value';
                expect(dropdownElement.options.placeholder).to.equal(expectedPlaceHolderValue);

            });
        });

    });
});
