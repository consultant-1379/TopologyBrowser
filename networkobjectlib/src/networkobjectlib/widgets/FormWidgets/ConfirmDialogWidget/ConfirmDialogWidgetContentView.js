define([
    'jscore/core',
    'template!./ConfirmDialogWidgetContent.html',
    'text!./ConfirmDialogWidgetContent.less',
    'i18n!networkobjectlib/dictionary.json',
], function(core, template, style, i18n) {

    return core.View.extend({

        getTemplate: function() {
            return template(i18n);
        },

        getStyle: function() {
            return style;
        },

        getTrafficDisturbanceMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-widgets-confirmDialogContent-trafficDisturbance');
        },

        showTrafficDisturbanceMessage: function() {
            return this.getTrafficDisturbanceMessage().removeStyle('display');
        },

        hideTrafficDisturbanceMessage: function() {
            return this.getTrafficDisturbanceMessage().setStyle('display', 'none');
        },

        getManagedObjectsMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-widgets-confirmDialogContent-managedObjects');
        },

        showManagedObjectsMessage: function() {
            return this.getManagedObjectsMessage().removeStyle('display');
        },

        hideManagedObjectsMessage: function() {
            return this.getManagedObjectsMessage().setStyle('display', 'none');
        },

        getOtherObjectsMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-widgets-confirmDialogContent-otherObjects');
        },

        showOtherObjectsMessage: function() {
            return this.getOtherObjectsMessage().removeStyle('display');
        },

        hideOtherObjectsMessage: function() {
            return this.getOtherObjectsMessage().setStyle('display', 'none');
        },

        getLinkMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-widgets-confirmDialogContent-link');
        },

        showLinkMessage: function() {
            return this.getLinkMessage().removeStyle('display');
        },

        hideLinkMessage: function() {
            return this.getLinkMessage().setStyle('display', 'none');
        }

    });

});
