define([
    'jscore/core',
    './YANGChoiceWidgetView',
    '../YANGChoiceCasesWidget/YANGChoiceCasesWidget',
    '../../LabelWidget/LabelWidget',
    'widgets/Accordion'
], function(core, View, YANGChoiceCases, LabelWidget, Accordion) {
    return core.Widget.extend({

        init: function(options) {
            this.options = options;
        },

        view: function() {
            this.options.inputTitle = this.titleTextBuilder();
            return new View(this.options);
        },

        onViewReady: function() {
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);

            if (!this.options.readOnly) {
                this.view.getChoiceProperyListContainer().setModifier('hidden');

                var choiceCases = this.createChoiceCases();

                var accordion = this.createAccordion(choiceCases);
                accordion.attachTo(this.view.getAccordionContainer());
            }
            else {
                var producer = this.options.widgetsProducer;

                this.options.cases.filter(function(caseObject) {
                    return !caseObject.hasPrimaryType;
                }).forEach(function(caseObject) {
                    var caseLabel = new LabelWidget({
                        text: caseObject.name
                    });
                    caseLabel.view.getElement().setModifier('caseLabel');
                    caseLabel.attachTo(this.view.getChoiceProperyListContainer());

                    caseObject.attributes.forEach(function(attr) {
                        var widget = producer.createWidget(attr, {hideTitle: true});
                        widget.attachTo(this.view.getChoiceProperyListContainer());
                    }.bind(this));
                }.bind(this));
            }
        },

        titleTextBuilder: function() {
            return this.options.key;
        },

        createAccordion: function(content) {
            this.accordion =  new Accordion({
                title: this.options.key,
                description: 'CHOICE : ' + this.options.key,
                expanded: this.options.expanded,
                enabled: true,
                content: content
            });
            return this.accordion;
        },

        createChoiceCases: function() {
            return new YANGChoiceCases(this.options);
        },

        handleChangedValue: function(value) {
            if (value === this.options.value) {
                this.view.getOuterWrapper().removeModifier('valid');
            }
            else {
                this.view.getOuterWrapper().setModifier('valid');
            }

            //Add to Collection
            this.options.onChangeCallback({
                'key': this.getKeyValue(),
                'value': value,
                'datatype': this.options.type
            });
        },

        addEventHandler: function(eventName, eventHandler) {
            if (this.accordion) {
                this.accordion.addEventHandler(eventName, eventHandler);
            }
        },

        setIndex: function(index) {
            this.setKeyValue(this.baseKeyValue + index);
            this.updateDisplayWIthKeyValue(index);
        },

        updateDisplayWIthKeyValue: function(text) {
            this.view.getKeyValue().setText(text);
        },

        setKeyValue: function(keyValue) {
            this.keyValue = keyValue;
        },

        getKeyValue: function() {
            return this.keyValue;
        }
    });

});



