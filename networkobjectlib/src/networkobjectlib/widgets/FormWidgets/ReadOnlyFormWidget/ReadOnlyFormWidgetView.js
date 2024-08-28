define([
    'jscore/core',
    'template!./ReadOnlyFormWidget.html',
    'styles!./ReadOnlyFormWidget.less',
    '../../../utils/TooltipBuilder'
], function(core, template, style, TooltipBuilder) {

    return core.View.extend({

        getTemplate: function() {
             //We need to Stringify value because handlebar renders falsy (0, false, null etc) as empty strings
            this.options.itemsNew = {
                key: this.options.key,
                description: this.options.description,
                value: function() {
                    if (this.options.formattedTimestamp) {
                        return this.options.formattedTimestamp;
                    }
                    else if (this.options.value === null) {
                        return 'null';
                    }
                    else if (typeof this.options.value === 'undefined') {
                        return '';
                    }
                    else {
                        return this.options.value.toString();
                    }
                }.bind(this)(),
                descriptionFixed: TooltipBuilder.fixTitleLabel(this.options.description),
                valueFixed: TooltipBuilder.fixTitleLabel(this.options.value)
            };
            return template(this.options.itemsNew);
        },

        getStyle: function() {
            return style;
        },

        getValueElement: function() {
            return this.getElement().find('p');
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-readOnly-modelInfoButton');
        }
    });

});
