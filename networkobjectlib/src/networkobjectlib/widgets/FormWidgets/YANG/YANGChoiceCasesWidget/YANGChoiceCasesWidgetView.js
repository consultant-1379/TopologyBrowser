define([
    'jscore/core',
    'template!./YANGChoiceCasesWidget.html',
    'styles!./YANGChoiceCasesWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getCaseContainerByName: function(caseName) {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-cases-case-'+caseName);
        },

        showConflictError: function(message) {
            var conflictContainer = this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-cases-conflictError');
            conflictContainer.find('.ebNotification-label').setText(message);
            conflictContainer.removeStyle('display');
        },

        hideConflictError: function() {
            var conflictContainer = this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-form-yangchoice-cases-conflictError');
            conflictContainer.find('.ebNotification-label').setText('');
            conflictContainer.setStyle('display', 'none');
        }

    });

});
