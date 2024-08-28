/**
 * This widget acts as a form widget container that can be passed to an accordion
 */
define([
    'jscore/core',
    './FormContainerWidgetView',
    '../ReadOnlyFormWidget/ReadOnlyFormWidget',
    '../StringInputFormWidget/StringInputFormWidget',
    '../NumberInputFormWidget/NumberInputFormWidget',
    '../OnOffSwitch/OnOffSwitch',
    '../EnumDropdownWidget/EnumDropdownWidget'
], function(core, View) {
    return core.Widget.extend({

        View: View,

        init: function(options, widgetsProducer, validateOnStart) {
            this.options = options;
            this.widgetsProducer = widgetsProducer;
            this.validateOnStart = validateOnStart;
        },

        onViewReady: function() {
            this.buildContainer();
        },

        buildContainer: function() {
            this.options.forEach(function(element) {

                var widget = this.getSingleWidget(element);
                if (widget) {
                    widget.attachTo(this.view.getFormContainer());
                }
            }.bind(this));
        },

        //Utility Function
        getSingleWidget: function(element) {
            var widget;

            if (this.widgetsProducer) {
                element.widgetsProducer = this.widgetsProducer;
                element.type = element.type || element.datatype;
                element.validateOnStart = this.validateOnStart;

                //element.expanded = !!this.expansionList[element.key] && this.expansionList[element.key].status;
                widget = this.widgetsProducer.createWidget(element, this.options);
            }
            return widget;
        }

    });
});



