define([
    'jscore/core',
    './NumberInputFormWidgetView',
    '../AbstractWidget/AbstractWidget',
    '../../../utils/Validator',
    'i18n!networkobjectlib/dictionary.json'
], function(core, View, AbstractWidget, Validator, i18n) {
    return AbstractWidget.extend({

        view: null,

        onChangeFunction: null,

        init: function(options) {
            this.options= options;
            this.view =  new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            if (this.options.keySectionDisabled) {
                this.view.getKeyValue().setModifier('hidden');
            }
            //For Multi-Edit flow, A place holder "Enter A Value" is provided in the input text box.
            if (this.options.isMultiEdit) {
                this.view.getTextInput().setAttribute('placeholder', i18n.get('inputBoxEmptyValueMessage'));
            }
            if (this.options.validateOnStart) {
                this.handleChangedEvent();
            }
            this.view.getTextInput().addEventHandler('input', this.handleChangedEvent.bind(this));

            if (this.options.description !== null) {
                this.createModelInfoButton();
            }
        },

        handleChangedEvent: function() {
            var value = this.view.getTextInputValue();
            var constraintsToValidate = Validator.getNumberConstraints(this.options.constraints);
            if (this.options.isMultiEdit && value === '') {
                this.doValid(this.options.key, value, this.options.type);
                this.view.getOuterWrapper().removeModifier('valid');
            } else {
                this.handleChangedValue(value, constraintsToValidate);
            }
        },

        handleChangedValue: function(value, constraints) {
            try {
                Validator.validate(value, constraints, undefined, this.options.type);

                if (Validator.isNull(value, constraints)) {
                    value = null;
                } else {
                    if (this.options.type === 'LONG') {
                        value = value.toString();                                                                   
                        var isNegative = (value.indexOf('-') !== -1);
                        value = isNegative ? value.replace(/^-/, '') : value;
                        if (value.match(/^0+[1-9]/)) {
                            value = value.replace(/^0+/, '');
                        } else if (value.match(/^0+$/)) {
                            value = '0';
                        }
                        if (value !== '0') {
                            value = isNegative ? '-'+value : value;
                        }
                    } else {
                        value = parseInt(value);
                    }

                }

                this.doValid(this.options.key, value, this.options.type);
            } catch (e) {
                this.doInvalid(this.options.key, value, this.options.type, e.message);
            }
        },

        doValid: function(key, value, type) {
            this.setValid(true);
            this.hideError();

            var previousValue = this.options.value;

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
            this.view.getOuterWrapper().removeModifier('valid');

            //Add to Invalids
            if (message !== i18n.inlineValidation.listMembersMustBeUnique) {
                this.options.onInvalidCallback({
                    key: key,
                    value: value,
                    datatype: type
                });
            }
        },


        showError: function(errorMessage) {
            this.view.getTextInput().setModifier('borderColor_red');
            this.view.getErrorOuterContainer().setModifier('displayed');
            this.view.getErrorMessage().setText(errorMessage);
            this.view.getErrorContainer().setModifier('error');
        },

        hideError: function() {
            this.view.getTextInput().removeModifier('borderColor_red');
            this.view.getErrorOuterContainer().removeModifier('displayed');
            this.view.getErrorContainer().removeModifier('error');
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



