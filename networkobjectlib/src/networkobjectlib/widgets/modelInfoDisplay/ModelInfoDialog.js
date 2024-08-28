define([
    'jscore/core',
    'widgets/Dialog',
    './ModelInfoDisplay',
    'i18n!networkobjectlib/dictionary.json'
], function(core, Dialog, ModelInfoDisplay, dictionary) {
    'use strict';

    return core.Widget.extend({
        init: function(options) {
            this.listOfModelInfo = new ModelInfoDisplay(options);
            this.dialogBox = undefined;
        },

        display: function() {
            var modelInfoDialog = new Dialog({
                content: this.listOfModelInfo,
                topRightCloseBtn: true,
                fullContent: true,
                buttons: [
                    {
                        caption: dictionary.get('modelInfoDialog.ok'),
                        action: function() {
                            if (this.dialog) {
                                this.dialog.removeEventHandler(this.dialogEvtId);
                            }
                            modelInfoDialog.hide();
                        }
                    }
                ]
            });
            this.dialog = modelInfoDialog.view.getElement();
            if (this.dialog) {
                this.dialogEvtId = this.dialog.addEventHandler('click', function(e) {
                    e.stopPropagation();
                });
            }
            this.dialogBox = modelInfoDialog;
            modelInfoDialog.show();
        }
    });
});
