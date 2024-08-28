define([
    'i18n!networkobjectlib/dictionary.json',
    '../ext/constants'
], function(i18n, constants) {
    'use strict';

    return {
        validate: function(inputValue, constraintsToValidate, arrayOfListValues, type) {

            //if nullable
            if (constraintsToValidate.isNullable || constraintsToValidate.isNullable === null) {
                if (this.isNull(inputValue, constraintsToValidate)) {
                    return true;
                }
            } else if (inputValue === '<null>') {
                throw new Error(i18n.inlineValidation.cannotBeNull);
            }

            // if there is regex constraint
            if (constraintsToValidate.checkRegex) {
                //if regex constraint does not pass, set error
                if (!this.isValidRegex(inputValue, constraintsToValidate.validContentRegex)) {
                    throw new Error(i18n.inlineValidation.doesNotMatchRegex);
                }
            }

            // if there is string length range constraint
            if (constraintsToValidate.checkRange) {
                if (inputValue.length === 0) {
                    var canBeEmpty = this.validateEmptyString(constraintsToValidate.isNullable, constraintsToValidate.valueRangeConstraints);
                    if (!canBeEmpty) {
                        var errorText = i18n.inlineValidation.cannotBeEmpty;
                        throw new Error(errorText);
                    }
                    //if string length range constraint does not pass, set error
                } else if (!this.isValidRange(inputValue.length, constraintsToValidate.valueRangeConstraints)) {
                    throw new Error(i18n.inlineValidation.stringInvalidRange);
                }
            }

            // if input is type INTEGER
            if (constraintsToValidate.checkInteger) {
                // Throw error if entered value is empty.
                if (inputValue === '') {
                    var error = i18n.inlineValidation.cannotBeEmpty;
                    throw new Error(error);
                }
                this.isNumber(inputValue);
                this.isValidDecimalNumber(type, inputValue);
            }

            // if there is number range constraint
            if (constraintsToValidate.checkNumberRange) {
                //if number range constraint does not pass, set error
                if (!this.isValidRange(inputValue, constraintsToValidate.valueRangeConstraints,type)) {
                    var errorMessage = i18n.inlineValidation.numberOutOfRange;
                    throw new Error(errorMessage);
                }
            }
            // if there is resolution constraint
            if (constraintsToValidate.checkResolution) {
                //if the resolution constraint does not pass, set error
                if (!this.isValidResolution(inputValue, constraintsToValidate.checkResolution, constraintsToValidate.valueRangeConstraints)) {
                    throw new Error(i18n.inlineValidation.invalidResolution);
                }
            }

            //if there is a unique member constraint return a list of non unique values if present.
            if (constraintsToValidate.checkUniqueMembers) {
                return this.listOfNonUniqueValues(arrayOfListValues);
            }
        },

        validateEmptyString: function(isNullable, validValueRange) {
            if (isNullable) {
                // can be nullable so allow empty string.
                return true;
            } else {
                // return true - cannot be null but minimum characters limit is zero.
                // return false - cannot be null and minimum characters limit is greater than zero.
                return this.checkZeroMinValueInRange(validValueRange);
            }
        },

        //Check if minValue is 0 in multiple ranges
        checkZeroMinValueInRange: function(validValueRange) {
            var isValid = false;
            for (var index = 0; index < validValueRange.length; index++) {
                if (validValueRange[index].minValue === 0) {
                    isValid = true;
                    break;
                }
            }
            return isValid;
        },

        listOfNonUniqueValues: function(arrayOfListValues) {
            return arrayOfListValues.filter(function(value, index, self) {
                return (self.indexOf(value) !== index);
            });
        },

        isNull: function(value, constraintsToValidate) {
            if (constraintsToValidate.checkInteger) {
                return doesNotExist(value);
            } else {
                return doesNotExist(value) || value === '<null>';
            }
        },

        isValidResolution: function(value, resolution, rangeConstraints) {
            var numericalValue = parseInt(value);

            if (Array.isArray(rangeConstraints) && rangeConstraints.length !== 0) {
                return rangeConstraints.reduce(function(acc, current) {
                    var accumulator;
                    if (!doesNotExist(current.minValue)) {
                        accumulator = acc || (numericalValue - current.minValue) % resolution === 0;
                    } else {
                        accumulator = acc || value % resolution === 0;
                    }

                    return accumulator;
                }, false);
            }

            else {
                return value % resolution === 0;
            }
        },

        isValidEnum: function(value, items) {
            if (doesNotExist(value) || value === '<null>') {
                return false;
            }

            return !!items.filter(function(item) {
                return item.value === value;
            })[0];
        },

        isNumber: function(inputValue) {
            if (isNaN(inputValue)) {
                throw new Error(i18n.inlineValidation.notANumber);
            }
            if (inputValue === null) {
                throw new Error(i18n.inlineValidation.notANumber);
            }
            return true;
        },

        isValidDecimalNumber: function(type, inputValue) {
            if (type) {
                var isDecimalValue = (type === constants.DOUBLE || type === constants.FLOAT);
                //Decimals are not allowed if data type is not double or float.
                if (type === 'LONG' && (inputValue.indexOf('.') !== -1 || inputValue.indexOf('--') !== -1)) {
                    // return false if decimals are entered for
                    throw new Error(i18n.inlineValidation.notAnInteger);
                } else if (!isDecimalValue && (parseInt(inputValue) !== Number(inputValue))) {
                    // return false if decimals are entered for
                    throw new Error(i18n.inlineValidation.notAnInteger);
                }
            }
        },

        isValidRange: function(value, range, type) {
            if (isNaN(value)) {
                return false;
            }
            var numericValue = value;

            return !!range.reduce(function(prev, curr) {
                var accumulator;
                if (curr.isFraction) {
                    numericValue = parseFloat(value);
                }
                else {
                    if (type && type === 'LONG') {
                        numericValue = value.toString().trim();
                    } else {
                        numericValue = parseInt(value);
                    }
                }

                if (!doesNotExist(curr.minValue) && !doesNotExist(curr.maxValue)) {
                    if (type && type === 'LONG') {
                        accumulator = prev || (validateRangeForLongType(numericValue, curr.minValue.toString(), curr.maxValue.toString()));  
                    } else {
                        accumulator = prev || (numericValue >= curr.minValue && numericValue <= curr.maxValue);
                    }
                }
                else {
                    if (!doesNotExist(curr.maxValue)) {
                        accumulator = prev || type === 'LONG' ? (validateRangeForLongType(numericValue,undefined,curr.maxValue.toString())) : (numericValue <= curr.maxValue);
                    }
                    if (!doesNotExist(curr.minValue)) {
                        accumulator = prev || type === 'LONG' ? (validateRangeForLongType(numericValue,curr.minValue.toString(),undefined)) : (numericValue >= curr.minValue);
                    }
                }
                return accumulator;
            }, false);
        },

        isValidRegex: function(value, regex) {
            // cast to array if its not
            regex = [].concat(regex);

            return regex.reduce(function(prev, curr) {
                return prev || new RegExp(curr).test(value);
            }, false);
        },

        getValidationConstraints: function(type, constraints) {
            var constraintsToValidate = {};
            switch (type) {
            case constants.INTEGER:
            case constants.LONG:
            case constants.SHORT:
            case constants.DOUBLE:
            case constants.FLOAT:
            case constants.BYTE:
                constraintsToValidate = this.getNumberConstraints(constraints);
                break;
            case constants.STRING:
            case constants.MO_REF: //MO_REF is considered as STRING type for all UI operations.
                constraintsToValidate = this.getStringConstraints(constraints);
                break;
            }
            return constraintsToValidate;
        },

        getNumberConstraints: function(constraints) {
            return {
                isNullable: (constraints && constraints.nullable === true),
                checkInteger: true,
                checkResolution: (constraints && constraints.valueResolution),
                checkNumberRange: (constraints && constraints.valueRangeConstraints !== undefined && constraints.valueRangeConstraints !== null),
                checkRegex: (constraints && constraints.validContentRegex !== undefined && constraints.validContentRegex !== null),
                valueRangeConstraints: constraints ? constraints.valueRangeConstraints : [],
                validContentRegex: constraints ? constraints.validContentRegex : []
            };
        },

        getStringConstraints: function(constraints) {
            return {
                isNullable: (constraints && constraints.nullable === true),
                checkRange: (constraints && constraints.valueRangeConstraints !== undefined && constraints.valueRangeConstraints !== null),
                checkRegex: (constraints && constraints.validContentRegex !== undefined && constraints.validContentRegex !== null),
                valueRangeConstraints: constraints ? constraints.valueRangeConstraints : [],
                validContentRegex: constraints ? constraints.validContentRegex : []
            };
        },

        validateSequence: function(sequence, constraints) {
            var valueRangeConstraints = constraints.valueRangeConstraints;
            // Need to check valueRangeConstraint as it could be null
            var minSize = 0, maxSize = 0;
            if (valueRangeConstraints) {
                minSize = valueRangeConstraints[0].minValue;
                maxSize = valueRangeConstraints[0].maxValue;
            }
            var errorMessage = '';
            var isGreaterOrEqual = sequence.length >= minSize;
            var isLessOrEqual = sequence.length <= maxSize;
            if (!isGreaterOrEqual) {
                errorMessage = i18n.inlineValidation.tooFewEntries;
                throw new Error(errorMessage);
            } else if (!isLessOrEqual) {
                errorMessage = i18n.inlineValidation.tooManyEntries;
                throw new Error(errorMessage);
            }
            if (constraints.uniqueMembers) {
                var nonUniqueValues = this.listOfNonUniqueValues(sequence);
                if (nonUniqueValues && nonUniqueValues.length > 0) {
                    errorMessage = i18n.inlineValidation.nonUniqueValues;
                    throw new Error(errorMessage);
                }
            }
        },

        validateEnums: function(enumMembers, modifiedValue) {
            var isValid = true;
            for (var itemIndex = 0; itemIndex < enumMembers.length; itemIndex++) {
                var name = enumMembers[itemIndex].key;
                if (name === modifiedValue) {
                    break;
                }
            }
            if (itemIndex === enumMembers.length) {
                isValid = false;
            }
            return isValid;
        }
    };

    function doesNotExist(value) {
        return value === undefined || value === null || value === '';
    }

    function isNegativeValue(value) {
        return (value.indexOf('-') !== -1);
    }

    function validateRangeForLongType(inputValue, minValue, maxValue) {
        var result = false, maxResult = false, minResult = false ;
        var minLength, maxLength, inputStrValue, inputLength, maxStrValue, minStrValue;
        var isNegativeInput = isNegativeValue(inputValue);
        inputValue = isNegativeInput ? inputValue.replace(/^-/, '') : inputValue;
        if (inputValue.match(/^0+[1-9]/)) {
            inputValue = inputValue.replace(/^0+/, '');
        } else if (inputValue.match(/^0+$/)) {
            inputValue = '0';
        }
        inputValue = isNegativeInput ? '-'+inputValue : inputValue;
        if (maxValue) {
            if (isNegativeValue(inputValue) && !isNegativeValue(maxValue)) {
                result = maxResult = true;
            } else if (isNegativeValue(inputValue) && isNegativeValue(maxValue)) {
                inputStrValue = inputValue;
                inputStrValue = inputStrValue.replace(/^-/, '');
                inputLength = inputStrValue.length;
                maxStrValue = maxValue;
                maxStrValue = maxStrValue.replace(/^-/, '');
                maxLength = maxStrValue.length;
                result = maxResult = (inputLength === maxLength) ? (inputStrValue >= maxStrValue) : (inputLength > maxLength);
            } else if (!isNegativeValue(inputValue) && !isNegativeValue(maxValue)) {
                maxLength = maxValue.length;
                inputLength = inputValue.length;
                result = maxResult = (inputLength === maxLength) ? (inputValue <= maxValue) : (inputLength < maxLength);
            }
        }
        if (minValue) {
            if (!isNegativeValue(inputValue) && isNegativeValue(minValue)) {
                result = minResult = true;
            } else if (isNegativeValue(inputValue) && isNegativeValue(minValue)) {
                inputStrValue = inputValue;
                inputStrValue = inputStrValue.replace(/^-/, '');
                inputLength = inputStrValue.length;
                minStrValue = minValue;
                minStrValue = minStrValue.replace(/^-/, '');
                minLength = minStrValue.length;
                result = minResult = (inputLength === minLength) ? (inputStrValue <= minStrValue) : (inputLength < minLength);
            } else if (!isNegativeValue(inputValue) && !isNegativeValue(minValue)) {
                minLength = minValue.length;
                inputLength = inputValue.length;
                result = minResult = (inputLength === minLength) ? (inputValue >= minValue) : (inputLength > minLength);
            }
        }
        if (minValue && maxValue) {
            result = maxResult && minResult;
        }
        return result; 
    }
});
