define([
    'jscore/core',
    'template!./modelInfoDisplay.html',
    'styles!./modelInfoDisplay.less'
], function(core, template, styles) {

    return core.View.extend({
    
        getTemplate: function() {
            return template(this.options);
        },
        getStyle: function() {
            return styles;
        }

    });

});
