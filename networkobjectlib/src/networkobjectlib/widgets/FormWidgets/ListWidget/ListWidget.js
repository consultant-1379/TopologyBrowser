define([
    'jscore/core',
    './ListWidgetView',
    '../ListWidgetContainer/ListWidgetContainer',
    '../AbstractWidget/AbstractWidget',
    'widgets/Accordion'
], function(core, View, ListWidgetContainer, AbstractWidget, Accordion) {
    return AbstractWidget.extend({

        valuesToBeSaved: [],
        invalidValues: [],

        init: function(element) {
            this.element = element;
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            this.accordion = this.createAccordion();
            this.accordion.attachTo(this.view.getAccordionContainer());
            this.createModelInfoButton();
        },

        addEventHandler: function(eventName, eventHandler) {
            if (this.accordion) {
                this.accordion.addEventHandler(eventName, eventHandler);
            }
        },

        createAccordion: function() {
            var formContainer = new ListWidgetContainer(this.options, this.element.validateOnStart);

            return  new Accordion({
                title: this.options.key,
                expanded: this.options.expanded,
                content: formContainer
            });
        }
    });
});



