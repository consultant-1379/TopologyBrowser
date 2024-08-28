define([
    'jscore/core',
    './StringInputFormWidgetView',
    'widgets/Tooltip',
    '../AbstractWidget/AbstractWidget',
    '../../../utils/Validator',
    'i18n!networkobjectlib/dictionary.json'
], function(core, View, Tooltip, AbstractWidget, Validator, i18n) {
    return AbstractWidget.extend({

        view: null,

        onChangeFunction: null,

        init: function(options) {
            this.options = options;
            this.view =  new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            if (this.options.keySectionDisabled) {
                this.view.getAttributeKey().setModifier('hidden');
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

        onDOMAttach: function() {
            if (this.options) {
                this.view.setTextAreaHeightDynamically();
                this.view.getTextInput().addEventHandler('input', function() { this.view.setTextAreaHeightDynamically(); }.bind(this));

                var width = this.view.getTextInput().getProperty('clientWidth');

                setInterval(function() {
                    if (width !== this.view.getTextInput().getProperty('clientWidth')) {
                        this.view.setTextAreaHeightDynamically();
                        width = this.view.getTextInput().getProperty('clientWidth');
                    }
                }.bind(this), 75);
            }

        },

        disable: function() {
            this.view.disableInput();
        },

        handleChangedEvent: function() {
            var value = this.view.getTextInputValue();
            var constraintsToValidate = Validator.getStringConstraints(this.options.constraints);

            if (this.options.isMultiEdit && value === '') {
                this.doValid(this.options.key, value, this.options.type, this.options.sensitive);
                this.view.getOuterWrapper().removeModifier('valid');
            } else {
                this.handleChangedValue(value, constraintsToValidate);
            }
        },

        handleChangedValue: function(value, constraints) {
            try {
                Validator.validate(value, constraints);

                if ((constraints.isNullable || constraints.isNullable === null) && (typeof value === 'undefined' || value === '<null>' || value === 'null' || value === '')) {
                    value = null;
                }

                this.doValid(this.options.key, value, this.options.type, this.options.sensitive);
            } catch (e) {
                this.doInvalid(this.options.key, value, this.options.type, this.options.sensitive, e.message);
            }
        },

        doValid: function(key, value, type, sensitive) {
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
                datatype: type,
                sensitive: sensitive
            });
        },

        doInvalid: function(key, value, type, sensitive, message) {
            this.setValid(false);
            this.showError(message);
            this.view.getOuterWrapper().removeModifier('valid');

            //Add to Invalids
            if (message !== i18n.inlineValidation.listMembersMustBeUnique) {
                this.options.onInvalidCallback({
                    key: key,
                    value: value,
                    datatype: type,
                    sensitive: sensitive
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



