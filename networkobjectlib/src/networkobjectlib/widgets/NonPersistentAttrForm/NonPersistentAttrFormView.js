define([
    'jscore/core',
    'template!./NonPersistentAttrForm.html',
    'styles!./NonPersistentAttrForm.less',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, style, i18n) {

    return core.View.extend({

        /*
         @desc default method to get the html template associated with the view defined above
         */
        getTemplate: function() {
            //return template;
            return template({
                nonPersistentInfoMessage: i18n.nonPersistentInfoMessage,
                nonPersistentAttributesNotFound: i18n.nonPersistentAttributesNotFound
            });
        },

        /*
         @desc default method to get access to the style defined above
         */
        getStyle: function() {
            return style;
        },

        getFormContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-nonPersistent');
        },

        getNonPersistentAttrbsNotFound: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-nonPersistent-attributesNotFound');
        },

        showNonPersistentAttrbsNotFoundMsg: function() {
            return this.getNonPersistentAttrbsNotFound().setModifier('show');
        },

        hideNonPersistentAttrbsNotFoundMsg: function() {
            return this.getNonPersistentAttrbsNotFound().removeModifier('show');
        },

        getNonPersistentFormErrorMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-nonPersistent-errorMessage');
        }
    });
});




