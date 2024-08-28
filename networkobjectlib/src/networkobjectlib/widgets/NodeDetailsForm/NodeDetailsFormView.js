define([
    'jscore/core',
    'template!./NodeDetailsForm.html',
    'styles!./NodeDetailsForm.less',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, style, i18n) {

    return core.View.extend({

        /*
         @desc default method to get the html template associated with the view defined above
         */
        getTemplate: function() {
            return template({
                recentlyModified: i18n.recentlyModified
            });
        },

        /*
         @desc default method to get access to the style defined above
         */
        getStyle: function() {
            return style;
        },

        getFormContainer: function() {
            return this.getElement();
        },

        getModifiedHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-modifiedHolder');
        },

        getNodeDetailsFormContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-message-container');
        }
    });
});




