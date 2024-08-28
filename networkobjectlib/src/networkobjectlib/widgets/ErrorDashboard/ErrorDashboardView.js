define([
    'jscore/core',
    'template!./ErrorDashboard.html',
    'styles!./ErrorDashboard.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getErrorDashboard: function() {
            return this.getElement().find('.elNetworkObjectLib-wErrorDashboard-errorMessage');
        },

        showErrorDashboard: function() {
            return this.getErrorDashboard().removeModifier('hidden');
        },

        hideErrorDashboard: function() {
            return this.getErrorDashboard().setModifier('hidden');
        },

        getErrorMessageHeader: function() {
            return this.getErrorDashboard().find('.elNetworkObjectLib-wErrorDashboard-messageHeader');
        },

        getErrorMessageParagraph: function() {
            return this.getErrorDashboard().find('.elNetworkObjectLib-wErrorDashboard-messageParagraph');
        }
    });

});
