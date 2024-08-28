define([
    'jscore/core',
    './LabelWidgetView'
], function(core, View) {

    return core.Widget.extend({

        init: function(options) {
            this.options = options;
        },

        view: function() {
            return new View(this.options);
        },
    });
});
