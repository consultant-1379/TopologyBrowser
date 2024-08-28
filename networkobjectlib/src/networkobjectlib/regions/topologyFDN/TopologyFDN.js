/* global define */
define([
    'jscore/core',
    'widgets/Dialog',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/utils/customError',
    '../../widgets/fdnPath/FDNPath',
    '../../regions/topologyTree/Rest',
    'networkobjectlib/utils/Constants'
], function(core, Dialog, i18n, customError, FDNPath, Rest, Constants) {

    return core.Region.extend({
        init: function() {
            this.pathWidget = new FDNPath();
        },

        onStart: function() {
            this.pathWidget.attachTo(this.getElement());
            this.pathWidget.addEventHandler('FDNTokenClicked', onFDNChange, this);
            this.getEventBus().subscribe('updateFDNPath', this.updateFDN, this);
            this.getEventBus().subscribe('clearFDNInput', this.clearFDNInput, this);
        },

        // checks the FDN input and makes call if necessary
        updateFDN: function() {
            this.pathWidget.callFDN();
        },

        clearFDNInput: function() {
            this.pathWidget.clearFDN();
        }
    });

    function onFDNChange(token) {
        var error = new customError.NetworkObjectNotFound();
        var errorTBAC = new customError.TBACPermissionDenied();

        // can't have '?' or '#' or ';'
        if (token.fdn.indexOf('?') > -1 || token.fdn.indexOf('#') > -1 || token.fdn.indexOf(';') > -1) {
            showErrorDialog(error.title, error.body);
            return;
        }

        // clear the tree selection when fdn is empty
        if (token.fdn.trim() === '') {
            this.getEventBus().publish('topologyTree:select', []);
            return;
        }

        this.getEventBus().publish('topologyTree:loader:show');
        Rest.getByFdn(token.fdn)
            .then(function(response) {
                this.getEventBus().publish('topologyHeader:topologyDropdown:change', {
                    select: Constants.NETWORK_DATA,
                    poid: response.data.poId
                });
                this.getEventBus().publish('topologyTree:loader:hide');
            }.bind(this))
            .catch(function(response) {
                if (response.code === 10023) {
                    // Access denied message for TBAC
                    showErrorDialog(errorTBAC.title, errorTBAC.body);
                } else if (response.code === 10106) {
                    showErrorDialog(response.title, response.message);
                }
                else {
                    showErrorDialog(error.title, error.body);
                }
                this.getEventBus().publish('topologyTree:loader:hide');
            }.bind(this));
    }

    function showErrorDialog(header, body) {
        var dialog = createDialog('error', header, body);
        dialog.show();
    }

    function createDialog(type, header, content) {
        var modalDialog = new Dialog({
            header: header,
            content: content,
            buttons: [
                {
                    caption: i18n.buttons.ok,
                    action: function() {
                        modalDialog.destroy();
                    }
                }
            ],
            type: type
        });
        return modalDialog;
    }
});
