define([
    'jscore/core',
    './RefreshNotificationView',
    'i18n!networkobjectlib/dictionary.json',
    'container/api',
    '../../utils/Constants'
], function(core, View, i18n, Container, Constants) {
    'use strict';

    return core.Widget.extend({

        view: function() {
            return new View(this.data);
        },

        init: function() {
            this.autoDismiss = !this.options.autoDismiss ? this.options.autoDismiss : true;
            this.autoDismissDuration = this.options.autoDismissDuration ? this.options.autoDismissDuration : 10000;
            if (this.options.collectionName) {
                this.collectionName = this.options.collectionName.split(',');
                this.labelToUse = this.collectionName.length === 1 ?
                i18n.refreshNotification.singleCollectionLabel.replace('$1', '"' + this.collectionName + '"') :
                i18n.refreshNotification.multipleCollectionsLabel.replace('$1', '"' + this.collectionName.join('", "') + '"');
                this.data = {
                    label: this.labelToUse,
                    link: i18n.refreshNotification.link
                };
            }
        },

        onViewReady: function() {
            this.view.getCloseButton().addEventHandler('click', this.onDismiss, this);
            this.view.getLabelLink().addEventHandler('click', this.onRefresh, this);
            if (this.autoDismiss === true) {
                this.onAutoDismiss(this.autoDismissDuration);
            }
        },

        onAutoDismiss: function(timeout) {
            setTimeout(function() {
                this.onDismiss();
            }.bind(this), timeout);
        },

        onDismiss: function() {
            this.view.setOnCloseTransition();
            setTimeout(function() {
                this.detach();
                this.destroy();
            }.bind(this), 600);
        },

        onRefresh: function() {
            Container.getEventBus().publish(Constants.CustomEvent.REFRESH);
            this.onDismiss();
        }
    });
});
