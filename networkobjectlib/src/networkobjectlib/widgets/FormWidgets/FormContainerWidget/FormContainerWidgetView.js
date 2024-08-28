define([
    'jscore/core',
    'template!./FormContainerWidget.html'
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
