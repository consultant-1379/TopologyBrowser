define([
    'widgets/WidgetCore',
    './EditManagementStateView',
    'i18n!networkobjectlib/dictionary.json'
], function(WidgetCore, View, i18n) {
    'use strict';

    return WidgetCore.extend({
        View: function() {
            return new View(i18n.get('editManagementState'));
        },

        onViewReady: function() {
            this.view.getNormalRadio().addEventHandler('click', function() {
                this.view.enableEditStateReviewChangeButton();
            }.bind(this));

            this.view.getMaintenanceRadio().addEventHandler('click', function() {
                this.view.enableEditStateReviewChangeButton();
            }.bind(this));
        },

        getRadioSelection: function() {
            if (this.view.isNormalChecked()) {
                return 'NORMAL';
            }

            if (this.view.isMaintenanceChecked()) {
                return 'MAINTENANCE';
            }
        }
    });
});
