define([
    'jscore/core',
    'template!./AttributesMsgWidget.html',
    'styles!./AttributesMsgWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getAttributesErrorMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-wAttributesMsg-errorContainer');
        },

        showAttributesErrorMessage: function() {
            return this.getAttributesErrorMessage().removeModifier('hidden');
        },

        hideAttributesErrorMessage: function() {
            return this.getAttributesErrorMessage().setModifier('hidden');
        },

        getAttributesErrorMessageText: function() {
            return this.getElement().find('.elNetworkObjectLib-wAttributesMsg-error-text');
        }
    });

});
