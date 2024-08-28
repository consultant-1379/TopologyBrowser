define([
    'jscore/core',
    'template!./YANGChoiceSelectorWidget.html',
    'styles!./YANGChoiceSelectorWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getDropdownContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-selector-dropdownContainer');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-selector-keyStyle');
        }
    });

});
