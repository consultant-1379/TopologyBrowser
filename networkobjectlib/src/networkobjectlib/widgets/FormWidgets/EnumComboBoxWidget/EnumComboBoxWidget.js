define([
    'jscore/core',
    './EnumComboBoxWidgetView',
    'widgets/Combobox',
    'i18n!networkobjectlib/dictionary.json',
    '../AbstractWidget/AbstractWidget',
    '../../../utils/Validator',
    '../../../utils/TooltipBuilder'
], function(core, View, ComboBox, i18n, AbstractWidget, Validator, TooltipBuilder) {
    return AbstractWidget.extend({

        init: function(options) {
            this.options = options;
            this.mandatory = (!!options.constraints && !options.constraints.nullable) || !!options.defaultValue;
            this.nullOption = this.createItem(i18n.selectBoxEmptyValueMessage, null, i18n.selectBoxEmptyValueMessage);
        },

        view: function() {
            this.options.inputTitle = this.titleTextBuilder(this.options.inputTitle);
            this.options.descriptionFixed = TooltipBuilder.fixTitleLabel(this.options.description);
            return new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            if (this.options.keySectionDisabled) {
                this.view.getKeyValue().setModifier('hidden');
            }
            this.widget = this.createComboBox();
            this.widget.addEventHandler('change', this.handleChangedEvent.bind(this));
            this.widget.attachTo(this.view.getComboBoxContainer());

            if (this.options.readOnly) {
                this.disable();
            }
            if (this.options.description !== null) {
                this.createModelInfoButton();
            }
        },

        getWidget: function() {
            return this.widget;
        },

        titleTextBuilder: function(modified) {
            return modified || TooltipBuilder.build(this.options);
        },

        disable: function() {
            this.widget.disable();
        },

        enable: function() {
            this.widget.enable();
        },

        validate: function(inputValue) {
            var checkNotNull = (this.options.constraints && this.options.constraints.nullable === false);
            var checkRange = (this.options.constraints && this.options.constraints.valueRangeConstraints !== undefined && this.options.constraints.valueRangeConstraints !== null);
            var checkNumberRange = (this.options.constraints && this.options.constraints.numberValueRangeConstraints !== undefined && this.options.constraints.numberValueRangeConstraints !== null);
            var checkRegex = (this.options.constraints && this.options.constraints.validContentRegex !== undefined && this.options.constraints.validContentRegex !== null);
            var checkNumber = (this.options.modifier && !this.options.modifier.acceptStrings && !!this.options.modifier.acceptNumbers);

            // at least one should be valid
            var isValid = false;
            var errorMessage = [];
            var constraintsToValidate = {};
            // if not nullable
            if (checkNotNull) {
                if (Validator.isNull(inputValue, constraintsToValidate)) {
                    errorMessage.push(i18n.inlineValidation.cannotBeNull);
                }
            } // if nullable
            else {
                if (Validator.isNull(inputValue, constraintsToValidate)) {
                    isValid = true;
                    inputValue = null;
                }
            }

            // if there is string length range constraint
            if (!isValid && checkRange) {
                if (Validator.isValidRange(inputValue.length, this.options.constraints.valueRangeConstraints)) {
                    isValid = true;
                }
                else {
                    errorMessage.push(i18n.inlineValidation.stringInvalidRange);
                }
            }

            // if there is number range constraint
            if (!isValid && checkNumberRange) {
                if (Validator.isValidRange(inputValue, this.options.constraints.numberValueRangeConstraints)) {
                    isValid = true;
                }
                else {
                    if (checkNumber) {
                        if (isNaN(inputValue)) {
                            errorMessage.push(i18n.inlineValidation.notANumber);
                        }
                    }
                    errorMessage.push(i18n.inlineValidation.numberOutOfRange);
                }
            }

            // if there is regex constraint
            if (!isValid && checkRegex) {
                if (Validator.isValidRegex(inputValue, this.options.constraints.validContentRegex)) {
                    isValid = true;
                }
                else {
                    errorMessage.push(i18n.inlineValidation.doesNotMatchRegex);
                }
            }

            // we always have enum, so validate enum
            if (!isValid && Validator.isValidEnum(inputValue, this.itemsList)) {
                isValid = true;
            }
            else {
                errorMessage.push(i18n.inlineValidation.invalidOption);
            }

            if (isValid === false) {
                this.doInvalid(this.options.key, inputValue, this.options.type, errorMessage[0]);
            }
            else {
                this.doValid(this.options.key, inputValue, this.options.type);
            }
        },

        doValid: function(key, value, type) {
            this.setValid(true);
            this.hideError();
            this.view.getTextInput().removeModifier('borderColor_red');
            this.view.getComboButton().removeModifier('borderColor_red');

            var previousValue = (value === null) ? this.options.value : String(this.options.value);

            if (value !== previousValue) {
                this.view.getOuterWrapper().setModifier('valid');
            }
            else {
                this.view.getOuterWrapper().removeModifier('valid');
            }

            //Add to Collection
            this.options.onChangeCallback({
                key: key,
                value: value,
                datatype: type
            });
        },

        doInvalid: function(key, value, type, message) {
            this.setValid(false);
            this.showError(message);
            this.view.getTextInput().setModifier('borderColor_red');
            this.view.getComboButton().setModifier('borderColor_red');
            this.view.getOuterWrapper().removeModifier('valid');

            //Add to Invalids
            this.options.onInvalidCallback({
                key: key,
                value: value,
                datatype: type
            });
        },

        createComboBox: function() {
            this.itemsList = this.options.enumeration.enumMembers.map(function(e) {
                return (e.separator) ? { type: 'separator' } : this.createItem(e.key, e.value, e.description);
            }.bind(this));

            // get item from list based on value
            var selectedValue = this.itemsList.filter(function(item) {
                return item.value === this.options.value;
            }.bind(this))[0];

            // if value was not found on items list
            if (!selectedValue) {
                selectedValue = this.createItem(this.options.value, this.options.value, this.options.value);
            }

            var dropdown = new ComboBox({
                value: selectedValue,
                items: this.itemsList
            });

            return dropdown;
        },

        createItem: function(name, value, title) {
            return {
                name: name,
                value: value,
                title: title
            };
        },

        handleChangedEvent: function() {
            var value = this.widget.getValue() ? this.widget.getValue().value: null;
            this.validate(value);

        },

        handleChangedValue: function(value) {
            if (value === this.options.value) {
                this.view.getOuterWrapper().removeModifier('valid');
            }
            else {
                this.view.getOuterWrapper().setModifier('valid');
            }

            //Add to Collection
            this.options.onChangeCallback({
                'key': this.getKeyValue(),
                'value': value,
                'datatype': this.options.type
            });
        },

        showError: function(errorMessage) {
            this.view.showError(errorMessage);
        },

        hideError: function() {
            this.view.hideError();
        },

        setIndex: function(index) {
            this.setKeyValue(this.baseKeyValue + index);
            this.updateDisplayWIthKeyValue(index);
        },

        updateDisplayWIthKeyValue: function(text) {
            this.view.getKeyValue().setText(text);
        },

        setKeyValue: function(keyValue) {
            this.keyValue = keyValue;
        },

        getKeyValue: function() {
            return this.keyValue;
        }
    });

});



