define([
    'jscore/core',
    'template!./ReadOnlyWrapperWidget.html',
    'styles!./ReadOnlyWrapperWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getAccordionContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-accordionWrapper-container');
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-accordionWrapper-modelInfoButton');
        }
    });

});
