define([
    'jscore/core',
    './OnOffSwitchView',
    '../AbstractWidget/AbstractWidget',
    'i18n!networkobjectlib/dictionary.json'
], function(core, View, AbstractWidget, i18n) {

    return AbstractWidget.extend({


        //Not implemented: map of values for true/false
        view: null,

        //We use the key as part of the id for the checkbox
        init: function(element) {
            this.options.trueText = i18n.trueText;
            this.options.falseText = i18n.falseText;
            this.view =  new View(this.options);
            this.element = element;
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            if (this.options.keySectionDisabled) {
                this.view.getKeyValue().setModifier('hidden');
            }
            this.view.getCheckBox().addEventHandler('change', this.switchChangeEvent.bind(this));
            if (this.options.value === 'true' || this.options.value === true) {
                this.view.getCheckBox().setProperty('checked', true);
                this.setSwitchOnStyle();
            }

            // if its a new item, then show purple bar
            if (this.options.newItem === true) {
                this.view.getOuterWrapper().setModifier('valid');
            }

            if (this.element.description !== null) {
                this.createModelInfoButton();
            }
        },

        validate: function() {
            var checkBoxValue = this.view.getCheckBox().getProperty('checked');

            // if is new item, it should be always marked as changed
            if (this.options.newItem || checkBoxValue !== this.options.value) {
                this.view.getOuterWrapper().setModifier('valid');
            }
            else {
                this.view.getOuterWrapper().removeModifier('valid');
            }

            this.setValid(true);

            this.options.onChangeCallback({
                'key': this.getKeyValue(),
                'value': checkBoxValue,
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
        },

        switchChangeEvent: function() {
            this.validate();
            if (this.view.getCheckBox().getProperty('checked') === true) {
                this.setSwitchOnStyle();

            } else {
                this.setSwitchOffStyle();

            }
        },

        setSwitchOnStyle: function() {
            this.view.setSwitchOnStyle();
        },

        setSwitchOffStyle: function() {
            this.view.setSwitchOffStyle();
        }
    });
});
