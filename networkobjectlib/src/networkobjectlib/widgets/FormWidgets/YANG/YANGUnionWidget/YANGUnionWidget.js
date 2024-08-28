define([
    '../../EnumComboBoxWidget/EnumComboBoxWidget',
    '../../OnOffSwitch/OnOffSwitch',
    '../../StringInputFormWidget/StringInputFormWidget',
    '../../NumberInputFormWidget/NumberInputFormWidget',
    '../../EnumDropdownWidget/EnumDropdownWidget',
    '../../BitsComboMultiSelectWidget/BitsComboMultiSelectWidget',
    '../../../../utils/TooltipBuilder'
], function(EnumComboBox, OnOffSwitch, StringInput, NumberInput, EnumDropdown, BitsComboMultiSelect, TooltipBuilder) {

    return function(options) {
        return createWidget(options);
    };

    function mergeConstraints(widgetType, constraintList) {
        var constraints = {
            nullable: true,
        };
        if (typeof constraintList !== 'undefined' && typeof constraintList.slice === 'function' && 0 < constraintList.length) {
            //TODO: MERGE BY TYPE THE LIST
            if (widgetType==='Text') {
                constraintList.forEach(function(constraint) {
                    if (false === constraint.nullable)
                        { constraints.nullable = false; }
                    if (constraint.validContentRegex) {
                        if (constraints.validContentRegex) {
                            constraints.validContentRegex.push(constraint.validContentRegex);
                        }
                        else {
                            constraints.validContentRegex = [];
                            constraints.validContentRegex.push(constraint.validContentRegex);
                        }
                    }
                    if (constraint.valueRangeConstraints) {
                        if (constraints.valueRangeConstraints) {
                            constraints.valueRangeConstraints = constraints.valueRangeConstraints.concat(constraint.valueRangeConstraints);
                        }
                        else {
                            constraints.valueRangeConstraints = constraint.valueRangeConstraints;
                        }
                    }
                });
                if (constraints.validContentRegex && constraints.validContentRegex.length===1) {
                    constraints.validContentRegex = constraints.validContentRegex[0];
                }
            }
            else if (widgetType==='Number') {
                constraintList.forEach(function(constraint) {
                    if (false === constraint.nullable)
                        { constraints.nullable = false; }
                    if (constraint.valueRangeConstraints) {
                        if (constraints.valueRangeConstraints) {
                            constraints.valueRangeConstraints = constraints.valueRangeConstraints.concat(constraint.valueRangeConstraints);
                        }
                        else {
                            constraints.valueRangeConstraints = constraint.valueRangeConstraints;
                        }
                    }
                });
            }
            else if (widgetType === 'TextNumber' || widgetType === 'Combo') {
                constraintList.forEach(function(constraint) {
                    if (false === constraint.nullable)
                        { constraints.nullable = false; }
                    if (constraint.validContentRegex) {
                        if (constraints.validContentRegex) {
                            constraints.validContentRegex.push(constraint.validContentRegex);
                        }
                        else {
                            constraints.validContentRegex = [];
                            constraints.validContentRegex.push(constraint.validContentRegex);
                        }
                    }
                    if (constraint.valueRangeConstraints) {
                        if (constraint.numericConstraint) {
                            constraint.valueRangeConstraints.forEach(function(numericContraint) {
                                numericContraint.isNumeric = true;
                                numericContraint.isFraction = !!constraint.isDouble && !!constraint.isFloat;
                            });
                            if (constraints.numberValueRangeConstraints) {
                                constraints.numberValueRangeConstraints = constraints.numberValueRangeConstraints.concat(constraint.valueRangeConstraints);
                            }
                            else {
                                constraints.numberValueRangeConstraints = constraint.valueRangeConstraints;
                            }
                        }
                        else {
                            if (constraints.valueRangeConstraints) {
                                constraints.valueRangeConstraints = constraints.valueRangeConstraints.concat(constraint.valueRangeConstraints);
                            }
                            else {
                                constraints.valueRangeConstraints = constraint.valueRangeConstraints;
                            }
                        }
                    }
                });
                if (constraints.validContentRegex && constraints.validContentRegex.length===1) {
                    constraints.validContentRegex = constraints.validContentRegex[0];
                }
            }
            else if (widgetType==='Boolean') {
                if (constraintList && false === constraintList.nullable)
                    { constraints.nullable = false; }
            }
            else if (widgetType==='Enum') {
                constraintList.forEach(function(constraint) {
                    if (false === constraint.nullable)
                        { constraints.nullable = false; }
                });
            }
            else if (widgetType === 'Bits') {
                constraints.bitsConstraint = {};
                constraintList.forEach(function(constraint) {
                    if (false === constraint.nullable) {
                        constraints.nullable = false;
                    }

                    if (constraint.validContentRegex && constraint.validContentRegex === '\\*') {
                        constraints.bitsConstraint = {};
                    }

                    if (constraint.bitsConstraint) {
                        constraints.bitsConstraint = constraint.bitsConstraint;
                    }
                });
            }
        }
        return constraints;
    }

    function createWidget(options) {
        var widget = null;
        var numbersEnabled = false;
        var numbersConstraints = null;
        var simpleTextEnabled = false;
        var simpleTextConstraints = null;
        var booleanEnabled = false;
        var booleanConstraints = null;
        var enumListValues = [];
        var enumListValuesConstraints = null;
        var bitsListValues = [];
        var bitsListValuesConstraints = null;
        var typeList = '';
        var memberTypes = (options.memberTypes) ? options.memberTypes : options.listMembers;

        if (memberTypes) {
            memberTypes.forEach(function(element) {
                var memberType = element.type.trim().toUpperCase().replace(' ', '_');
                if (memberType==='INTEGER' || memberType==='LONG' || memberType==='DOUBLE' || memberType==='FLOAT' || memberType==='SHORT') {
                    if (typeList.indexOf(memberType) < 0)
                        { typeList += (typeList.length ? ',' : '') + memberType; }
                    numbersEnabled = true;
                    if (!numbersConstraints) {
                        numbersConstraints = [];
                    }
                    if (element.constraints) {
                        element.constraints.numericConstraint = true;
                        element.constraints.isInteger = memberType==='INTEGER';
                        element.constraints.isLong = memberType==='LONG';
                        element.constraints.isDouble = memberType==='DOUBLE';
                        element.constraints.isFloat = memberType==='FLOAT';
                        element.constraints.isShort = memberType==='SHORT';
                        numbersConstraints.push(element.constraints);
                    }
                }
                else if (memberType==='BOOLEAN') {
                    if (typeList.indexOf(memberType) < 0)
                        { typeList += (typeList.length ? ',' : '') + memberType; }
                    booleanEnabled = true;
                    if (element.constraints) {
                        element.constraints.booleanConstraint = true;
                        booleanConstraints = element.constraints;
                    }
                }
                else if (memberType==='STRING' || memberType === 'IP_ADDRESS') {
                    if (typeList.indexOf(memberType) < 0)
                        { typeList += (typeList.length ? ',' : '') + memberType; }
                    simpleTextEnabled = true;
                    if (!simpleTextConstraints) {
                        simpleTextConstraints = [];
                    }
                    if (element.constraints) {
                        element.constraints.stringConstraint = true;
                        simpleTextConstraints.push(element.constraints);
                    }
                }
                else if (memberType==='ENUM_REF') {
                    if (typeList.indexOf(memberType) < 0)
                        { typeList += (typeList.length ? ',' : '') + 'ENUMERATION'; }
                    if (element.enumeration && element.enumeration.enumMembers && element.enumeration.enumMembers.length) {
                        var listOfEnum = [];
                        element.enumeration.enumMembers.forEach(function(enumElem) {
                            var enumClone = JSON.parse(JSON.stringify(enumElem));
                            if (enumClone.key)
                                { enumClone.value = enumClone.key; }
                            listOfEnum.push(enumClone);
                        });
                        if (!enumListValuesConstraints) {
                            enumListValuesConstraints = [];
                        }
                        if (listOfEnum.length)
                            { enumListValues.push(listOfEnum); }
                        if (element.constraints) {
                            element.constraints.enumConstraint = true;
                            enumListValuesConstraints.push(element.constraints);
                        }
                    }
                }
                else if (memberType==='BITS') {
                    if (typeList.indexOf(memberType) < 0) {
                        typeList += (typeList.length ? ',' : '') + 'BITS';
                    }
                    if (Array.isArray(element.bitsMembers) && element.bitsMembers.length > 0) {
                        var mapOfBits = {};
                        if (!element.constraints) {
                            element.constraints = {};
                            element.constraints.bitsConstraint = {};
                        } else if (typeof element.constraints === 'string') {
                            var tempConstraints = element.constraints.match(/[^ ]+/g);
                            element.constraints = {};
                            tempConstraints.forEach(function(bitsElem) {
                                mapOfBits[bitsElem] = true;
                            });
                            element.constraints.bitsConstraint = mapOfBits;
                        }
                        if (!bitsListValuesConstraints) { bitsListValuesConstraints = []; }

                        bitsListValues = element.bitsMembers;
                        bitsListValuesConstraints.push(element.constraints);
                    }
                }
            });
        }
        var widgetModifier = {
            acceptNumbers: numbersConstraints,
            acceptStrings: simpleTextConstraints,
            acceptBoolean: booleanConstraints,
            acceptEnum: enumListValues,
            acceptBits: bitsListValues
        };
        var constraints = [];
        if (simpleTextEnabled && !numbersEnabled && !booleanEnabled && enumListValues.length===0 && bitsListValues.length===0) {
            //INFO: Simple StringInput
            widgetModifier.widgetType = 'Text';
            var textOptions = {
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
                keySectionDisabled: true,
                constraints: mergeConstraints(widgetModifier.widgetType, simpleTextConstraints),
                inputTitle: TooltipBuilder.buildUnion(options),
                type: 'UNION',
                defaultValue: options.defaultValue,
                value: options.value,
                modifier: widgetModifier,
                description: options.description
            };
            widget = new StringInput(textOptions);
        }
        else if (!simpleTextEnabled && numbersEnabled && !booleanEnabled && enumListValues.length===0) {
            //INFO: Simple NumberInput
            widgetModifier.widgetType = 'Number';
            var numberOptions = {
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
                keySectionDisabled: true,
                constraints: mergeConstraints(widgetModifier.widgetType, numbersConstraints),
                type: 'UNION',
                defaultValue: options.defaultValue,
                inputTitle: TooltipBuilder.buildUnion(options),
                value: options.value,
                modifier: widgetModifier,
                description: options.description
            };
            widget = new NumberInput(numberOptions);
        }
        else if (simpleTextEnabled && numbersEnabled && !booleanEnabled && enumListValues.length===0) {
            //INFO: Simple StringInput + Numbers
            widgetModifier.widgetType = 'TextNumber';
            //TODO: To Be Analyzed
            if (numbersConstraints)
                { constraints = constraints.concat(numbersConstraints); }
            if (simpleTextConstraints)
                { constraints = constraints.concat(simpleTextConstraints); }
            var textNumberOptions = {
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
                keySectionDisabled: true,
                constraints: mergeConstraints(widgetModifier.widgetType, constraints),
                type: 'UNION',
                inputTitle: TooltipBuilder.buildUnion(options),
                defaultValue: options.defaultValue,
                value: options.value,
                modifier: widgetModifier,
                description: options.description
            };
            widget = new StringInput(textNumberOptions);
        }
        else if ((booleanEnabled || enumListValues.length>0) && (simpleTextEnabled || numbersEnabled)) {
            //INFO: ComboBox Case
            if (numbersConstraints)
                { constraints = constraints.concat(numbersConstraints); }
            if (simpleTextConstraints)
                { constraints = constraints.concat(simpleTextConstraints); }
            if (enumListValuesConstraints)
                { constraints = constraints.concat(enumListValuesConstraints); }
            if (booleanConstraints)
                { constraints = constraints.push(booleanConstraints); }
            widgetModifier.widgetType = 'Combo';
            var comboOptions = {
                enumeration: {enumMembers: []},
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
                keySectionDisabled: true,
                constraints: mergeConstraints(widgetModifier.widgetType, constraints),
                type: 'UNION',
                inputTitle: TooltipBuilder.buildUnion(options),
                defaultValue: options.defaultValue,
                value: options.value,
                modifier: widgetModifier,
                description: options.description
            };
            if (booleanEnabled) {
                comboOptions.enumeration.enumMembers.push({key: 'TRUE', value: true, description: 'TRUE'});
                comboOptions.enumeration.enumMembers.push({key: 'FALSE', value: false, description: 'FALSE'});
            }
            if (enumListValues.length && booleanEnabled) {
                comboOptions.enumeration.enumMembers.push({separator: true});
            }
            enumListValues.forEach(function(enumItemList, index) {
                enumItemList.forEach(function(enumItem) {
                    comboOptions.enumeration.enumMembers.push({key: enumItem.key, value: enumItem.value, description: enumItem.description});
                });
                if (index<enumListValues.length-1)
                    { comboOptions.enumeration.enumMembers.push({separator: true}); }
            });

            widget = new EnumComboBox(comboOptions);
        }
        else if (booleanEnabled && !enumListValues.length && !simpleTextEnabled && !numbersEnabled) {
            widgetModifier.widgetType = 'Boolean';
            var booleanOptions = {
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
                keySectionDisabled: true,
                constraints: booleanConstraints,
                inputTitle: TooltipBuilder.buildUnion(options),
                type: 'UNION',
                defaultValue: options.defaultValue,
                value: options.value,
                modifier: widgetModifier,
                description: options.description
            };
            widget = new OnOffSwitch(booleanOptions);
        }
        else if ((booleanEnabled || enumListValues.length>0) && !simpleTextEnabled && !numbersEnabled) {
            //INFO: EnumDropdown Case
            widgetModifier.widgetType = 'Enum';
            if (enumListValuesConstraints)
                { constraints = constraints.concat(enumListValuesConstraints); }
            if (booleanConstraints)
                { constraints.push(booleanConstraints); }
            var enumOptions = {
                enumeration: {enumMembers: []},
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
                keySectionDisabled: true,
                constraints: mergeConstraints(widgetModifier.widgetType, constraints),
                type: 'UNION',
                inputTitle: TooltipBuilder.buildUnion(options),
                defaultValue: options.defaultValue,
                value: options.value,
                modifier: widgetModifier,
                description: options.description
            };
            if (booleanEnabled) {
                enumOptions.enumeration.enumMembers.push({key: 'TRUE', value: true, description: 'TRUE'});
                enumOptions.enumeration.enumMembers.push({key: 'FALSE', value: false, description: 'FALSE'});
            }
            if (enumListValues.length && booleanEnabled) {
                enumOptions.enumeration.enumMembers.push({separator: true});
            }
            enumListValues.forEach(function(enumItemList, index) {
                enumItemList.forEach(function(enumItem) {
                    enumOptions.enumeration.enumMembers.push(enumItem);
                });
                if (index<enumListValues.length-1)
                    { enumOptions.enumeration.enumMembers.push({separator: true}); }
            });
            widget = new EnumDropdown(enumOptions);
        }
        if (simpleTextEnabled && bitsListValues.length>0) {
            //INFO: BIts
            widgetModifier.widgetType = 'Bits';
            if (bitsListValuesConstraints) {
                constraints = constraints.concat(bitsListValuesConstraints);
            }
            if (simpleTextConstraints) {
                constraints = constraints.concat(simpleTextConstraints);
            }

            var bitsComboMultiSelectOptions = {
                bitsMembers: widgetModifier.acceptBits,
                onChangeCallback: options.onChangeCallback.bind(this),
                onInvalidCallback: options.onInvalidCallback.bind(this),
                innerOnChangeCallback: options.innerOnChangeCallback.bind(this),
                innerOnInvalidCallback: options.innerOnInvalidCallback.bind(this),
                key: options.key,
                keySectionDisabled: true,
                constraints: mergeConstraints(widgetModifier.widgetType, constraints),
                inputTitle: TooltipBuilder.buildUnion(options),
                type: 'UNION',
                defaultValue: options.defaultValue,
                value: options.value,
                modifier: widgetModifier,
                description: options.description,
                moType: options.moType,
                namespace: options.namespace,
                namespaceVersion: options.namespaceVersion,
                readBehavior: options.readBehavior,
                writeBehavior: options.writeBehavior,
                userExposure: options.userExposure,
                immutable: options.immutable,
                lifeCycle: options.lifeCycle,
            };
            widget = new BitsComboMultiSelect(bitsComboMultiSelectOptions);
        }
        return widget;
    }

});



