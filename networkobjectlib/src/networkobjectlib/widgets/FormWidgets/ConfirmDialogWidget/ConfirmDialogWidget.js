define([
    'widgets/WidgetCore',
    './ConfirmDialogWidgetContent',
    'widgets/Dialog',
    'i18n!networkobjectlib/dictionary.json',
], function(WidgetCore, ConfirmDialogWidgetContent, Dialog, i18n) {
    'use strict';

    var dialog;
    var content;
    // var buttons;
    // var buttonsContent = [
    //     {
    //         caption: i18n.buttons.saveChanges,
    //         color: 'darkBlue',
    //         action: buttons.saveAction || function() {}
    //     },
    //     {
    //         caption: i18n.buttons.cancel,
    //         action: buttons.cancelAction || function() {}
    //     }
    // ];

    return WidgetCore.extend({

        init: function(options) {
            content = new ConfirmDialogWidgetContent();
            // buttons = options;
            this.buttonsContents = getButtons(options);
            dialog = new Dialog({
                header: i18n.dialog.confirmSave,
                buttons: this.buttonsContents,
                content: content
            });
        },

        showChoiceChangedWarning: function() {
            content.view.showManagedObjectsMessage();
            content.view.showOtherObjectsMessage();
        },

        showTrafficDisturbanceWarning: function() {
            content.view.showTrafficDisturbanceMessage();
            content.view.showLinkMessage();
        },

        show: function(originalList, changeList) {
            // try catch because if there are any changes in display what are the changes we still want the user
            // to be able to save it
            try {
                var networkDisturbances = [];
                changeList.forEach(function(change) {
                    if (change.disturbance) {
                        networkDisturbances.push({key: change.key, disturbance: change.disturbance});
                    }
                });

                if (networkDisturbances.length > 0) {
                    dialog = new Dialog({
                        header: i18n.dialog.confirmSave,
                        type: 'warning',
                        buttons: this.buttonsContents,
                        content: content
                    });

                }
                content.setChanges(originalList, changeList, networkDisturbances);
            }
            catch (e) {
                console.error('There was an error trying to generate the changes table');
            }

            dialog.show();
        },

        hide: function() {
            dialog.hide();
        }

    });

    function getButtons(options) {
        return [
            {
                caption: i18n.buttons.saveChanges,
                color: 'darkBlue',
                action: options.saveAction || function() {}
            },
            {
                caption: i18n.buttons.cancel,
                action: options.cancelAction || function() {}
            }
        ];
    

    }
});



