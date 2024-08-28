define([
    'jscore/core',
    'template!./EnumDropdownWidget.html',
    'styles!./EnumDropdownWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getDropdownContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-enum-dropdownContainer');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-enum-keyStyle');
        },

        showError: function(message) {
            this.getElement().find('.ebInput-status').setModifier('error');
            this.getElement().find('.ebInput-statusError').setText(message);

            return this;
        },

        hideError: function() {
            this.getElement().find('.ebInput-status').removeModifier('error');
            this.getElement().find('.ebInput-statusError').setText('');
            return this;
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-enum-modelInfoButton');
        }
    });

});
