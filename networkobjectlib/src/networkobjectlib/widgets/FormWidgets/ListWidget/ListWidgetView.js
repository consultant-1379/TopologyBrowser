define([
    'jscore/core',
    'template!./ListWidget.html',
    'styles!./ListWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getAccordionContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-listWidget-accordionContainer');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getModelInfoButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-listWidget-modelInfoButton');
        }
    });

});
