define([
    'jscore/core',
    'template!./YANGChoiceWidget.html',
    'styles!./YANGChoiceWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getAccordionContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-accordionContainer');
        },

        getChoiceProperyListContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-propertyList');
        },

        getOuterWrapper: function() {
            return this.getElement();
        },

        getKeyValue: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-keyStyle');
        }
    });

});
