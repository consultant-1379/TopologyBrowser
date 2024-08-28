define([
    'jscore/core',
    './ComplexRefWidgetView',
    '../FormContainerWidget/FormContainerWidget',
    '../AbstractWidget/AbstractWidget',
    'widgets/Accordion'
], function(core, View, FormContainer, AbstractWidget, Accordion) {
    return AbstractWidget.extend({

        valuesToBeSaved: [],
        invalidValues: [],

        init: function(options) {
            this.validateOnStart = options.validateOnStart;
            //Value may or may not have been merged with attributes.
            if (options.value && Array.isArray(this.options.complexRef.attributes)) {
                this.options.complexRef.attributes.forEach(function(attribute) {
                    if (attribute.value === undefined) {
                        //Find the corresponding value;
                        var value = options.value.filter(function(options) {
                            return options.key === attribute.key;
                        });
                        if (value.length > 0) {
                            attribute.value = value[0].value;
                        }
                    }
                });
            }
            this.options.complexRef.attributes.forEach(function(e) {
                e.complexConstructor = this.options.complexConstructor;
                e.listConstructor = this.options.listConstructor;
            }.bind(this));
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            this.accordion = this.createAccordion();
            this.accordion.attachTo(this.view.getAccordionContainer());
            this.baseKeyValue = this.options.key;
            this.setKeyValue(this.options.key);
            //only display modelInfoButton for ComplexRefs with descriptions
            if (this.options.description !== null) {
                this.createModelInfoButton();
            }
        },

        sortItemsByKey: function(dataToSort) {
            dataToSort.sort(function(a, b) {
                if (a.key.toLowerCase() > b.key.toLowerCase())
                    { return 1; }
                if (a.key.toLowerCase() < b.key.toLowerCase())
                    { return -1; }
                return 0;
            });
        },

        addEventHandler: function(eventName, eventHandler) {
            if (this.accordion) {
                this.accordion.addEventHandler(eventName, eventHandler);
            }
        },

        createAccordion: function() {
            if (this.options.complexRef.attributes instanceof Array && this.options.complexRef.attributes.length>0 && this.options.complexRef.attributes[0].hasOwnProperty('key')) {
                this.sortItemsByKey(this.options.complexRef.attributes);
            }

            this.options.complexRef.attributes.forEach(function(element) {
                if (this.options.innerOnChangeCallback !== undefined && this.options.innerOnInvalidCallback !== undefined) {
                    element.onChangeCallback = this.options.innerOnChangeCallback.bind(this);
                    element.onInvalidCallback  = this.options.innerOnInvalidCallback.bind(this);
                    element.innerOnChangeCallback = this.options.innerOnChangeCallback;
                    element.innerOnInvalidCallback = this.options.innerOnInvalidCallback;
                }

            }.bind(this));

            var formContainer = new FormContainer(this.options.complexRef.attributes, this.options.widgetsProducer, this.validateOnStart);

            return new Accordion({
                title: this.options.key,
                expanded: this.options.expanded,
                content: formContainer
            });
        },

        handleChangedValue: function() {
            var originalValues = this.options.complexRef.attributes.map(function(e) {
                return {
                    key: e.key,
                    value: e.value,
                    datatype: e.type,
                    sensitive: e.sensitive
                };
            });

            var persistenceObject = this.options.complexRef.attributes.map(function(element) {

                var newValue = this.valuesToBeSaved? this.valuesToBeSaved.filter(function(innerElement) {
                    return innerElement.key === element.key;
                }): null;

                return {
                    key: element.key,
                    value: (Array.isArray(newValue) && newValue.length > 0) ? newValue[0].value : element.value,
                    datatype: element.type,
                    sensitive: element.sensitive
                };
            }.bind(this));

            //Original Value

            //compare new to original
            var equal =  persistenceObject.reduce(function(prev ,current, index) {
                var orig = originalValues[index];
                return prev && current.key === orig.key && current.value === orig.value;
            }, true);

            if (equal && this.invalidValues.length === 0) {
                //this.view.getOuterWrapper().removeModifier("valid");

                //Add to Collection
                this.options.onChangeCallback.apply(this, [{
                    'key': this.options.key,
                    'value': persistenceObject,
                    'datatype': this.options.type,
                    'sensitive': this.options.sensitive
                }]);
            }
            //Invalids Exist
            else if (this.invalidValues.length >0) {
                //this.view.getOuterWrapper().removeModifier("valid");
                //Add to Invalids
                this.options.onInvalidCallback({
                    'key': this.options.key,
                    'value': persistenceObject,
                    'datatype': this.options.type,
                    'sensitive': this.options.sensitive
                });
            }
            //All valid
            else {
                //this.view.getOuterWrapper().setModifier("valid");

                this.options.onChangeCallback({
                    'key': this.options.key,
                    'value': persistenceObject,
                    'datatype': this.options.type,
                    'sensitive': this.options.sensitive
                });

            }
        },

        setIndex: function(index) {
            this.setKeyValue(this.baseKeyValue + index);
            this.updateDisplayWIthKeyValue(index);
        },

        updateDisplayWIthKeyValue: function(text) {
            this.accordion.setTitle(this.baseKeyValue + ' ('+ text+')');
        },

        setKeyValue: function(keyValue) {
            this.keyValue = keyValue;
        },

        getKeyValue: function() {
            return this.keyValue;
        }
    });

});



