define([
    'networkobjectlib/widgets/modelInfoDisplay/ModelInfoDisplay'
], function(ModelInfoDisplay) {
    'use strict';

    describe('Number Input Widget', function() {
        var sandbox,
            classUnderTestAllAttr,
            classUnderTestNoAttr,
            classUnderTestBooleanDefault,
            classUnderTestList,
            optionsStubAllAttr,
            optionsStubAllAttrUndefined,
            optionsStubBooleanDefaultValue,
            optionsStubList;


        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            optionsStubAllAttr = {
                'attribute': {
                    'key': 'userLabel',
                    'namespace': 'ERBS_NODE_MODEL',
                    'namespaceVersion': '8.1.160',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': [{'minValue': 2,'maxValue': 2},{'minValue': 3,'maxValue': 3},{'minValue': 5,'maxValue': 6},{'minValue': 20,'maxValue': 20},{'minValue': 0,'maxValue': 128},{'minValue': 256,'maxValue': 320},{'minValue': 5,'maxValue': 5},{'minValue': 10,'maxValue': 10}],
                        'validContentRegex': '0-9',
                        'valueResolution': 25,
                        'uniqueMembers': true
                    },
                    'activeChoiceCase': null,
                    'defaultValue': 'default',
                    'description': 'Label for free use.\n',
                    'namespaceversions': {'ERBS_NODE_MODEL': ['8.1.160']},
                    'trafficDisturbances': 'value',
                    'precondition': 'The support unit HW is disconnected from the corresponding PIUs (otherwise the SupportUnit MO will be recreated).',
                    'dependencies': 'This attribute is effective only when ANR for LTE feature is activated.',
                    'sideEffects': 'Side Effects of an attribute.',
                    'unit': 'microsecond',
                    'multiplicationFactor': '15'
                },
                'moType': 'EUtranCellFDD'
            };

            optionsStubAllAttrUndefined = {
                'attribute': {
                    'key': 'userLabel',
                    'namespace': undefined,
                    'namespaceVersion': undefined,
                    'writeBehavior': undefined,
                    'readBehavior': undefined,
                    'userExposure': undefined,
                    'immutable': undefined,
                    'type': undefined,
                    'constraints': {
                        'nullable': undefined,
                        'valueRangeConstraints': undefined,
                        'validContentRegex': undefined
                    },
                    'activeChoiceCase': undefined,
                    'defaultValue': undefined,
                    'description': 'Label for free use.\n',
                    'namespaceversions': {'': ['']},
                    'trafficDisturbances': undefined,
                    'precondition': undefined,
                    'dependencies': undefined,
                    'sideEffects': undefined,
                    'unit': undefined,
                    'multiplicationFactor': undefined

                },
                'moType': 'EUtranCellFDD'
            };

            optionsStubBooleanDefaultValue = {
                'attribute': {
                    'key': 'userLabel',
                    'namespace': undefined,
                    'namespaceVersion': undefined,
                    'type': 'BOOLEAN',
                    'defaultValue': false
                },
                'moType': 'EUtranCellFDD'
            };

            optionsStubList = {
                'attribute': {
                    'key': 'emergencyAreaId',
                    'type': 'LIST',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': [{'minValue': 2,'maxValue': 2},{'minValue': 3,'maxValue': 3},{'minValue': 5,'maxValue': 6},{'minValue': 20,'maxValue': 20},{'minValue': 0,'maxValue': 128},{'minValue': 256,'maxValue': 320},{'minValue': 5,'maxValue': 5},{'minValue': 10,'maxValue': 10}],
                        'uniqueMembers': true
                    },
                    'listReference': {
                        'constraints': {
                            'nullable': true,
                            'valueRangeConstraints': [{'minValue': -1,'maxValue': 2222222}]
                        }
                    }
                },
                'moType': 'EUtranCellFDD'
            };

            classUnderTestAllAttr = new ModelInfoDisplay(optionsStubAllAttr);
            classUnderTestNoAttr = new ModelInfoDisplay(optionsStubAllAttrUndefined);
            classUnderTestBooleanDefault = new ModelInfoDisplay(optionsStubBooleanDefaultValue);
            classUnderTestList = new ModelInfoDisplay(optionsStubList);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('add model info when present', function() {
            it('Should add model info if present', function() {
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Write Behavior']).to.equal('PERSIST_AND_DELEGATE');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Read Behavior']).to.equal('FROM_PERSISTENCE');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['User Exposure']).to.equal('ALWAYS');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Default Value']).to.equal('default');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Namespace']).to.equal('ERBS_NODE_MODEL');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Version']).to.equal('8.1.160');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Data Type']).to.equal('STRING');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Disturbances']).to.equal('value');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Regex']).to.equal('0-9');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Resolution']).to.equal(25);
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Nullable']).to.equal('FALSE');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Restricted']).to.equal('FALSE');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Unique Members']).to.equal('TRUE');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['String Range']).to.equal('2, 3, 5..6, 20, 0..128, 256..320, 5, 10');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Precondition']).to.equal('The support unit HW is disconnected from the corresponding PIUs (otherwise the SupportUnit MO will be recreated).');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Dependencies']).to.equal('This attribute is effective only when ANR for LTE feature is activated.');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Side Effects']).to.equal('Side Effects of an attribute.');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Unit']).to.equal('MICROSECOND');
                expect(classUnderTestAllAttr.attributeModelInfo.modelInfoItems['Multiplication Factor']).to.equal('15');
            });
        });

        describe('DON\'T add model info when not present', function() {
            it('Should not add model info if not present', function() {
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Write Behavior']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Read Behavior']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['User Exposure']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Default Value']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Namespace']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Version']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Data Type']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Disturbances']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Regex']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Resolution']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Nullable']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Restricted']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Unique Members']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['String Range']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Value Range']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Precondition']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Dependencies']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Side Effects']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Unit']).to.equal(undefined);
                expect(classUnderTestNoAttr.attributeModelInfo.modelInfoItems['Multiplication Factor']).to.equal(undefined);
            });
        });

        describe('Handle Case where default value is boolean', function() {
            it('Should convert boolean value to uppercase string', function() {
                expect(classUnderTestBooleanDefault.attributeModelInfo.modelInfoItems['Default Value']).to.equal('FALSE');
                expect(classUnderTestBooleanDefault.attributeModelInfo.modelInfoItems['Value Range']).to.equal(undefined);
            });
        });

        describe('Add model info for list', function() {
            it('Should set nullable to false, add value range and unique members', function() {
                expect(classUnderTestList.attributeModelInfo.modelInfoItems['Nullable']).to.equal('FALSE');
                expect(classUnderTestList.attributeModelInfo.modelInfoItems['Value Range']).to.equal('-1..2222222');
                expect(classUnderTestList.attributeModelInfo.modelInfoItems['Unique Members']).to.equal('TRUE');
            });
        });
    });
});
