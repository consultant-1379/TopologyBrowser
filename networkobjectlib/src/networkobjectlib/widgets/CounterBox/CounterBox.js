define([
    'jscore/core',
    'jscore/ext/mvp',
    'jscore/ext/net',
    './CounterBoxView'
], function(core, mvp, net, View) {

    return core.Widget.extend({

        init: function(options) {
            this.options = options;
        },

        view: function() {
            return new View(this.options);
        },

        updateCounter: function(value) {
            this.view.setValue(value);
        }
    });
});
