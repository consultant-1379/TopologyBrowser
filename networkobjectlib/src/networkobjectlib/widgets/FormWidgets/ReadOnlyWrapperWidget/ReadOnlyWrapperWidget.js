define([
    'jscore/core',
    './ReadOnlyWrapperWidgetView',
    '../AbstractWidget/AbstractWidget'
], function(core, View, AbstractWidget) {
    return AbstractWidget.extend({

        init: function(options, accordion) {
            this.options = options;
            this.accordion = accordion;
        },
        view: function() {
            return new View(this.options);
        },
        addEventHandler: function(eventName, eventHandler) {
            if (this.accordion) {
                this.accordion.addEventHandler(eventName, eventHandler);
            }
        },
        onViewReady: function() {
            this.accordion.attachTo(this.view.getAccordionContainer());
            if (this.options.description !== undefined && this.options.description !== null) {
                this.createModelInfoButton();
            }
        }

    });

});



