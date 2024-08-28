define([
    'jscore/core',
    'template!./StringInputFormWidget.html',
    'styles!./StringInputFormWidget.less'
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
                        if (this.options.formattedTimestamp) {
                            return this.options.formattedTimestamp;
                        }
                        else if (this.options.value === null) {
                            return '<null>';
                        }
                        else if (typeof this.options.value === 'undefined') {
                            return '';
                        }
                        else {
                            return this.options.value.toString();
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
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-stringInput-input-'+this.options.key);
        },

        getAttributeKey: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-stringInput-keyStyle');
        },

        getTextInputValue: function() {
            return this.getTextInput().getValue();
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        disableInput: function() {
            this.getTextInput().setProperty('disabled', true);
        },

        getErrorContainer: function() {
            return this.getElement().find('.ebInput-status');
        },

        getErrorOuterContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-stringInput-error');
        },

        getErrorMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-stringInput-errorMessage');
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-stringInput-keyStyle');
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-stringInput-modelInfoButton');
        },

        setTextAreaHeightDynamically: function() {
            this.getTextInput().setStyle('height', '0px');

            var height = !this.getTextInputValue() ? '20px' : this.getTextInput().getProperty('scrollHeight');

            this.getTextInput().setStyle('overflow-y', height > 300 ? 'visible' : 'hidden');

            this.getTextInput().setStyle('height', height);
        }
    });

});
