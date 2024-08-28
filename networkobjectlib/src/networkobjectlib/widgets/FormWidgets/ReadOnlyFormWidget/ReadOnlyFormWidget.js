define([
    'jscore/core',
    './ReadOnlyFormWidgetView',
    '../AbstractWidget/AbstractWidget'
], function(core, View, AbstractWidget) {
    return AbstractWidget.extend({

        view: function() {
            this.options.inputTitle = this.titleTextBuilder();
            return new View(this.options);
        },

        titleTextBuilder: function() {
            return 'Type: '  + this.options.type +
                (this.options.hasOwnProperty('defaultValue') && this.options.defaultValue !== null?', Default: ' + this.options.defaultValue: '') +
                ', ReadOnly: True';
        },

        onViewReady: function() {
            if (this.options.description !== undefined && this.options.description !== null) {
                this.createModelInfoButton();
            }
        }
    });

});



