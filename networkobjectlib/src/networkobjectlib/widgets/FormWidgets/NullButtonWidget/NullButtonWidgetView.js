define([
    'jscore/core',
    'text!./NullButtonWidget.html',
    'text!./NullButtonWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },
    });

});
