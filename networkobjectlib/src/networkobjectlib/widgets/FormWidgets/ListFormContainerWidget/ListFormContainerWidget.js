/**
 * This is just a collection/list of FormContainers
 */
define([
    'jscore/core',
    './ListFormContainerWidgetView' ,
    '../FormContainerWidget/FormContainerWidget',
    'widgets/Accordion',
    'i18n!networkobjectlib/dictionary.json'
], function(core, View, FormContainer, Accordion,i18n) {
    return core.Widget.extend({

        View: View,

        init: function(options) {
            this.options = options;
        },

        onViewReady: function() {
            this.buildContainer();
        },

        addEventHandler: function(eventName, eventHandler) {
            if (this.accordion) {
                this.accordion.addEventHandler(eventName, eventHandler);
            }
        },

        buildContainer: function() {
            var attributeType = this.options.attributeType;
            this.options.values.forEach(function(element, index) {

                var elementContainer;
                //Figure out its type
                if (element instanceof Array) {
                    var content = i18n.noAttributes;
                    if (element.length > 0  && element[0].key !== undefined) {
                        //Complex
                        content = new FormContainer(element, this.options.widgetsProducer);
                    }

                    this.accordion = new Accordion({
                        title: attributeType + ' (' + index + ')',
                        expanded: this.options.expanded,
                        content: content
                    });
                    this.accordion.attachTo(this.view.getFormContainer());
                }

                //Else we just draw the type of reference and key is the index
                else {
                    //Complex
                    element.key = element.index+'';
                    elementContainer = new FormContainer([element], this.options.widgetsProducer);
                    elementContainer.attachTo(this.view.getFormContainer());
                }


            }.bind(this));
        }
    });
});



