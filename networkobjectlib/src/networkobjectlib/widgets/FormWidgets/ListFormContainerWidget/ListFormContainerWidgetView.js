define([
    'jscore/core',
    'template!./ListFormContainerWidget.html'
], function(core, template) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getFormContainer: function() {
            return this.getElement();
        }
    });

});
