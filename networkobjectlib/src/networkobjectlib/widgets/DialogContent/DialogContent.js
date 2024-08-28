define([
    'widgets/WidgetCore',
    './DialogContentView'
], function(WidgetCore, View) {
    'use strict';
    return WidgetCore.extend({
        view: function() {
            return new View(this.options);
        }
    });
});
