define([
    'widgets/WidgetCore',
    './RefreshDialogWidgetContent',
    'widgets/Dialog',
    'i18n!networkobjectlib/dictionary.json',
], function(WidgetCore, RefreshDialogWidgetContent, Dialog, i18n) {
    'use strict';

    var dialog;
    var content;

    return WidgetCore.extend({

        init: function(options) {
            content = new RefreshDialogWidgetContent();

            dialog = new Dialog({
                header: i18n.refreshInfo.title,
                type: 'information',
                buttons: [
                    {
                        caption: i18n.buttons.ok,
                        color: 'darkBlue',
                        action: options.okAction || function() {}
                    }
                ],
                content: content
            });
        },

        show: function(data) {
            content.setData(data);
            dialog.show();
        },

        hide: function() {
            dialog.hide();
        }

    });
});
