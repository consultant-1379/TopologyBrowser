define([
    'jscore/core',
    './NullButtonWidgetView',
    'widgets/Button'
], function(core, View, Button) {

    return core.Widget.extend({

        View: View,

        init: function(options) {
            if (options && typeof options.onClick === 'function') {
                this.onClick = options.onClick;
            }
        },

        onViewReady: function() {
            var button = new Button({
                caption: 'Set to NULL',
                type: 'button'
            });

            button.addEventHandler('click', function() {
                this.onClick();
            }.bind(this));

            button.attachTo(this.view.getElement());
        }
    });
});



