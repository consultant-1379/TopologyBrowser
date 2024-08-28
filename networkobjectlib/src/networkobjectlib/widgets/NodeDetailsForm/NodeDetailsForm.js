define([
    'jscore/core',
    '../FormList/FormList',
    './NodeDetailsFormView',
    'widgets/Dialog',
    'widgets/Accordion',
    'i18n!networkobjectlib/dictionary.json',
    '../FormWidgets/AttributesMsgWidget/AttributesMsgWidget',
    '../FormWidgets/ConfirmDialogWidget/ConfirmDialogWidget',
], function(core, FormList, View, Dialog, Accordion, i18n, AttributesMsgWidget, ConfirmDialog) {
    return FormList.extend({
        View: View,
        //Array of Edited Values To Be Saved
        valuesToBeSaved: [],
        nonPersistentValuesToBeSaved: [],
        nonPersistentInvalidValues: [],
        //Array of the form elements, used for filtering
        formElements: [],
        //Array of invalid values ,used to disable save button
        invalidValues: [],
        modalDialog: null,

        init: function(buttons, options, filterString, nonPersistentCallback, nonPersistentExpanded, persistentErrorMessage, expansionList, widgetsProducer, nonPersistentAttributes) {
            this.nonPersistentClickCallback = nonPersistentCallback;
            this.saveButton = buttons.saveButton;
            this.cancelButton = buttons.cancelButton;
            this.attributeValuesNotSaved = buttons.attributeValuesNotSaved;
            this.formElements= [];
            this.options = options;
            this.options.onCollapseEventHandler = this.onCollapsableWidgetCollapseEvent.bind(this);
            this.options.onExpandEventHandler = this.onCollapsableWidgetExpandEvent.bind(this);
            this.invalidValues = [];
            this.valuesToBeSaved = [];
            this.nonPersistentValuesToBeSaved = [];
            this.nonPersistentInvalidValues = [];
            this.filterText = filterString;
            this.expanded = nonPersistentExpanded;
            this.persistentErrorMessage = persistentErrorMessage;
            this.expansionList = expansionList;
            this.widgetsProducer = widgetsProducer;
            this.options.forEach(function(attribute) {
                if (!this.expansionList[attribute.key])
                    { this.expansionList[attribute.key]={status: false, children: {}}; }
            }.bind(this));
            this.nonPersistentAttributes = nonPersistentAttributes;
        },
        onCollapsableWidgetCollapseEvent: function(elementId) {
            this.options.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                this.expansionList[attribute.key].status = false;
            }.bind(this));
        },
        onCollapsableWidgetExpandEvent: function(elementId) {
            this.options.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                this.expansionList[attribute.key].status = true;
            }.bind(this));
        },


        onViewReady: function() {
            this.attributeValuesNotSaved.setText('');
            this.attrNotFound = new AttributesMsgWidget({
                label: 'Persistent',
                errorMsg: this.persistentErrorMessage
            });
            this.attrNotFound.attachTo(this.view.getNodeDetailsFormContainer());

            if (this.options.length === 0 && this.filterText === '' && this.persistentErrorMessage) {
                this.attrNotFound.showAttributesErrorMessage();
            } else if (this.persistentErrorMessage && this.filterText === '') {
                this.attrNotFound.showAttributesErrorMessage();
            } else {
                this.renderForm();
            }

            this.saveButton.setModifier('disabled');
            this.createNonPersistentContainer();
            this.addEventHandlers();
            this.updateFiltering(this.filterText);
        },

        onDestroy: function() {
            this.removeEventListeners();
        },

        createNonPersistentContainer: function() {
            //Creating accordion for Non Persistent Attributes
            this.accordionNonPersistent = new Accordion({
                title: i18n.nonPersistentAttributes,
                expanded: this.expanded,
                enabled: true
            });
            this.accordionNonPersistent.attachTo(this.view.getFormContainer());
        },

        setNonPersistentContent: function(content) {
            this.accordionNonPersistent.setContent(content);
        },

        addEventHandlers: function() {
            this.accordionNonPersistent.addEventHandler('click',function() {
                this.nonPersistentExpanded = this.accordionNonPersistent.isExpanded();
                this.nonPersistentClickCallback(this.nonPersistentExpanded);
            }.bind(this));
        },

        //Draws widget based on Type, eg Boolean, String, Long, Complex
        //Defaults to disabled String input for unknown type
        renderForm: function() {
            //TODO: Attach choices to the nodes.
            this.options.forEach(function(element) {
                if (!element.readOnly) {
                    //Widgets detemine if value is valid/invalid and call these functions accordingly
                    element.onChangeCallback = this.attributeValueChangedCallback.bind(this);
                    element.onInvalidCallback  = this.invalidAttributeValueChangedCallback.bind(this);
                    element.innerOnChangeCallback = this.attributeValueChangedCallback;
                    element.innerOnInvalidCallback  = this.invalidAttributeValueChangedCallback;
                }
                if (this.widgetsProducer) {
                    element.widgetsProducer = this.widgetsProducer;
                    element.expanded = !!this.expansionList[element.key] && this.expansionList[element.key].status;
                    this.widgetsProducer.attachWidget(element, this.options, this.formElements, this.view.getFormContainer(), true);
                }
            }.bind(this));
        },
        updateFiltering: function(filterString) {
            var result = FormList.prototype.updateFiltering.apply(this, arguments);

            if (result.filtered === 0 && filterString === '' && this.attrNotFound) {
                if (this.persistentErrorMessage) {
                    this.attrNotFound.showAttributesErrorMessage();
                } else {
                    this.attrNotFound.hideAttributesErrorMessage();
                }
            } else if (this.attrNotFound) {
                this.attrNotFound.hideAttributesErrorMessage();
            }

            return result;
        },

        handleChangedValue: function() {

            if ((this.invalidValues.length===0 && this.nonPersistentInvalidValues.length===0) && (this.valuesToBeSaved.length > 0 || this.nonPersistentValuesToBeSaved.length > 0)) {
                this.saveButton.removeModifier('disabled');
            }
            else {
                this.saveButton.setModifier('disabled');
            }

            var totalAttributesChanges =  this.valuesToBeSaved.length +  this.nonPersistentValuesToBeSaved.length;
            if (totalAttributesChanges>0)
                { this.attributeValuesNotSaved.setText(i18n.changes +': ('+ totalAttributesChanges +')'); }
            else
                { this.attributeValuesNotSaved.setText(''); }
        },

        setValuesToBeSaved: function(attributes) {
            this.nonPersistentValuesToBeSaved = [];
            this.nonPersistentInvalidValues = [];

            this.nonPersistentValuesToBeSaved = attributes.nonPersistentValuesToBeSaved.map(function(attr) {
                return attr;
            }.bind(this));

            this.nonPersistentInvalidValues = attributes.nonPersistentInvalidValues.map(function(attr) {
                return attr;
            }.bind(this));

            this.handleChangedValue();
        },

        attachOnCancelCallback: function(callback) {
            this.cancelButton.addEventHandler('click', function() {
                this.attributeValuesNotSaved.setText('');
                callback();
            }.bind(this));
        },

        attachOnSaveCallback: function(callback) {
            var saveState = false;

            this.mouseClickEvent = this.saveButton.addEventHandler('click', function() {
                if (this.modalDialog) {
                    // TODO remove .hide() when TORF-184466 is delivered
                    this.modalDialog.hide();
                    this.modalDialog.destroy();
                }

                this.modalDialog = new ConfirmDialog({
                    saveAction: function() {
                        var allValuesToBeSaved = this.valuesToBeSaved.concat(this.nonPersistentValuesToBeSaved);
                        var choice = allValuesToBeSaved.filter(function(e) {
                            return !!e.case;
                        });
                        var allValues = allValuesToBeSaved.filter(function(e) {
                            return !e.case;
                        });

                        choice.forEach(function(e) {
                            allValues = allValues.concat(e.value);
                        });

                        callback(allValues);
                        this.modalDialog.hide();
                    }.bind(this),
                    cancelAction: function() {
                        this.modalDialog.hide();
                    }.bind(this)
                });
                //TODO first verify that there are no errors
                //Using separate array for values that are in error? Or add true/false flag to each item in valuesToBeSaved array
                if ((this.invalidValues.length===0 && this.nonPersistentInvalidValues.length===0) && (this.valuesToBeSaved.length>0 || this.nonPersistentValuesToBeSaved.length>0)) {
                    saveState = true;
                }

                if (!this.saveButton.hasModifier('disabled') && saveState) {
                    var allValuesToBeSaved = JSON.parse(JSON.stringify(this.valuesToBeSaved.concat(this.nonPersistentValuesToBeSaved)));
                    allValuesToBeSaved.forEach(function(e) {
                        if (e.case) {
                            this.modalDialog.showChoiceChangedWarning();
                            return;
                        }
                    }.bind(this));

                    // get all values to be saved and check whether traffic disturbance or not
                    allValuesToBeSaved.forEach(function(changedAttribute) {
                        var attributes = [];
                        // if changed value is a choice, get attributes from the changed case
                        if (changedAttribute.case) {
                            var choices = this.options.filter(function(k) { return k.key === changedAttribute.key; });
                            if (choices[0]) {
                                var cases = choices[0].cases.filter(function(c) { return c.name === changedAttribute.case; });
                                if (cases[0]) {
                                    attributes = cases[0].attributes;
                                }
                            }
                        }
                        else {
                            attributes = this.options.filter(function(k) { return k.key === changedAttribute.key; });
                        }

                        attributes.forEach(function(attr) {
                            if (attr.trafficDisturbances !== null) {
                                changedAttribute.disturbance = attr.trafficDisturbances;
                                this.modalDialog.showTrafficDisturbanceWarning(attr.trafficDisturbances);
                            }
                        }.bind(this));
                    }.bind(this));

                    var allAttributes = this.options.concat(this.nonPersistentAttributes);

                    this.modalDialog.show(allAttributes, allValuesToBeSaved);
                }
                saveState = false;

            }.bind(this));
        },

        removeEventListeners: function() {
            this.saveButton.removeEventHandler(this.mouseClickEvent);
        }
    });
});
