define([
    'jscore/core',
    'template!./EditManagementState.html',
    'styles!./EditManagementState.less'
], function(core, template, style) {

    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getNormalRadio: function() {
            return this.getElement().find('.elNetworkObjectLib-wEditManagementState-normal-radio');
        },

        getMaintenanceRadio: function() {
            return this.getElement().find('.elNetworkObjectLib-wEditManagementState-maintenance-radio');
        },

        enableEditStateReviewChangeButton: function() {
            var button = document.querySelector('div.ebDialogBox-actionBlock button.ebBtn.ebBtn_disabled.ebBtn_color_blue[disabled=\'disabled\']');
            if (button) {
                button.classList.remove('ebBtn_disabled');
                button.removeAttribute('disabled');
            }
        },

        isNormalChecked: function() {
            return this.getNormalRadio().getProperty('checked');
        },

        isMaintenanceChecked: function() {
            return this.getMaintenanceRadio().getProperty('checked');
        }
    });
});
