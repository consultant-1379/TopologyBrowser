define([
    'networkobjectlib/widgets/FormWidgets/EnumComboBoxWidget/EnumComboBoxWidget'
], function(Enum) {
    'use strict';

    describe('Enum ComboBox Widget', function() {
        var sandbox=sinon.sandbox.create(),
            enumWidget,
            enumWidget2,
            optionsStub,
            optionsStub2,
            onChangeCallback,
            onInvalidCallback,
            innerOnChangeCallback,
            innerOnInvalidCallback;

        beforeEach(function() {

            onChangeCallback = function() { };
            onInvalidCallback = function() { };
            innerOnChangeCallback = function() { };
            innerOnInvalidCallback = function() { };

            optionsStub = {
                'enumeration': {
                    'enumMembers': [
                        {
                            'key': 'dvmrp',
                            'value': 'dvmrp',
                            'description': 'Distance Vector Multicast Protocol, IGMP Type value 3'
                        },
                        {
                            'key': 'host-query',
                            'value': 'host-query',
                            'description': 'Host query, IGMP Type value 1'
                        },
                        {
                            'key': 'host-report',
                            'value': 'host-report',
                            'description': 'Host report, IGMP Type value 2'
                        }
                    ]
                },
                'key': 'addr-primary-key',
                'keySectionDisabled': true,
                'constraints': {
                    'nullable': true,
                    'validContentRegex': '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(%[\\p{N}\\p{L}]+)?'
                },
                'type': 'UNION',
                'inputTitle': 'Type: UNION, Can be null: false, Member Types: [Type: STRING], [Type: ENUM_REF]',
                'defaultValue': null,
                'value': 'dvmrp',
                'modifier': {
                    'acceptNumbers': null,
                    'acceptStrings': [
                        {
                            'valueRangeConstraints': null,
                            'validContentRegex': '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(%[\\p{N}\\p{L}]+)?',
                            'stringConstraint': true
                        }
                    ],
                    'acceptBoolean': null,
                    'acceptEnum': [
                        [
                            {
                                'key': 'dvmrp',
                                'value': 'dvmrp',
                                'description': 'Distance Vector Multicast Protocol, IGMP Type value 3'
                            },
                            {
                                'key': 'host-query',
                                'value': 'host-query',
                                'description': 'Host query, IGMP Type value 1'
                            },
                            {
                                'key': 'host-report',
                                'value': 'host-report',
                                'description': 'Host report, IGMP Type value 2'
                            }
                        ]
                    ],
                    'widgetType': 'Combo'

                },
                'onChangeCallback': onChangeCallback,
                'onInvalidCallback': onInvalidCallback,
                'innerOnChangeCallback': innerOnChangeCallback,
                'innerOnInvalidCallback': innerOnInvalidCallback
            };

            optionsStub2 = {
                'enumeration': {
                    'enumMembers': [
                        {
                            'key': 'ahp',
                            'value': 'ahp',
                            'description': 'Authentication Header Protocol'
                        },
                        {
                            'key': 'esp',
                            'value': 'esp',
                            'description': 'Encapsulation Security Payload'
                        },
                        {
                            'key': 'gre',
                            'value': 'gre',
                            'description': 'Generic Routing Encapsulation'
                        },
                        {
                            'key': 'icmp',
                            'value': 'icmp',
                            'description': 'Internet Control Message Protocol'
                        },
                        {
                            'key': 'igmp',
                            'value': 'igmp',
                            'description': 'Internet Group Management Protocol'
                        },
                        {
                            'key': 'ip',
                            'value': 'ip',
                            'description': 'Any IP protocol'
                        },
                        {
                            'key': 'ipinip',
                            'value': 'ipinip',
                            'description': 'IP in IP tunneling'
                        },
                        {
                            'key': 'ospf',
                            'value': 'ospf',
                            'description': 'Open Shortest Path First'
                        },
                        {
                            'key': 'pcp',
                            'value': 'pcp',
                            'description': 'Payload Compression Protocol'
                        },
                        {
                            'key': 'pim',
                            'value': 'pim',
                            'description': 'Protocol Independent Multicast'
                        },
                        {
                            'key': 'tcp',
                            'value': 'tcp',
                            'description': 'Transmission Control Protocol'
                        },
                        {
                            'key': 'udp',
                            'value': 'udp',
                            'description': 'User Datagram Protocol'
                        }
                    ]
                },
                'key': 'acl-protocol',
                'keySectionDisabled': true,
                'constraints': {
                    'nullable': false,
                    'numberValueRangeConstraints': [
                        {
                            'minValue': 0,
                            'maxValue': 255,
                            'isNumeric': true,
                            'isFraction': false
                        }
                    ]
                },
                'type': 'UNION',
                'inputTitle': 'Type: UNION, Default: ip, Member Types: [Type: ENUM_REF], [Type: SHORT, Range: 0 .. 255, Can be null: true]',
                'defaultValue': 'ip',
                'value': 1,
                'modifier': {
                    'acceptNumbers': [
                        {
                            'nullable': true,
                            'valueRangeConstraints': [
                                {
                                    'minValue': 0,
                                    'maxValue': 255,
                                    'isNumeric': true,
                                    'isFraction': false
                                }
                            ],
                            'valueResolution': null,
                            'numericConstraint': true,
                            'isInteger': false,
                            'isLong': false,
                            'isDouble': false,
                            'isFloat': false,
                            'isShort': true
                        }
                    ],
                    'acceptStrings': null,
                    'acceptBoolean': null,
                    'acceptEnum': [
                        [
                            {
                                'key': 'ahp',
                                'value': 'ahp',
                                'description': 'Authentication Header Protocol'
                            },
                            {
                                'key': 'esp',
                                'value': 'esp',
                                'description': 'Encapsulation Security Payload'
                            },
                            {
                                'key': 'gre',
                                'value': 'gre',
                                'description': 'Generic Routing Encapsulation'
                            },
                            {
                                'key': 'icmp',
                                'value': 'icmp',
                                'description': 'Internet Control Message Protocol'
                            },
                            {
                                'key': 'igmp',
                                'value': 'igmp',
                                'description': 'Internet Group Management Protocol'
                            },
                            {
                                'key': 'ip',
                                'value': 'ip',
                                'description': 'Any IP protocol'
                            },
                            {
                                'key': 'ipinip',
                                'value': 'ipinip',
                                'description': 'IP in IP tunneling'
                            },
                            {
                                'key': 'ospf',
                                'value': 'ospf',
                                'description': 'Open Shortest Path First'
                            },
                            {
                                'key': 'pcp',
                                'value': 'pcp',
                                'description': 'Payload Compression Protocol'
                            },
                            {
                                'key': 'pim',
                                'value': 'pim',
                                'description': 'Protocol Independent Multicast'
                            },
                            {
                                'key': 'tcp',
                                'value': 'tcp',
                                'description': 'Transmission Control Protocol'
                            },
                            {
                                'key': 'udp',
                                'value': 'udp',
                                'description': 'User Datagram Protocol'
                            }
                        ]
                    ],
                    'widgetType': 'Combo'
                },
                'onChangeCallback': onChangeCallback,
                'onInvalidCallback': onInvalidCallback,
                'innerOnChangeCallback': innerOnChangeCallback,
                'innerOnInvalidCallback': innerOnInvalidCallback
            };

            sandbox.spy(optionsStub, 'onChangeCallback') ;
            sandbox.spy(optionsStub, 'onInvalidCallback') ;
            sandbox.spy(optionsStub2, 'onChangeCallback') ;
            sandbox.spy(optionsStub2, 'onInvalidCallback') ;

            enumWidget = new Enum(optionsStub);
            enumWidget2 = new Enum(optionsStub2);

            sandbox.spy(enumWidget, 'validate') ;
            sandbox.spy(enumWidget, 'doValid') ;
            sandbox.spy(enumWidget, 'doInvalid') ;
            sandbox.spy(enumWidget2, 'validate') ;
            sandbox.spy(enumWidget2, 'doValid') ;
            sandbox.spy(enumWidget2, 'doInvalid') ;
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
                sandbox.stub(enumWidget, 'createComboBox', function() { return comboBoxUIwidget; });
                sandbox.spy(enumWidget, 'disable') ;
                sandbox.spy(enumWidget, 'createModelInfoButton') ;
                sandbox.stub(enumWidget, 'getKeyValue', function() { return valueBoxedObject; }) ;
                sandbox.spy(valueBoxedObject, 'setModifier') ;
                sandbox.spy(comboBoxUIwidget, 'addEventHandler') ;
                sandbox.spy(comboBoxUIwidget, 'attachTo') ;

                enumWidget.onViewReady();

                expect(enumWidget.getWidget()).to.not.equal(null);
                expect(enumWidget.createComboBox.callCount).to.equal(1);
                expect(valueBoxedObject.setModifier.callCount).to.equal(0);
                expect(comboBoxUIwidget.addEventHandler.callCount).to.equal(1);
                expect(comboBoxUIwidget.attachTo.callCount).to.equal(1);
                expect(enumWidget.disable.callCount).to.equal(0);
                expect(enumWidget.createModelInfoButton.callCount).to.equal(1);
            });
        });

        describe('getWidget()', function() {
            it('Should return the enum combobox widget', function() {

                //Try to recover the different kinds of ComboBox
                var comboBoxUIwidget = enumWidget.getWidget();

                expect(comboBoxUIwidget).to.not.equal(null);
                var comboBoxUIwidget2 = enumWidget2.getWidget();

                expect(comboBoxUIwidget2).to.not.equal(null);
            });
        });

        describe('titleTextBuilder()', function() {
            it('Should return the right title', function() {
                //Try to recover the different kinds of ComboBox
                var expectedUITitle = 'Type: UNION, Can be null: true';
                var stdUITitle = enumWidget.titleTextBuilder();
                expect(expectedUITitle).to.equal(stdUITitle);

                var expectedCustomUITitle='This is a widget!!';

                var customUITitle = enumWidget.titleTextBuilder(expectedCustomUITitle);
                expect(expectedCustomUITitle).to.equal(customUITitle);

            });
        });

        describe('disable()', function() {
            it('Should disable the ui combobox widget', function() {
                //Try to recover the different kinds of ComboBox
                var comboBoxWidget1 = enumWidget.getWidget();
                sandbox.spy(comboBoxWidget1, 'disable') ;
                enumWidget.disable();
                expect(comboBoxWidget1.disable.callCount).to.equal(1);

                var comboBoxWidget2 = enumWidget2.getWidget();
                sandbox.spy(comboBoxWidget2, 'disable') ;
                enumWidget2.disable();
                expect(comboBoxWidget2.disable.callCount).to.equal(1);
            });
        });

        describe('enable()', function() {
            it('Should enable the ui combobox widget', function() {
                //Try to recover the different kinds of ComboBox
                var comboBoxWidget1 = enumWidget.getWidget();
                sandbox.spy(comboBoxWidget1, 'enable') ;
                enumWidget.enable();
                expect(comboBoxWidget1.enable.callCount).to.equal(1);

                var comboBoxWidget2 = enumWidget2.getWidget();
                sandbox.spy(comboBoxWidget2, 'enable') ;
                enumWidget2.enable();
                expect(comboBoxWidget2.enable.callCount).to.equal(1);
            });
        });

        describe('createComboBox()', function() {
            it('Should draw the enum values in combobox list', function() {

                //Assert as equality of the relevant fields in the widget and in the options data
                var comboboxElement = enumWidget.createComboBox();
                comboboxElement.options.items.forEach(function(item, index) {
                    expect(item.name).to.equals(optionsStub.enumeration.enumMembers[index].key);
                    expect(item.value).to.equals(optionsStub.enumeration.enumMembers[index].value);
                    expect(item.title).to.equals(optionsStub.enumeration.enumMembers[index].description);
                });
            });
            it('Should draw the enum values that allow to change the test value', function() {

                //Assert as equality of the relevant fields in the widget and in the options data
                var comboboxElement = enumWidget2.createComboBox();
                comboboxElement.options.items.forEach(function(item, index) {
                    expect(item.name).to.equals(optionsStub2.enumeration.enumMembers[index].key);
                    expect(item.value).to.equals(optionsStub2.enumeration.enumMembers[index].value);
                    expect(item.title).to.equals(optionsStub2.enumeration.enumMembers[index].description);
                });
            });
        });

        describe('handleChangedValue()', function() {
            it('Should have been called on enum item change', function() {

                enumWidget.invalidValues = [];
                enumWidget.valuesToBeSaved = [];

                enumWidget.getWidget().setValue(optionsStub.enumeration.enumMembers[1]);
                enumWidget.handleChangedValue(optionsStub.enumeration.enumMembers[1].value);

                expect(optionsStub.onChangeCallback.callCount).to.equal(1);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].value).to.deep.equal(optionsStub.enumeration.enumMembers[1].value);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].key).to.equal('addr-primary-key');
                expect(optionsStub.onChangeCallback.getCall(0).args[0].datatype).to.equal('UNION');
            });
            it('Should have been called on text change', function() {

                enumWidget.invalidValues = [];
                enumWidget.valuesToBeSaved = [];
                var changeExpect = {'value': '1.1.1.1'};

                enumWidget.getWidget().setValue(changeExpect);
                enumWidget.handleChangedValue(changeExpect.value);

                expect(optionsStub.onChangeCallback.callCount).to.equal(1);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].value).to.deep.equal(changeExpect.value);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].key).to.equal('addr-primary-key');
                expect(optionsStub.onChangeCallback.getCall(0).args[0].datatype).to.equal('UNION');
            });
            it('Should have been called on numeric change', function() {

                enumWidget2.invalidValues = [];
                enumWidget2.valuesToBeSaved = [];
                var changeExpect = {'value': 1};

                enumWidget2.getWidget().setValue(changeExpect);
                enumWidget2.handleChangedValue(changeExpect.value);

                expect(optionsStub2.onChangeCallback.callCount).to.equal(1);
                expect(optionsStub2.onChangeCallback.getCall(0).args[0].value).to.deep.equal(changeExpect.value);
                expect(optionsStub2.onChangeCallback.getCall(0).args[0].key).to.equal('acl-protocol');
                expect(optionsStub2.onChangeCallback.getCall(0).args[0].datatype).to.equal('UNION');
            });
        });

        describe('handleChangedEvent()', function() {
            it('Should have been called on enum item change', function() {

                enumWidget.invalidValues = [];
                enumWidget.valuesToBeSaved = [];

                enumWidget.getWidget().setValue(optionsStub.enumeration.enumMembers[1]);
                enumWidget.handleChangedEvent();

                expect(enumWidget.validate.callCount).to.equal(1);
            });
            it('Should have been called on text change', function() {

                enumWidget.invalidValues = [];
                enumWidget.valuesToBeSaved = [];
                var changeExpect = {'value': '1.1.1.1'};

                enumWidget.getWidget().setValue(changeExpect);
                enumWidget.handleChangedEvent();

                expect(enumWidget.validate.callCount).to.equal(1);
            });
            it('Should have been called on numeric change', function() {

                enumWidget2.invalidValues = [];
                enumWidget2.valuesToBeSaved = [];
                var changeExpect = {'value': 1};

                enumWidget2.getWidget().setValue(changeExpect);
                enumWidget2.handleChangedEvent();

                expect(enumWidget2.validate.callCount).to.equal(1);
            });
        });

        describe('createItem()', function() {
            it('Should transform the option data to widget data', function() {

                optionsStub.enumeration.enumMembers.forEach(function(item) {
                    var tranformedValue = enumWidget.createItem(item.key, item.value, item.description);
                    expect(tranformedValue.name).to.equals(item.key);
                    expect(tranformedValue.value).to.equals(item.value);
                    expect(tranformedValue.title).to.equals(item.description);
                });
            });
        });

        describe('validate()', function() {
            it('Should have validated a correct string value', function() {
                enumWidget.validate('1.1.1.1');

                expect(enumWidget.doValid.callCount).to.equal(1);
            });
            it('Should have validated a correct numeric value', function() {
                enumWidget2.validate(254);

                expect(enumWidget2.doValid.callCount).to.equal(1);
            });
            it('Should have not validated a not correct string value', function() {
                enumWidget.validate('asdsdsdasdasdass');

                expect(enumWidget.doInvalid.callCount).to.equal(1);
            });
            it('Should bot have validated a not correct numeric value', function() {
                enumWidget2.validate(256);

                expect(enumWidget2.doInvalid.callCount).to.equal(1);
            });
        });

        describe('doValid()', function() {
            it('Should have validated a correct string value', function() {
                var changeExpect = {'value': '1.1.1.1'};

                enumWidget.getWidget().setValue(changeExpect);

                enumWidget.validate(changeExpect.value);

                expect(enumWidget.doValid.callCount).to.equal(1);
                expect(enumWidget.doValid.getCall(0).args[0]).to.equal('addr-primary-key');
                expect(enumWidget.doValid.getCall(0).args[1]).to.equal(changeExpect.value);
                expect(enumWidget.doValid.getCall(0).args[2]).to.equal('UNION');

                expect(optionsStub.onChangeCallback.callCount).to.equal(1);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].value).to.deep.equal(changeExpect.value);
                expect(optionsStub.onChangeCallback.getCall(0).args[0].key).to.equal('addr-primary-key');
                expect(optionsStub.onChangeCallback.getCall(0).args[0].datatype).to.equal('UNION');
            });
            it('Should have validated a correct numeric value', function() {
                var changeExpect = {'value': 254};

                enumWidget2.getWidget().setValue(changeExpect);

                enumWidget2.validate(changeExpect.value);

                expect(enumWidget2.doValid.callCount).to.equal(1);
                expect(enumWidget2.doValid.getCall(0).args[0]).to.equal('acl-protocol');
                expect(enumWidget2.doValid.getCall(0).args[1]).to.equal(changeExpect.value);
                expect(enumWidget2.doValid.getCall(0).args[2]).to.equal('UNION');

                expect(optionsStub2.onChangeCallback.callCount).to.equal(1);
                expect(optionsStub2.onChangeCallback.getCall(0).args[0].value).to.deep.equal(changeExpect.value);
                expect(optionsStub2.onChangeCallback.getCall(0).args[0].key).to.equal('acl-protocol');
                expect(optionsStub2.onChangeCallback.getCall(0).args[0].datatype).to.equal('UNION');
            });
        });

        describe('doInvalid()', function() {
            it('Should have validated a correct string value', function() {
                var changeExpect = {'value': 'sfdsdfsdfsdfs'};

                enumWidget.getWidget().setValue(changeExpect);

                enumWidget.validate(changeExpect.value);

                expect(enumWidget.doInvalid.callCount).to.equal(1);
                expect(enumWidget.doInvalid.getCall(0).args[0]).to.equal('addr-primary-key');
                expect(enumWidget.doInvalid.getCall(0).args[1]).to.equal(changeExpect.value);
                expect(enumWidget.doInvalid.getCall(0).args[2]).to.equal('UNION');
                expect(enumWidget.doInvalid.getCall(0).args[3]).to.equal('Input does not match regular exp');


                expect(optionsStub.onInvalidCallback.callCount).to.equal(1);
                expect(optionsStub.onInvalidCallback.getCall(0).args[0].value).to.deep.equal(changeExpect.value);
                expect(optionsStub.onInvalidCallback.getCall(0).args[0].key).to.equal('addr-primary-key');
                expect(optionsStub.onInvalidCallback.getCall(0).args[0].datatype).to.equal('UNION');
            });
            it('Should have validated a correct numeric value', function() {
                var changeExpect = {'value': 256};

                enumWidget2.getWidget().setValue(changeExpect);

                enumWidget2.validate(changeExpect.value);

                expect(enumWidget2.doInvalid.callCount).to.equal(1);
                expect(enumWidget2.doInvalid.getCall(0).args[0]).to.equal('acl-protocol');
                expect(enumWidget2.doInvalid.getCall(0).args[1]).to.equal(changeExpect.value);
                expect(enumWidget2.doInvalid.getCall(0).args[2]).to.equal('UNION');
                expect(enumWidget2.doInvalid.getCall(0).args[3]).to.equal('Number is out of range');

                expect(optionsStub2.onInvalidCallback.callCount).to.equal(1);
                expect(optionsStub2.onInvalidCallback.getCall(0).args[0].value).to.deep.equal(changeExpect.value);
                expect(optionsStub2.onInvalidCallback.getCall(0).args[0].key).to.equal('acl-protocol');
                expect(optionsStub2.onInvalidCallback.getCall(0).args[0].datatype).to.equal('UNION');
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

                sandbox.spy(enumWidget2.view, 'showError') ;
                enumWidget2.showError(expectedMessage1);
                expect(enumWidget2.view.showError.callCount).to.equal(1);
                expect(enumWidget2.view.showError.getCall(0).args[0]).to.equal(expectedMessage1);
            });
        });

        describe('hideError()', function() {
            it('Should hidden the error message', function() {
                //Try to recover the different kinds of ComboBox
                sandbox.spy(enumWidget.view, 'hideError') ;
                enumWidget.hideError();
                expect(enumWidget.view.hideError.callCount).to.equal(1);

                sandbox.spy(enumWidget2.view, 'hideError') ;
                enumWidget2.hideError();
                expect(enumWidget2.view.hideError.callCount).to.equal(1);
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

    });
});
