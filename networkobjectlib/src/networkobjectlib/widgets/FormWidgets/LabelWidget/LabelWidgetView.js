define([
    'jscore/core',
    'template!./LabelWidget.html',
    'text!./LabelWidget.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },
    });

});
