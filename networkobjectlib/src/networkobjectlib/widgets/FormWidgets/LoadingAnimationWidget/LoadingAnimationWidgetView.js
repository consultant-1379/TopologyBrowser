define([
    'jscore/core',
    'text!./LoadingAnimationWidget.html',
    'styles!./LoadingAnimationWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getLoadingAnimationHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodePropertyList-loaderHolder');
        },

        showLoadingAnimation: function() {
            return this.getLoadingAnimationHolder().removeModifier('hidden');
        },

        hideLoadingAnimation: function() {
            return this.getLoadingAnimationHolder().setModifier('hidden');
        }
    });

});
