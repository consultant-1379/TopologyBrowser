define([
    'networkobjectlib/widgets/FormWidgets/ListWidgetContainer/ListWidgetContainer'
], function(ListWidgetContainer) {
    'use strict';

    describe('List Widget Container', function() {
        var sandbox,
            listWidgetContainerInvalid,
            listWidgetContainerValid,
            optionsStubInvalid,
            optionsStubValid;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            optionsStubInvalid = {
                'activeChoiceCase': null,
                'constraints': {
                    'nullable': false,
                    'uniqueMembers': true,
                    'valueRangeConstraints': [{
                        'minValue': 0,
                        'maxValue': 8
                    }]
                },
                'expanded': false,
                'defaultValue': ['NOT_DEFINED'],
                'type': 'LIST',
                'key': 'adminQuality',
                'value': ['QL_SSU_A','NOT_DEFINED', 'NOT_DEFINED'],
                'listReference': {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': null,
                    'immutable': false,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': null,
                    'namespaceversions': {},
                    'trafficDisturbances': '',
                    'enumeration': {
                        'key': 'QualityLevel',
                        'description': 'The synchronization quality levels.\n\nDependency to the attribute telecomStandard:\nOPTION_I: restricts the enum range to 0-3, 17-18.\nOPTION_II: restricts the enum range to 5-11, 17-18.\nOPTION_III: restricts the enum range to 14-15, 17-18.',
                        'enumMembers': [
                            {
                                'key': 'QL_PRC',
                                'value': 'QL_PRC',
                                'description': 'QL_PRC'
                            },
                            {
                                'key': 'QL_SSU_A',
                                'value': 'QL_SSU_A',
                                'description': 'QL_SSU_A'
                            },
                            {
                                'key': 'QL_SSU_B',
                                'value': 'QL_SSU_B',
                                'description': 'QL_SSU_B'
                            },
                            {
                                'key': 'QL_SEC_QL_EEC',
                                'value': 'QL_SEC_QL_EEC',
                                'description': 'QL_SEC_QL_EEC'
                            },
                            {
                                'key': 'QL_PRS',
                                'value': 'QL_PRS',
                                'description': 'QL_PRS'
                            },
                            {
                                'key': 'QL_STU',
                                'value': 'QL_STU',
                                'description': 'QL_STU'
                            },
                            {
                                'key': 'QL_ST2',
                                'value': 'QL_ST2',
                                'description': 'QL_ST2'
                            },
                            {
                                'key': 'QL_TNC',
                                'value': 'QL_TNC',
                                'description': 'QL_TNC'
                            },
                            {
                                'key': 'QL_ST3E',
                                'value': 'QL_ST3E',
                                'description': 'QL_ST3E'
                            },
                            {
                                'key': 'NOT_DEFINED',
                                'value': 'NOT_DEFINED',
                                'description': 'NOT_DEFINED'
                            }]
                    }
                },
                onChangeCallback: sinon.stub(),
                onInvalidCallback: sinon.stub()
            };
            optionsStubValid = {
                'activeChoiceCase': null,
                'constraints': {
                    'nullable': false,
                    'uniqueMembers': true,
                    'valueRangeConstraints': [{
                        'minValue': 0,
                        'maxValue': 8
                    }]
                },
                'expanded': false,
                'defaultValue': ['NOT_DEFINED'],
                'type': 'LIST',
                'key': 'adminQuality',
                'value': ['QL_SSU_A','NOT_DEFINED'],
                'listReference': {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': null,
                    'immutable': false,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': null,
                    'namespaceversions': {},
                    'trafficDisturbances': '',
                    'enumeration': {
                        'key': 'QualityLevel',
                        'description': 'The synchronization quality levels.\n\nDependency to the attribute telecomStandard:\nOPTION_I: restricts the enum range to 0-3, 17-18.\nOPTION_II: restricts the enum range to 5-11, 17-18.\nOPTION_III: restricts the enum range to 14-15, 17-18.',
                        'enumMembers': [
                            {
                                'key': 'QL_PRC',
                                'value': 'QL_PRC',
                                'description': 'QL_PRC'
                            },
                            {
                                'key': 'QL_SSU_A',
                                'value': 'QL_SSU_A',
                                'description': 'QL_SSU_A'
                            },
                            {
                                'key': 'QL_SSU_B',
                                'value': 'QL_SSU_B',
                                'description': 'QL_SSU_B'
                            },
                            {
                                'key': 'QL_SEC_QL_EEC',
                                'value': 'QL_SEC_QL_EEC',
                                'description': 'QL_SEC_QL_EEC'
                            },
                            {
                                'key': 'QL_PRS',
                                'value': 'QL_PRS',
                                'description': 'QL_PRS'
                            },
                            {
                                'key': 'QL_STU',
                                'value': 'QL_STU',
                                'description': 'QL_STU'
                            },
                            {
                                'key': 'QL_ST2',
                                'value': 'QL_ST2',
                                'description': 'QL_ST2'
                            },
                            {
                                'key': 'QL_TNC',
                                'value': 'QL_TNC',
                                'description': 'QL_TNC'
                            },
                            {
                                'key': 'QL_ST3E',
                                'value': 'QL_ST3E',
                                'description': 'QL_ST3E'
                            },
                            {
                                'key': 'NOT_DEFINED',
                                'value': 'NOT_DEFINED',
                                'description': 'NOT_DEFINED'
                            }]
                    }
                }
            };
            listWidgetContainerInvalid = new ListWidgetContainer(optionsStubInvalid);
            listWidgetContainerValid = new ListWidgetContainer(optionsStubValid);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });


        describe('handleChangedValue', function() {
            beforeEach(function() {
                sandbox.stub(listWidgetContainerInvalid, 'doInvalid');
                sandbox.stub(listWidgetContainerInvalid, 'addErrorMessageToWidget');
                sandbox.stub(listWidgetContainerInvalid, 'removeErrorMessageFromWidget');

                sandbox.stub(listWidgetContainerValid, 'doInvalid');
                sandbox.stub(listWidgetContainerValid, 'addErrorMessageToWidget');
                sandbox.stub(listWidgetContainerValid, 'removeErrorMessageFromWidget');
            });
            it('Should call InValid() if validation constraint fails :list of 3 entries', function() {
                listWidgetContainerInvalid.validateUniqueMembersAndUpdateWidgets('');

                expect(listWidgetContainerInvalid.doInvalid.callCount).to.equal(1);
                expect(listWidgetContainerInvalid.addErrorMessageToWidget.callCount).to.equal(2);
            });
            it('Should call Valid() if validation constraint passes :2 unique values in list', function() {
                listWidgetContainerValid.validateUniqueMembersAndUpdateWidgets('');

                expect(listWidgetContainerValid.doInvalid.callCount).to.equal(0);
                expect(listWidgetContainerValid.addErrorMessageToWidget.callCount).to.equal(0);
            });
            it('Should remove errors if removing entry removes duplication', function() {
                   //Do validation to add error messages.
                listWidgetContainerInvalid.validateUniqueMembersAndUpdateWidgets('');
                   //Remove last entry.
                listWidgetContainerInvalid.minusAction(2);

                expect(listWidgetContainerInvalid.removeErrorMessageFromWidget.callCount).to.equal(1);
            });
            it('Should add errors when new default value is added and creates duplication', function() {
                 //Add entry with default value "NOT_DEFINED".
                listWidgetContainerInvalid.plusAction();

                expect(listWidgetContainerInvalid.doInvalid.callCount).to.equal(1);
                expect(listWidgetContainerInvalid.addErrorMessageToWidget.callCount).to.equal(3);
            });

        });
    });
});
