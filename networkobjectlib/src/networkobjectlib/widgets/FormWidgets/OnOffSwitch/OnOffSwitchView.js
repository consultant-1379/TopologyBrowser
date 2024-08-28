define([
    'jscore/core',
    'template!./_OnOffSwitch.html',
    'styles!./_OnOffSwitch.less',
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getCheckBox: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-checkbox');
        },

        setSwitchOnStyle: function() {
            this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-switch').setModifier('status', 'active');
            this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-inner').setModifier('status','active');
        },

        setSwitchOffStyle: function() {
            this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-switch').setModifier('status', 'inactive');
            this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-inner').setModifier('status','inactive');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getSwitchElement: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff');
        },

        getLabel: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-label');
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-keyStyle');
        },

        showError: function(message) {
            this.getElement().find('.ebInput-status').setModifier('error');
            this.getElement().find('.ebInput-statusError').setText(message);

            return this;
        },

        hideError: function() {
            this.getElement().find('.ebInput-status').removeModifier('error');

            return this;
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-onOff-modelInfoButton');
        }

    });

});
