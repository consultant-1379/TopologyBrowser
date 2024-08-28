define([
    'jscore/core',
    'text!./CaseDetailsForm.html',
    'styles!./CaseDetailsForm.less'
], function(core, template, style) {

    return core.View.extend({

        /*
         @desc default method to get the html template associated with the view defined above
         */
        getTemplate: function() {
            return template;
        },

        /*
         @desc default method to get access to the style defined above
         */
        getStyle: function() {
            return style;
        },

        getFormContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-cases-casedetails-form-container');
        },

        getNodeDetailsFormContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-cases-casedetails-form-message-container');
        }
    });
});




