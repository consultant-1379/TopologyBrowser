define([
    'jscore/core',
    'template!./NumberInputFormWidget.html',
    'styles!./NumberInputFormWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            //We need to Stringify value because handlebar renders falsy (0, false, null etc) as empty strings
            this.options.itemsNew = {
                key: this.options.key,
                description: this.options.description,
                inputTitle: this.options.inputTitle,
                value: function() {
                    //For Multi-Edit flow, no default should be populated in the input text box.
                    if (!this.options.isMultiEdit) {
                        if (this.options.value === null) {
                            return '<null>';
                        }
                        else {
                            return this.options.value;
                        }
                    }
                }.bind(this)()
            };
            return template(this.options.itemsNew);
        },
        getStyle: function() {
            return style;
        },

        getTextInput: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-numberInput-input-'+this.options.key);
        },

        getTextInputValue: function() {
            return this.getTextInput().getValue();
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getErrorContainer: function() {
            return this.getElement().find('.ebInput-status');
        },

        getErrorOuterContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-numberInput-error');
        },

        getErrorMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-numberInput-errorMessage');
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-numberInput-keyStyle');
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-numberInput-modelInfoButton');
        }

    });

});
