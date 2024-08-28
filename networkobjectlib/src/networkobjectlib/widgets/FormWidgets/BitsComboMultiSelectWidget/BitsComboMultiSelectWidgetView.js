define([
    'jscore/core',
    'template!./BitsComboMultiSelectWidget.html',
    'styles!./BitsComboMultiSelectWidget.less'
], function(core, template, style) {
    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getComboMultiSelectContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-bits-comboMultiSelect-comboMultiSelectContainer');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getErrorOuterContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-bits-comboMultiSelect-error');
        },

        getComboMultiSelectTextArea: function() {
            return this.getComboMultiSelectContainer().find('.ebComboMultiSelect-textarea');
        },

        getComboMultiSelectButton: function() {
            return this.getComboMultiSelectContainer().find('.ebComboMultiSelect-helper');
        } ,

        showError: function(message) {
            this.getElement().find('.ebInput-status').setModifier('error');
            this.getElement().find('.ebInput-statusError').setText(message);
            this.getErrorOuterContainer().setModifier('displayed');
        },

        hideError: function() {
            this.getElement().find('.ebInput-status').removeModifier('error');
            this.getErrorOuterContainer().removeModifier('displayed');
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-bits-comboMultiSelect-keyStyle');
        },

        hideKeyValue: function() {
            this.getKeyValue().setModifier('hidden');
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-bits-comboMultiSelect-modelInfoButton');
        },

        doValid: function() {
            this.getComboMultiSelectTextArea().removeModifier('borderColor_red');
            this.getComboMultiSelectButton().removeModifier('borderColor_red');
        },

        doInValid: function() {
            this.getComboMultiSelectTextArea().setModifier('borderColor_red');
            this.getComboMultiSelectButton().setModifier('borderColor_red');
        },

        setOuterWrapperValid: function() {
            this.getOuterWrapper().setModifier('valid');
        },

        removeOuterWrapperValid: function() {
            this.getOuterWrapper().removeModifier('valid');
        }
    });
});
