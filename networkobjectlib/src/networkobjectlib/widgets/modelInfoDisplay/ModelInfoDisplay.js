define([
    'jscore/core',
    './ModelInfoDisplayView',
    'i18n!networkobjectlib/dictionary.json',
    '../../ext/constants'
], function(core, View, dictionary, Constants) {
    'use strict';
    return core.Widget.extend({

        view: function() {
            return new View(this.attributeModelInfo);
        },

        init: function(options) {
            var attribute = options.attribute, moType = options.moType;
            var modelInfoItems = {};
            this.attributeModelInfo = {};
            this.attributeModelInfo.description = dictionary.get('modelInfoDialog.description');
            this.attributeModelInfo.descriptionBody = attribute.description;

            if (attribute.complexConstructor !== undefined && attribute.listConstructor !== undefined && attribute.type !== Constants.COMPLEX_REF || attribute.constraints === undefined) {
                this.attributeModelInfo.attributeName = attribute.key;
                this.attributeModelInfo.header = dictionary.get('modelInfoDialog.StructMemberHeader');

            } else {
                this.attributeModelInfo.attributeName = moType + '.' + attribute.key;
                this.attributeModelInfo.header = dictionary.get('modelInfoDialog.MoParameterHeader');
            }
            if (attribute.namespace) {
                modelInfoItems[dictionary.get('modelInfoDialog.nameSpace')] = attribute.namespace;
            }
            if (attribute.namespaceVersion) {
                modelInfoItems[dictionary.get('modelInfoDialog.version')] = attribute.namespaceVersion;
            }
            if (attribute.type) {
                modelInfoItems[dictionary.get('modelInfoDialog.dataType')] = this.getDataType(attribute);
            }
            if (attribute.defaultValue!== undefined && attribute.defaultValue !== null) {
                if (attribute.type && attribute.type === 'BOOLEAN') {
                    modelInfoItems[dictionary.get('modelInfoDialog.defaultValue')] = attribute.defaultValue.toString().toUpperCase();
                } else {
                    modelInfoItems[dictionary.get('modelInfoDialog.defaultValue')] = attribute.defaultValue;
                }
            }
            if (attribute.trafficDisturbances) {
                modelInfoItems[dictionary.get('modelInfoDialog.disturbances')] = attribute.trafficDisturbances;
            }
            if (attribute.type === Constants.LIST && this.listMembersHaveRange(attribute)) {
                modelInfoItems[dictionary.get('modelInfoDialog.valueRange')] = this.getValueRangeFromlistReference(attribute);
                this.addNullableFromConstraints(attribute, modelInfoItems);
            } else if (this.hasRange(attribute) && attribute.type !== Constants.LIST) {
                if (attribute.type === Constants.STRING) {
                    modelInfoItems[dictionary.get('modelInfoDialog.stringRange')] = this.getValueRange(attribute);
                } else {
                    modelInfoItems[dictionary.get('modelInfoDialog.valueRange')] = this.getValueRange(attribute);
                }
                this.addNullable(attribute, modelInfoItems);
            }
            if (attribute.constraints && attribute.constraints.valueResolution) {
                modelInfoItems[dictionary.get('modelInfoDialog.valueResolution')] = attribute.constraints.valueResolution;
            }
            if (attribute.constraints && attribute.constraints.uniqueMembers !== undefined) {
                modelInfoItems[dictionary.get('modelInfoDialog.uniqueMembers')] = attribute.constraints.uniqueMembers.toString().toUpperCase();
            }
            if (attribute.unit) {
                modelInfoItems[dictionary.get('modelInfoDialog.unit')] = attribute.unit.toUpperCase();
            }
            if (attribute.multiplicationFactor) {
                modelInfoItems[dictionary.get('modelInfoDialog.multiplicationFactor')] = attribute.multiplicationFactor;
            }
            if (attribute.dependencies) {
                modelInfoItems[dictionary.get('modelInfoDialog.dependencies')] = attribute.dependencies;
            }
            if (attribute.precondition) {
                modelInfoItems[dictionary.get('modelInfoDialog.precondition')] = attribute.precondition;
            }
            if (attribute.sideEffects) {
                modelInfoItems[dictionary.get('modelInfoDialog.sideEffects')] = attribute.sideEffects;
            }
            if (attribute.readBehavior) {
                modelInfoItems[dictionary.get('modelInfoDialog.readBehavior')] = attribute.readBehavior;
            }
            if (attribute.writeBehavior) {
                modelInfoItems[dictionary.get('modelInfoDialog.writeBehavior')] = attribute.writeBehavior;
            }
            if (attribute.userExposure) {
                modelInfoItems[dictionary.get('modelInfoDialog.userExposure')] = attribute.userExposure;
            }
            if (attribute.immutable !== undefined) {
                modelInfoItems[dictionary.get('modelInfoDialog.restricted')] = attribute.immutable.toString().toUpperCase();
            }
            if (attribute.constraints && attribute.constraints.validContentRegex && attribute.constraints.validContentRegex !== null) {
                modelInfoItems[dictionary.get('modelInfoDialog.regex')] = attribute.constraints.validContentRegex;
            }
            if (attribute.lifeCycle) {
                if (attribute.lifeCycle.state) {
                    modelInfoItems[dictionary.get('modelInfoDialog.lifecycleState')] = attribute.lifeCycle.state;
                }
                if (attribute.lifeCycle.description && attribute.lifeCycle.description !== null && attribute.lifeCycle.state !== 'CURRENT') {
                    modelInfoItems[dictionary.get('modelInfoDialog.lifeCycleDescription')] = attribute.lifeCycle.description;
                }
            }
            this.attributeModelInfo.modelInfoItems = modelInfoItems;
        },

        getDataType: function(attribute) {
            var dataType = '';
            if (attribute.type === Constants.LIST) {
                dataType = this.getDataTypeForList(attribute);
            } else if (attribute.type === Constants.COMPLEX_REF) {
                dataType = attribute.complexRef.key;
            } else {
                dataType = attribute.type;
            }
            return dataType;
        },

        getDataTypeForList: function(attribute) {
            var listReferenceType, dataType, valueRange;
            if (attribute.listReference && attribute.listReference.type) {
                if (attribute.listReference.type === Constants.COMPLEX_REF) {  // List of structs
                    listReferenceType = attribute.listReference.complexRef.key;
                } else {
                    listReferenceType = attribute.listReference.type;
                }
                valueRange = this.getValueRange(attribute);
                if (valueRange) {
                    dataType = listReferenceType + ' [' + valueRange + ']';
                } else {
                    dataType = listReferenceType + ' []';
                }
            } else {
                dataType = attribute.type;
            }
            return dataType;
        },

        hasRange: function(attribute) {
            if (attribute.constraints && attribute.constraints.valueRangeConstraints) {
                return true;
            }
            return false;
        },

        listMembersHaveRange: function(attribute) {
            if (attribute.listReference.constraints && attribute.listReference.constraints.valueRangeConstraints) {
                return true;
            }
            return false;
        },

        getValueRange: function(attribute) {
            if (attribute.constraints) {
                if (attribute.constraints.valueRangeConstraints && Array.isArray(attribute.constraints.valueRangeConstraints)) {
                    var result = '';
                    for (var i = 0; i < attribute.constraints.valueRangeConstraints.length; i++) {
                        var range = attribute.constraints.valueRangeConstraints[i];
                        if (range.maxValue === null) {
                            range.maxValue = '';
                        }
                        if (range.minValue === range.maxValue) {
                            result += range.minValue;
                        } else {
                            result += range.minValue + '..' + range.maxValue;
                        }
                        if (i < attribute.constraints.valueRangeConstraints.length - 1) {
                            result += ', ';
                        }
                    }
                    return result;
                }
            }
        },

        getValueRangeFromlistReference: function(attribute) {
            if (attribute.listReference) {
                if (attribute.listReference.constraints) {
                    if (attribute.listReference.constraints.valueRangeConstraints && Array.isArray(attribute.listReference.constraints.valueRangeConstraints)) {
                        var result = '';
                        for (var i = 0; i < attribute.listReference.constraints.valueRangeConstraints.length; i++) {
                            var range = attribute.listReference.constraints.valueRangeConstraints[i];
                            if (range.maxValue === null) {
                                range.maxValue = '';
                            }
                            if (range.minValue === range.maxValue) {
                                result += range.minValue;
                            } else {
                                result += range.minValue + '..' + range.maxValue;
                            }
                            if (i < attribute.listReference.constraints.valueRangeConstraints.length - 1) {
                                result += ', ';
                            }
                        }
                        return result;
                    }
                }
            }
        },

        addNullable: function(attribute, modelInfoItems) {
            if (attribute.constraints) {
                if (attribute.constraints.nullable !== undefined) {
                    modelInfoItems[dictionary.get('modelInfoDialog.nullable')] =  attribute.constraints.nullable.toString().toUpperCase();
                }
            }
        },

        addNullableFromConstraints: function(attribute, modelInfoItems) {
            if (attribute.constraints) {
                if (attribute.constraints.nullable !== undefined) {
                    modelInfoItems[dictionary.get('modelInfoDialog.nullable')] = attribute.constraints.nullable.toString().toUpperCase();
                }
            }
        }
    });
});
