define([
    'jscore/core',
    './AttributesMsgWidgetView',
    'widgets/Notification',
    'i18n!networkobjectlib/dictionary.json'  
], function(core, View, Notification, i18n) {
    return core.Widget.extend({
        View: View,

        init: function(options) {
            this.options = options;
        },

        onViewReady: function() {
            var errorMsg = '';
            if (this.options.errorMsg) {
                errorMsg = this.options.errorMsg;
            } else {
                if (this.options.label === 'Persistent') {
                    errorMsg = i18n.attributesPanelPersistentErrorMsg;
                } else {
                    errorMsg = i18n.defaultNonPersistentErrorMsg;
                }
            }
            this.view.getAttributesErrorMessageText().setText(errorMsg);
        },

        showAttributesErrorMessage: function() {
            this.view.showAttributesErrorMessage();
        },

        hideAttributesErrorMessage: function() {
            this.view.hideAttributesErrorMessage();
        }
    });

});



