define([
    'jscore/core',
    'template!./EnumComboBoxWidget.html',
    'styles!./EnumComboBoxWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getComboBoxContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-enum-combobox-comboboxContainer');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getTextInput: function() {
            return this.getElement().find('.ebInput');
        } ,
        getComboButton: function() {
            return this.getElement().find('.ebCombobox-helper');
        } ,

        showError: function(message) {
            this.getElement().find('.ebInput-status').setModifier('error');
            this.getElement().find('.ebInput-statusError').setText(message);

            return this;
        },

        hideError: function() {
            this.getElement().find('.ebInput-status').removeModifier('error');

            return this;
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-enum-combobox-keyStyle');
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-enum-combobox-modelInfoButton');
        }
    });

});
