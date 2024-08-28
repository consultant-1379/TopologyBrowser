define([
    'jscore/core',
    'template!./refreshNotification.html',
    'styles!./refreshNotification.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template((this.options));
        },

        getStyle: function() {
            return style;
        },

        getLabelLink: function() {
            return this.getElement().find('.elNetworkObjectLib-wRefreshNotification-container-content-label-link');
        },

        getCloseButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wRefreshNotification-container-content-close');
        },

        setOnCloseTransition: function() {
            this.getElement('elNetworkObjectLib-wRefreshNotification').setStyle('transition', 'opacity .6s linear');
            this.getElement('elNetworkObjectLib-wRefreshNotification').setStyle('opacity', 0);
        }
    });
});
