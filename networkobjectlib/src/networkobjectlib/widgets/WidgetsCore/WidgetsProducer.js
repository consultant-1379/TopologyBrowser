/**
 * Created by xfabtor on 19/02/2016.
 */
define([
    '../FormWidgets/ReadOnlyFormWidget/ReadOnlyFormWidget',
    '../FormWidgets/StringInputFormWidget/StringInputFormWidget',
    '../FormWidgets/NumberInputFormWidget/NumberInputFormWidget',
    '../FormWidgets/OnOffSwitch/OnOffSwitch',
    '../FormWidgets/EnumDropdownWidget/EnumDropdownWidget',
    '../FormWidgets/YANG/YANGChoiceWidget/YANGChoiceWidget',
    '../FormWidgets/YANG/YANGUnionWidget/YANGUnionWidget',
    '../FormWidgets/ComplexRefWidget/ComplexRefWidget',
    '../FormWidgets/ListWidget/ListWidget',
    '../FormWidgets/FormContainerWidget/FormContainerWidget',
    '../FormWidgets/ListFormContainerWidget/ListFormContainerWidget',
    '../FormWidgets/ReadOnlyWrapperWidget/ReadOnlyWrapperWidget',
    '../FormWidgets/BitsComboMultiSelectWidget/BitsComboMultiSelectWidget',
    'widgets/Accordion',
    'i18n/AdvancedDateTime'
],function(ReadOnly, StringInput, NumberInput, OnOff, EnumDropdown, Choice, Union, Complex,
           ListWidget, FormContainer, ListFormContainer, AccordionWrapper, BitsComboMultiSelectWidget, Accordion, advancedDateTime) {

    var drawTypeSTRING = function(element, disabled) {
        var stringInputWidget = new StringInput(element);
        if (disabled) {
            stringInputWidget.disable();
        }
        return stringInputWidget;
    };
    var drawTypeBOOLEAN = function(element) {
        //For Multi-Edit flow, BOOLEAN members are displayed as drop down with items TRUE and FALSE
        if (element.isMultiEdit) {
            return new EnumDropdown(element);
        } else {
            return new OnOff(element);
        }
    };

    var drawTypeINTEGER = function(element) {
        return new NumberInput(element);
    };

    var drawTypeBYTE = function(element) {
        return new NumberInput(element);
    };

    var drawTypeSHORT = function(element) {
        return new NumberInput(element);
    };

    var drawTypeLONG = function(element) {
        return new NumberInput(element);
    };

    var drawTypeBITS = function(element) {
        return new BitsComboMultiSelectWidget(element);
    };

    var drawTypeREADONLY = function(element, disabled, options) {
        if (element.type === 'COMPLEX_REF') {
            var mappedValues = element.complexRef.attributes.map(function(e) {
                return mapAllValuesToReadOnly(e, element.fromReadOnlyPanel);
            }.bind(this));

            var container = new FormContainer(mappedValues, element.widgetsProducer);
            if (element.fromReadOnlyPanel) {
                return new Accordion({
                    title: element.key,
                    expanded: element.expanded,
                    content: container
                });
            }
            else {
                return new AccordionWrapper(element, new Accordion({
                    title: element.key,
                    expanded: element.expanded,
                    content: container
                }));
            }
        }
        else if ((element.type === 'LIST') && !(isListEmpty(element))) {
            //Assuming e.value is array, could be of primitive or complex, or list?

            if (element.value !==null) {
                fixReadonlyListOfAny(element);
                var mappedValuesList = element.value.map(function(f, index) {
                    return mapAllValuesToReadOnly(f, element.fromReadOnlyPanel, index);
                }.bind(this));

                var containerList = new ListFormContainer({
                    values: mappedValuesList,
                    attributeType: element.key,
                    widgetsProducer: element.widgetsProducer
                });
                if (element.fromReadOnlyPanel) {
                    return  new Accordion({
                        title: element.key,
                        expanded: element.expanded,
                        content: containerList
                    });
                }
                else {
                    return new AccordionWrapper(element, new Accordion({
                        title: element.key,
                        expanded: element.expanded,
                        content: containerList
                    }));
                }
            }

        }
        else if (element.type === 'CHOICE') {
            var content = drawTypeCHOICE(element, true, options);

            return new Accordion({
                title: element.key,
                expanded: element.expanded,
                content: content
            });
        }
        else {
            if (options.hideTitle) {
                element.description = null;
            }
            return new ReadOnly(element);
        }

    };

    var drawTypeENUM_REF = function(element) {
        return new EnumDropdown(element);
    };

    var drawTypeUNION = function(element) {
        return new Union(element);
    };

    var drawTypeCHOICE = function(element, disabled, options) {
        if (disabled) {
            element = mapAllValuesToReadOnly(element, element.fromReadOnlyPanel);
            element.expanded = !!options.expanded;
            element.readOnly = true;
            element.dataType = element.type;
        }

        return new Choice(element);
    };

    var drawTypeCOMPLEX_REF = function(element) {
        //We need to create Complex widgets for any nested complex types

        //Pass the constructors
        element.complexConstructor = Complex;
        element.listConstructor = ListWidget;

        createNestedComplex(element);
        var complexRefWidget = new Complex(element);
        return complexRefWidget;
    };

    var drawTypeLIST = function(element) {
        if (element.listReference && element.listReference.type === 'COMPLEX_REF') {
            element.complexConstructor = Complex;
        }
        else if (element.listReference && element.listReference.type === 'LIST') {
            element.listConstructor = ListWidget;
        }
        return new ListWidget(element);
    };

    var drawFncCollector = {
        drawTypeSTRING: drawTypeSTRING,
        drawTypeBOOLEAN: drawTypeBOOLEAN,
        drawTypeINTEGER: drawTypeINTEGER,
        drawTypeBYTE: drawTypeBYTE,
        drawTypeSHORT: drawTypeSHORT,
        drawTypeLONG: drawTypeLONG,
        drawTypeREADONLY: drawTypeREADONLY,
        drawTypeENUM_REF: drawTypeENUM_REF,
        drawTypeCHOICE: drawTypeCHOICE,
        drawTypeUNION: drawTypeUNION,
        drawTypeCOMPLEX_REF: drawTypeCOMPLEX_REF,
        drawTypeLIST: drawTypeLIST,
        drawTypeBITS: drawTypeBITS

    };

    /*
     * @desc should only set readonly = true
     * but its also manipulating objects
     */
    var mapAllValuesToReadOnly = function(e, fromReadOnlyPanel, index) {
        var returnObject = null;
        if (e === null) {
            return {
                index: index,
                value: e,
                readOnly: true,
                datatype: undefined
            };
        }
        else if (e.type === 'COMPLEX_REF') {
            returnObject = {
                complexRef: {
                    attributes: e.complexRef.attributes.map(function(e) {
                        return mapAllValuesToReadOnly(e, fromReadOnlyPanel);
                    }.bind(this))
                },
                key: e.key,
                type: e.type,
                datatype: e.type,

            };

            return returnObject;
        }
        else if (e.type === 'CHOICE') {
            returnObject = JSON.parse(JSON.stringify(e));
            returnObject.widgetsProducer= e.widgetsProducer;
            returnObject.cases.forEach(function(case1) {
                case1.attributes = case1.attributes.map(function(attribute) {
                    attribute.readOnly=true;
                    return attribute;
                }.bind(this));
            }.bind(this));
            return returnObject;
        }
        //Could be array of anything
        else if (e instanceof Array) {
            return e.map(function(f, arrayIndex) {
                return mapAllValuesToReadOnly(f, fromReadOnlyPanel, arrayIndex);
            }.bind(this));
        }
        //Normal Value, eg complex sub-attribute
        else if (e.key !== undefined) {
            return {
                key: e.key,
                value: e.value,
                description: !fromReadOnlyPanel ? (e.description?e.description: e.key) : undefined,
                readOnly: true,
                datatype: e.datatype?e.datatype: e.type
            };
        }
        //Last case primitive array value
        else {
            return {
                index: index,
                value: e,
                description: !fromReadOnlyPanel ? (e.description?e.description: e.key) : undefined,
                readOnly: true,
                expanded: e.expanded,
                datatype: undefined
            };
        }
    };

    var createNestedComplex = function(innerElement) {
        if (innerElement.complexRef !== undefined) {
            innerElement.complexRef.attributes.forEach(function(e) {
                if (e.type ==='COMPLEX_REF') {
                    e.innerOnChangeCallback = innerElement.attributeValueChangedCallback;
                    e.innerOnInvalidCallback = innerElement.invalidAttributeValueChangedCallback;
                    createNestedComplex(e);
                }
            }.bind(this));
        }
    };

    var isListEmpty = function(element) {
        return (element.value ===null || !(element.value instanceof Array) || element.value.length === 0);
    };
    var fixReadonlyListOfAny = function(element) {
        if (typeof element.listReference !== 'undefined' && typeof element.listReference.complexRef !== 'undefined' && typeof element.listReference.complexRef.attributes !== 'undefined' &&  typeof element.listReference.complexRef.attributes.filter === 'function' && typeof element.value.forEach === 'function') {
            element.value.forEach(function(values) {
                values.forEach(function(value) {
                    if (!value.description) {
                        var fieldMeta = element.listReference.complexRef.attributes.filter(function(metaField) { return metaField.key === value.key; })[0];
                        if (fieldMeta) {
                            value.description=fieldMeta.description;
                        }
                    }
                });
            });
        }
    };

    /**
     * WidgetProducer creates widgets for different types of attributes.
     * @class networkobjectlib/WidgetsProducer
     */
    return function() {
        var self = {
            mapOptionToReadOnly: mapAllValuesToReadOnly,

            /**
             * Method to create widget based on Attribute type.
             *
             * @method createWidget
             * @param element
             * @param options
             * @returns {Widget}
             */
            createWidget: function(element, options) {
                var drawFn = drawFncCollector['drawType'+(element.type?element.type.toUpperCase():'STRING')];
                var widget = null;
                if (element.type === 'TIMESTAMP') {
                    var date = new Date(element.value);
                    element.formattedTimestamp = advancedDateTime(date).format('DTS');
                }

                if (element.readOnly) {
                    widget = drawTypeREADONLY(element, false, options);
                }
                else if (typeof(drawFn) === 'function') {
                    widget = drawFn(element, false, options);
                }
                else if ((element.type === 'IP_ADDRESS')||(element.type === 'MO_REF') ||(element.type === 'PT_REF')) {
                    widget = drawTypeSTRING(element, false);
                }
                else {
                    widget = drawTypeSTRING(element, true);
                }
                if ((element.readOnly || typeof(drawFn) === 'function') &&(element.type==='COMPLEX_REF' || element.type==='LIST' || element.type==='CHOICE')) {
                    if (typeof options.onCollapseEventHandler === 'function') {
                        widget.addEventHandler('collapse', function() {
                            options.onCollapseEventHandler(element.key);
                        });
                    }
                    if (typeof options.onExpandEventHandler === 'function') {
                        widget.addEventHandler('expand', function() {
                            options.onExpandEventHandler(element.key);
                        });
                    }
                }
                return widget;
            },

            /**
             * Method to attach widget to container.
             *
             * @method attachWidget
             * @param element
             * @param options
             * @param nodeElementsList
             * @param nodeContainer
             * @param forceInsertInList
             */

            attachWidget: function(element, options, nodeElementsList, nodeContainer, forceInsertInList) {
                if (!!nodeElementsList && !!nodeContainer) {
                    var widget = this.createWidget(element, options);
                    if (!!forceInsertInList || (!element.readOnly || (element.type!=='COMPLEX_REF' && element.type!=='LIST' && element.type!=='CHOICE'))) {
                        nodeElementsList.push(widget);
                    }

                    widget.attachTo(nodeContainer);
                }
            }
        };
        return self;
    };
});
