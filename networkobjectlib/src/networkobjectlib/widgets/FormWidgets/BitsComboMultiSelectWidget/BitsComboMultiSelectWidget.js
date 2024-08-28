define([
    'jscore/core',
    'widgets/Tooltip',
    'widgets/ComboMultiSelect',
    './BitsComboMultiSelectWidgetView',
    '../AbstractWidget/AbstractWidget',
    'i18n!networkobjectlib/dictionary.json'
], function(core, Tooltip, ComboMultiSelect, View, AbstractWidget, i18n) {
    return AbstractWidget.extend({

        onChangeFunction: null,

        init: function(options) {
            this.options = options;
            this.view =  new View(this.options);
            this.allBitsValues = [];
            this.itemsList = [];
            this.selectedValues = [];

            this.options.bitsMembers.forEach(function(member) {
                this.allBitsValues.push(member.key);
                this.itemsList.push(this.createItem(member.key, member.value, member.key));
            }.bind(this));
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            if (this.options.keySectionDisabled) {
                this.view.hideKeyValue();
            }
            this.widget = this.createComboMultiSelect();
            this.widget.addEventHandler('change', this.handleChangedEvent.bind(this));
            this.widget.attachTo(this.view.getComboMultiSelectContainer());

            if (this.options.readOnly) {
                this.disable();
            }
            if (this.options.description !== null) {
                this.createModelInfoButton();
            }
        },

        createComboMultiSelect: function() {
            this.getValuesFromOptions().forEach(function(value) {
                this.itemsList.forEach(function(item) {
                    if (item.name === value) {
                        this.selectedValues.push(this.createItem(item.name, item.value, item.title));
                    }
                }.bind(this));
            }.bind(this));

            return new ComboMultiSelect({
                value: this.selectedValues,
                items: this.itemsList,
                autoComplete: {
                    enabled: true,
                    message: {
                        notFound: i18n.noResult
                    }
                },
                modifiers: [{
                    name: 'width',
                    value: 'full'
                }],
            });
        },

        getValuesFromOptions: function() {
            var values;
            if (this.options.value === null || this.options.value === '') {
                values = [];
            } else {
                values = this.options.value.match(/[^ ]+/g);
            }

            if (values.indexOf('*') !== -1) {
                values = this.options.bitsMembers.map(function(member) {
                    return member.key;
                });
            }

            return values;
        },

        createItem: function(name, value, title) {
            return {
                name: name,
                value: value,
                title: title
            };
        },

        disable: function() {
            if (this.widget) {
                this.widget.disable();
            }
        },

        handleChangedEvent: function() {
            var value;
            try {
                this.widget.view.getTextArea().setValue('');
                var inputValues = this.getStringValues(this.widget.getValue());

                this.validate(inputValues, this.getBitsConstraints(this.options.constraints));

                value = inputValues.join(' ');

                if (inputValues.length === 0) {
                    value = null;
                } else if (Array.isArray(inputValues) && (this.options.bitsMembers.length === inputValues.length)) {
                    value = '*';
                }

                this.doValid(this.options.key, value, this.options.type);

            } catch (error) {
                this.doInvalid(this.options.key, value, this.options.type, error.message);
            }
        },

        getStringValues: function(values) {
            return values.map(function(value) {
                return value.name;
            });
        },

        validate: function(inputValues, constraintsToValidate) {

            //if nullable
            if (inputValues.length === 0) {
                if (constraintsToValidate.isNullable) {
                    return null;
                }
                throw new Error(i18n.inlineValidation.cannotBeNull);
            }

            // if there are bits constraints
            if (constraintsToValidate.bitsConstraint) {
                inputValues.forEach(function(value) {
                    if (constraintsToValidate.bitsConstraint[value]) {
                        throw new Error(i18n.inlineValidation.invalidBitsValue);
                    }
                });
            }

            inputValues.forEach(function(value) {
                if ((constraintsToValidate.bitsConstraint && constraintsToValidate.bitsConstraint[value]) || this.allBitsValues.indexOf(value) === -1) {
                    throw new Error(i18n.inlineValidation.invalidBitsValue);
                }
            }.bind(this));

        },

        getBitsConstraints: function(constraints) {
            return {
                isNullable: constraints && constraints.nullable === true,
                bitsConstraint: (constraints && constraints.bitsConstraint) ? constraints.bitsConstraint : null,
                validContentRegex: constraints ? constraints.validContentRegex : []
            };
        },

        doValid: function(key, value, type) {
            this.setValid(true);
            this.hideError();
            this.view.doValid();

            if (!this.isInputValuesIdentical(value, this.options.value)) {
                this.view.setOuterWrapperValid();
            } else {
                this.view.removeOuterWrapperValid();
            }

            //Add to Collection
            this.options.onChangeCallback({
                key: key,
                value: value,
                datatype: type
            });
        },

        isInputValuesIdentical: function(value, previousValue) {
            var doValuesExist;
            if (value === null || previousValue === null || value === '' || previousValue === '') {
                return value === previousValue;
            }

            var values = value.match(/[^ ]+/g);
            var previousValues = previousValue.match(/[^ ]+/g);

            if (values === null) {
                return value === previousValue;
            }

            doValuesExist = values.reduce(function(acc, val) {
                return acc && previousValues.indexOf(val) !== -1;
            }, true);

            return doValuesExist && (values.length === previousValues.length);
        },

        doInvalid: function(key, value, type, message) {
            this.setValid(false);
            this.showError(message);
            this.view.doInValid();
            this.view.removeOuterWrapperValid();

            //Add to Invalids
            this.options.onInvalidCallback({
                key: key,
                value: value,
                datatype: type
            });
        },

        showError: function(errorMessage) {
            this.view.showError(errorMessage);
        },

        hideError: function() {
            this.view.hideError();
        },

        setKeyValue: function(keyValue) {
            this.keyValue = keyValue;
        },

        getKeyValue: function() {
            return this.keyValue;
        }

    });
});
