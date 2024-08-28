define([
    'jscore/core',
    '../../utils/Filters'
], function(core, Filters) {

    return core.Widget.extend({

        init: function() {

        },

        handleChangedValue: function() {

        },

        updateFiltering: function(filterString) {
            var filteredInList = this.formElements.filter(function(e) {
                return Filters.filterFormAttribute(filterString, e.options);
            });

            var filteredOutList = this.formElements.filter(function(e) {
                return filteredInList.indexOf(e) < 0;
            });

            filteredInList.forEach(function(e) {
                e.getElement().removeStyle('display');
            });

            filteredOutList.forEach(function(e) {
                e.getElement().setStyle('display', 'none');
            });

            return {
                filtered: filteredInList.length,
                total: this.formElements.length
            };
        },

        attributeValueChangedCallback: function(newKeyValuePair) {
            this.valuesToBeSaved = this.valuesToBeSaved.filter(function(e) {
                return e.key !== newKeyValuePair.key;
            });

            this.invalidValues = this.invalidValues.filter(function(e) {
                return e.key !== newKeyValuePair.key;
            });

            var originalValue = function() {
                if (newKeyValuePair.dataType === 'CHOICE') {
                    var choice = this.options.filter(function(e) { return e.key === newKeyValuePair.key; })[0];
                    if (!!choice && choice.cases) {
                        var caseObject = choice.cases.filter(function(e) { return e.name === newKeyValuePair.case; })[0];
                        if (caseObject) {
                            return caseObject.attributes;
                        }
                    }
                    return [];
                }
                else if (this.options.complexRef) {
                    return this.options.complexRef.attributes;
                }
                else {
                    return this.options;
                }
            }.bind(this)();

            var valueChanged = originalValue.filter(function(originalElement) {
                if (newKeyValuePair.dataType !== 'CHOICE') {
                    return originalElement.key === newKeyValuePair.key &&
                        !compareValues(originalElement.value, newKeyValuePair.value) &&
                        originalElement.readOnly === false;
                }
                else {
                    //TODO: CHOICE CASE
                    var modifiedElement = newKeyValuePair.value.filter(function(attribute) { return attribute.key=== originalElement.key; })[0];
                    if (!modifiedElement) {
                        return false;
                    }
                    return originalElement.key === modifiedElement.key &&
                        !compareValues(originalElement.value, modifiedElement.value) &&
                        originalElement.readOnly === false;
                }
            }.bind(this)).length;

            if (valueChanged> 0) {
                this.valuesToBeSaved.push(newKeyValuePair);
            }

            this.handleChangedValue();
        },

        invalidAttributeValueChangedCallback: function(newKeyValuePair) {
            this.invalidValues.push(newKeyValuePair);

            this.valuesToBeSaved = this.valuesToBeSaved.filter(function(e) {
                return e.key !== newKeyValuePair.key;
            });

            this.handleChangedValue();
        },

        compareValues: function(original, newValue) {
            return compareValues(original, newValue);
        }
    });

    function compareValues(original, newValue) {
        if (original instanceof Array) {
            var equalityOfLength,  equalityOfValues;
            //complex case:  Assumes order is teh same, ie sorted on key
            if (original.length > 0 &&original[0].key !== undefined) {
                var isArrayOfKeyValue = newValue instanceof Array && newValue.length> 0  && newValue[0].key !== undefined ;
                equalityOfLength = original.length === newValue.length;
                equalityOfValues = original.reduce(function(prev ,current, index) {
                    return prev && index < newValue.length? current.value ===  newValue[index].value: false;
                }, true);
                return isArrayOfKeyValue && equalityOfLength && equalityOfValues;
            }
            //sequence case
            else {
                var isArray = newValue instanceof Array;
                equalityOfLength = original.length === newValue.length;

                equalityOfValues =  original.reduce(function(prev ,current, index) {
                    return prev && index < newValue.length? compareValues(current, newValue[index]): false;
                }.bind(this), true);
                return isArray && equalityOfLength && equalityOfValues;
            }
        }
        else {
            if (original !== null && newValue !== null) {
                return  original.toString() === newValue.toString();
            }
            return original === newValue;

        }
    }
});
