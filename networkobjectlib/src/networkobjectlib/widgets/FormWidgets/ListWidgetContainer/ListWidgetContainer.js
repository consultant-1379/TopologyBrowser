/*
Takes Element
For each value create the corresponding element
 */

define([
    'jscore/core',
    './ListWidgetContainerView',
    '../ListWidgetElement/ListWidgetElement',
    '../FormContainerWidget/FormContainerWidget',
    '../../../utils/Validator',
    'i18n!networkobjectlib/dictionary.json',
    '../AbstractWidget/AbstractWidget',
    '../../../ext/constants',
    '../YANG/YANGUnionWidget/YANGUnionWidget'
], function(core, View, ListWidgetElement, FormContainer, Validator, i18n, AbstractWidget, Constants, Union) {

    return AbstractWidget.extend({

        View: View,

        widgetList: [],

        arrayOfListValues: null,


        //TODO Assuming that List can only have min and max and not a range of min max?
        minSize: 0,
        maxSize: null,

        init: function(options) {
            this.options = options;
            this.widgetList = [];
            this.arrayOfListValues = [];
            this.valid = true;

            //TODO Handle Other Constraints: Order, Uniqueness etc!
            var valueRangeConstraints = this.options.constraints.valueRangeConstraints;
            // Need to check valueRangeConstraint as it could be null
            if (valueRangeConstraints) {
                this.minSize = valueRangeConstraints[0].minValue;
                this.maxSize = valueRangeConstraints[0].maxValue;
            }
        },

        onViewReady: function() {

            //Create List Of All Existing Widgets
            this.createWidgetList();

            this.view.getPlusButton().addEventHandler('click', function() {
                if (this.getPlusValue()) {
                    this.plusAction();
                }
            }.bind(this));
        },

        createWidgetList: function() {

            if (this.options.value !== undefined && this.options.value !==null) {
                this.options.value.forEach(function(value, index) {
                    this.arrayOfListValues.push(value);

                    //TODO FIX THIS Cloning
                    var typeOfElementToCreate = JSON.parse(JSON.stringify(this.options.listReference));

                    var attributeWidget = this.createListElement(value, typeOfElementToCreate, index);

                    this.widgetList.push(attributeWidget);
                    attributeWidget.attachTo(this.view.getContainer());
                }.bind(this));

                this.updateWidgets();

                //Might be necessary to disable the add entry button
                if (!this.getPlusValue()) {
                    this.view.getPlusButton().setModifier('disabled');
                }
            }
        },

        createListElement: function(value, elementToCreate, index, isPlusAction) {

            //This is a base key the actual key value will depend on Index In Array
            elementToCreate.key = this.options.key;

            elementToCreate.value = value;
            elementToCreate.moType = this.options.moType;
            elementToCreate.description = this.options.description;
            elementToCreate.complexConstructor = this.options.complexConstructor;
            elementToCreate.listConstructor = this.options.listConstructor;
            elementToCreate.expanded= this.options.expanded;

            var elementContainer = new ListWidgetElement({
                //TODO
                minusEnabled: true,//this.getMinusValue(),
                minusAction: this.minusAction.bind(this)
            });

            //Add namespace and namespaceVersion for model info button where list contents are of type struct.
            if (elementToCreate.type === Constants.COMPLEX_REF) {
                var arrayOfComplex = elementToCreate.complexRef.attributes;
                arrayOfComplex.forEach(function(complexType) {
                    complexType.namespace = this.options.namespace;
                    complexType.namespaceVersion = this.options.namespaceVersion;
                }.bind(this));
            }

            //Bind access to elementContainer.getIndex before setting widget
            elementToCreate.onChangeCallback = this.onValueChange.bind(this, elementContainer);
            elementToCreate.onInvalidCallback = this.onInvalidValueChange.bind(this, elementContainer);

            //These are needed so we can call by referenece
            var valueSetter = function(newValue) {
                value = newValue;
            };

            var valueGetter = function() {
                return value;
            };

            //Index Value can change and Binding shadows reference
            elementToCreate.innerOnChangeCallback = this.innerOnValid.bind(this, valueSetter, valueGetter, elementContainer);
            elementToCreate.innerOnInvalidCallback = this.innerOnInvalid.bind(this, valueSetter, valueGetter, elementContainer);

            var formContainer = new FormContainer([], this.options.widgetsProducer, this.options.validateOnStart);

            // we overwrite enums inside lists to be not null
            if (elementToCreate.type === 'ENUM_REF') {
                if (!elementToCreate.constraints) {
                    elementToCreate.constraints = {};
                }
                elementToCreate.constraints.nullable = false;
            }

            // set as newItem so widget can add purple bar
            if (isPlusAction === true) {
                elementToCreate.newItem = true;
            }

           /*
            * Multi-Edit flag is added to individual element object to draw widget as per
            * proposed UX, based on the data type.
            */
            if (this.options.isMultiEdit && !isPlusAction) {
                elementToCreate.isMultiEdit = true;
            }
            var widget;

            if (elementToCreate.type === 'UNION') {
                widget = new Union(elementToCreate);
            } else {
                widget = formContainer.getSingleWidget(elementToCreate);
            }

            elementContainer.setWidget(widget);
            elementContainer.setIndex(index);
            return elementContainer;
        },

        //Needs to be partiallly applied
        onValueChange: function(container, value) {
            var index = container.getIndex();
            if (index !== null) {
                this.arrayOfListValues[index] = value.value;
            }
            if (this.options.constraints && this.options.constraints.uniqueMembers === true) {
                this.validateUniqueMembersAndUpdateWidgets(value);
            }
            if (this.valid) {
                this.options.onChangeCallback({
                    key: this.options.key,
                    value: this.arrayOfListValues,
                    datatype: this.options.type
                });
            }

        },

        validateUniqueMembersAndUpdateWidgets: function(value) {
            var constraintsToValidate = {
                checkUniqueMembers: true,
            };
            this.isRepeated = Validator.validate(value, constraintsToValidate, this.arrayOfListValues);
            if (this.isRepeated.length > 0) {
                for (var index in this.arrayOfListValues) {
                    if (index !== null) {
                        this.addOrRemoveErrorForEachWidgetInList(index, this.isRepeated);
                    }
                }
                this.doInvalid(this.options.key, this.options.value, this.options.type);
            // If nothing is repeated and the list was previously invalid remove all errors.
            } else if (this.valid === false) {
                this.setValid(true);
                for (var member in this.arrayOfListValues) {
                    this.removeErrorMessageFromWidget(member);
                }
            }
        },

        addOrRemoveErrorForEachWidgetInList: function(index, isRepeated) {
            var valueToCompare = this.arrayOfListValues[index];
            if (this.arrayOfListValues[index].value) {
                valueToCompare = this.arrayOfListValues[index].value;
            }
            // If the current attribute value is listed as repeating show error, else remove error.
            if (isRepeated.indexOf(valueToCompare) !== -1) {
                this.addErrorMessageToWidget(index);
            } else {
                this.removeErrorMessageFromWidget(index, valueToCompare);
            }
        },

        removeErrorMessageFromWidget: function(indexOfWidget) {
            this.widgetList[indexOfWidget].attributeWidget.hideError();
        },

        addErrorMessageToWidget: function(indexOfWidget, valueToCompare) {
            this.widgetList[indexOfWidget].attributeWidget.doInvalid(this.options.key,valueToCompare,this.options.type, i18n.inlineValidation.listMembersMustBeUnique);
        },

        doInvalid: function(key, value, type) {
            //Add to Invalids
            this.setValid(false);
            this.options.onInvalidCallback({
                key: key,
                value: value,
                datatype: type
            });
        },

        onInvalidValueChange: function(container, value) {
            var index = container.getIndex();
            if (index) {
                this.arrayOfListValues[index] = value;
            }
            this.options.onInvalidCallback({
                key: this.options.key,
                value: this.arrayOfListValues
            });

        },

        innerOnValid: function(valueSetter, valueGetter,container, value) {
            var newValue = valueGetter().map(function(e) {
                if (e.key===value.key) {
                    return value;
                }
                else {
                    return e;
                }
            });

            var inArray = newValue.some(function(e) {
                return e.key === value.key;
            });

            if (!inArray) {
                newValue.push(value);
            }

            valueSetter(newValue);

            this.onValueChange(container,{value: valueGetter()});

        },

        innerOnInvalid: function(valueSetter, valueGetter, container, value) {
            var newValue = valueGetter().map(function(e) {
                if (e.key===value.key) {
                    return value;
                }
                else {
                    return e;
                }
            });

            var inArray = newValue.some(function(e) {
                return e.key === value.key;
            });

            if (!inArray) {
                newValue.push(value);
            }

            valueSetter(newValue);

            this.onInvalidValueChange(container,{value: valueGetter()});
        },

        plusAction: function() {

            var newIndex = this.arrayOfListValues.length;

            //TODO FIX THIS Cloning
            var typeOfElementToCreate = JSON.parse(JSON.stringify(this.options.listReference));

            var defaultValue = this.createSensibleDefaultValue(newIndex, typeOfElementToCreate);
            this.arrayOfListValues.push(defaultValue);

            var newElement = this.createListElement(defaultValue, typeOfElementToCreate, newIndex, true);

            this.widgetList.push(newElement);

            newElement.attachTo(this.view.getContainer());

            this.updateWidgets();

            if (!this.getPlusValue()) {
                this.view.getPlusButton().setModifier('disabled');
            }

            //Force Callback, ie values changed
            this.onValueChange(newElement,{value: defaultValue});
        },

        createSensibleDefaultValue: function(index, listReference) {

            if (this.options.defaultValue) {
                if (this.options.defaultValue[index]) {
                    return this.options.defaultValue[index];
                }
                else {
                    return this.options.defaultValue[0];
                }
            }
            else {
                switch (listReference.type) {
                case 'COMPLEX_REF':
                    return listReference.complexRef.attributes.map(function(e) {
                        return {
                            key: e.key,
                            value: e.defaultValue,
                            datatype: e.type
                        };
                    }.bind(this));
                case 'LIST':
                    return [];
                case 'ENUM':
                    return listReference.enumeration.enumMembers[0].key;
                case 'ENUM_REF':
                    return listReference.enumeration.enumMembers[0].value;
                case 'BOOLEAN':
                    return false;
                case 'STRING':
                    return '';
                default :
                    return 0;
                }
            }
        },

        minusAction: function(index) {

            //Splice Out element at index
            var elementToDestroy = this.widgetList.splice(index,1);
            this.arrayOfListValues.splice(index, 1);
            elementToDestroy[0].destroy();

            this.updateWidgets();

            if (this.getPlusValue()) {
                this.view.getPlusButton().removeModifier('disabled');
            }

            if (this.options.constraints && this.options.constraints.uniqueMembers === true) {
                this.validateUniqueMembersAndUpdateWidgets('');
            }

            if (this.valid) {
                this.options.onChangeCallback({
                    key: this.options.key,
                    value: this.arrayOfListValues,
                    datatype: this.options.type
                });
            }
        },

        updateWidgets: function() {
            this.widgetList.forEach(function(e, i) {
                e.update(i, this.getMinusValue());
            }.bind(this));
        },

        //If there are more than one attributes widget containers
        getMinusValue: function() {
            return this.widgetList.length > this.minSize;
        },

        //Plus is disabled in case you already have an empty widget
        //Or if the attribute list has two items
        getPlusValue: function() {
            return this.maxSize?(this.widgetList.length < this.maxSize): true;
        }
    });
});
