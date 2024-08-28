define([
    'jscore/core',
    './LoadingAnimationWidgetView'
], function(core, View) {
    return core.Widget.extend({

        View: View,

        init: function() {
        },

        onViewReady: function() {},

        showNonPersistentLoadingAnimation: function() {
            this.view.showLoadingAnimation();
        }


    });

});



