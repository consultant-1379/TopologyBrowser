define([
    'widgets/Dialog',
    'i18n!topologybrowser/app.json'
], function(Dialog, i18n) {
    return {
        getCurrentUser: function() {
            try {
                return document.querySelector('.eaUserProfileMenu-button').innerText;
            } catch (error) { // When the application works outside of ENM (at MockServer)
                return 'testUser' + Date.now();
            }
        },

        showDialog: function(type, header, content) {
            if (this.dialog) {
                this.dialog.detach();
                this.dialog.destroy();
            }
            this.dialog = new Dialog({
                header: header,
                content: content,
                buttons: [{
                    caption: i18n.get('ok'),
                    action: function() {
                        this.dialog.hide();
                        this.dialog.destroy();
                    }.bind(this)
                }],
                type: type
            });
            this.dialog.show();
        },
    };
});
