define([
    'jscore/core',
    '../FormList/FormList',
    './NonPersistentAttrFormView',
    '../FormWidgets/ReadOnlyFormWidget/ReadOnlyFormWidget',
    '../FormWidgets/StringInputFormWidget/StringInputFormWidget',
    '../FormWidgets/NumberInputFormWidget/NumberInputFormWidget',
    '../FormWidgets/OnOffSwitch/OnOffSwitch',
    '../FormWidgets/EnumDropdownWidget/EnumDropdownWidget',
    '../FormWidgets/ComplexRefWidget/ComplexRefWidget',
    '../FormWidgets/ListWidget/ListWidget',
    '../FormWidgets/FormContainerWidget/FormContainerWidget',
    'widgets/Dialog',
    'widgets/Accordion',
    '../FormWidgets/AttributesMsgWidget/AttributesMsgWidget',
], function(core, FormList, View, ReadOnly, StringInput, NumberInput, OnOff, Enum, Complex, ListWidget, FormContainer, Dialog, Accordion, AttributesMsgWidget) {

    return FormList.extend({
        View: View,
        //Array of Edited Values To Be Saved
        valuesToBeSaved: [],
        //Array of the form elements, used for filtering
        formElements: [],
        //Array of invalid values ,used to disable save button
        invalidValues: [],
        filteredAttrbCount: 0,
        totalAttrbCount: 0,

        init: function(options, filterString, valuesToBeSavedCallback, nonPersistentErrorMessage, expansionList, widgetsProducer) {
            this.formElements= [];
            this.options = options;
            this.widgetsProducer = widgetsProducer;
            this.invalidValues = [];
            this.valuesToBeSaved = [];
            this.filterText = filterString;
            this.expansionList = expansionList;
            this.options.onCollapseEventHandler = this.onCollapsableWidgetCollapseEvent.bind(this);
            this.options.onExpandEventHandler = this.onCollapsableWidgetExpandEvent.bind(this);
            this.nonPersistentErrorMessage = nonPersistentErrorMessage;
            this.valuesToBeSavedCallback = valuesToBeSavedCallback;
            if (this.expansionList) {
                this.options.forEach(function(attribute) {
                    if (!this.expansionList[attribute.key])
                        { this.expansionList[attribute.key]={status: false, children: {}}; }
                }.bind(this));
            }
        },

        onCollapsableWidgetCollapseEvent: function(elementId) {
            if (this.expansionList) {
                this.options.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                    this.expansionList[attribute.key].status = false;
                }.bind(this));
            }
        },

        onCollapsableWidgetExpandEvent: function(elementId) {
            if (this.expansionList) {
                this.options.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                    this.expansionList[attribute.key].status = true;
                }.bind(this));
            }
        },

        onViewReady: function() {
            this.createAttributeErrorContainer();
            this.renderForm();
            this.updateFiltering(this.filterText);
        },

        //Draws widget based on Type, eg Boolean, String, Long, Complex
        //Defaults to disabled String input for unknown type
        renderForm: function() {
            this.options.forEach(function(element) {
                if (!element.readOnly) {
                    //Widgets detemine if value is valid/invalid and call these functions accordingly
                    element.onChangeCallback = this.attributeValueChangedCallback.bind(this);
                    element.onInvalidCallback  = this.invalidAttributeValueChangedCallback.bind(this);
                    element.innerOnChangeCallback = this.attributeValueChangedCallback;
                    element.innerOnInvalidCallback  = this.invalidAttributeValueChangedCallback;
                }
                if (this.widgetsProducer) {
                    //element.readOnly = true;
                    element.widgetsProducer = this.widgetsProducer;
                    //element.fromReadOnlyPanel = false;
                    //Expansion status retain swithing view/edit not yet ready for the no persistent attributes
                    element.expanded = !!this.expansionList[element.key] && this.expansionList[element.key].status;
                    this.widgetsProducer.attachWidget(element, this.options, this.formElements, this.view.getFormContainer(), true);
                }
            }.bind(this));

            //Display Error if no persistent attributes
            if (this.options.length === 0 && this.filterText === '' && !this.nonPersistentErrorMessage) {
                this.view.showNonPersistentAttrbsNotFoundMsg();
            } else if (this.nonPersistentErrorMessage && this.filterText === '') {
                this.attrNotFound.showAttributesErrorMessage();
                this.view.hideNonPersistentAttrbsNotFoundMsg();
            } else {
                this.view.hideNonPersistentAttrbsNotFoundMsg();
            }
        },

        createAttributeErrorContainer: function() {
            this.attrNotFound = new AttributesMsgWidget({
                label: 'NonPersistent',
                errorMsg: this.nonPersistentErrorMessage
            });
            this.attrNotFound.attachTo(this.view.getNonPersistentFormErrorMessage());
        },

        updateFiltering: function(filterString) {
            var result = FormList.prototype.updateFiltering.apply(this, arguments);

            if (result.filtered === 0 && filterString === '') {
                if (this.nonPersistentErrorMessage) {
                    this.attrNotFound.showAttributesErrorMessage();
                    this.view.hideNonPersistentAttrbsNotFoundMsg();
                } else {
                    this.attrNotFound.hideAttributesErrorMessage();
                    this.view.showNonPersistentAttrbsNotFoundMsg();
                }
            } else {
                this.view.hideNonPersistentAttrbsNotFoundMsg();
                this.attrNotFound.hideAttributesErrorMessage();
            }

            return result;
        },

        handleChangedValue: function() {
            this.valuesToBeSavedCallback({
                nonPersistentValuesToBeSaved: this.valuesToBeSaved,
                nonPersistentInvalidValues: this.invalidValues
            });
        }
    });
});
