define([
    'jscore/core',
    './NonPersistentAttrListView',
    'widgets/Accordion',
    '../FormWidgets/FormContainerWidget/FormContainerWidget',
    '../FormWidgets/ComplexRefWidget/ComplexRefWidget',
    '../FormWidgets/ListFormContainerWidget/ListFormContainerWidget',
    'i18n!networkobjectlib/dictionary.json',
    '../FormWidgets/AttributesMsgWidget/AttributesMsgWidget',
    'i18n/AdvancedDateTime',
    'networkobjectlib/utils/customError'
], function(core, View, Accordion, FormContainer, Complex, ListFormContainer, strings, AttributesMsgWidget, advancedDateTime, customError) {
    return core.Widget.extend({

        init: function(options, filterText, nonPersistentErrorMessage, expansionList, widgetsProducer, error) {
            this.options = options;
            this.filterText = filterText;
            this.nonPersistentErrorMessage = nonPersistentErrorMessage;
            this.widgetsProducer = widgetsProducer;
            this.options.onCollapseEventHandler = this.onCollapsableWidgetCollapseEvent.bind(this);
            this.options.onExpandEventHandler = this.onCollapsableWidgetExpandEvent.bind(this);
            this.expansionList = expansionList;
            this.error = error;
            if (this.options.nonPersistentAttributes) {
                this.options.nonPersistentAttributes.filter(function(e) {
                    return e.type === 'TIMESTAMP';
                }).forEach(function(e) {
                    if (Number.isInteger(e.value)) {
                        e.formattedTimestamp = this.formatDateAttributes(e.value);
                    }
                }.bind(this));
            }

            this.view =  new View(this.options);
            if (this.expansionList) {
                if (this.options.nonPersistentAttributes) {
                    this.options.nonPersistentAttributes.forEach(function(attribute) {
                        if (!this.expansionList[attribute.key])
                            { this.expansionList[attribute.key]={status: false, children: {}}; }
                    }.bind(this));
                }
            }
        },
        onCollapsableWidgetCollapseEvent: function(elementId) {
            if (this.expansionList) {
                this.options.nonPersistentAttributes.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                    this.expansionList[attribute.key].status = false;
                }.bind(this));
            }
        },
        onCollapsableWidgetExpandEvent: function(elementId) {
            if (this.expansionList) {
                this.options.nonPersistentAttributes.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                    this.expansionList[attribute.key].status = true;
                }.bind(this));
            }
        },

        onViewReady: function() {
            //Display Error is no NonPersistent attributes
            if (this.options.nonPersistentAttributes.length === 0 && this.filterText === '' && !this.nonPersistentErrorMessage) {
                this.view.showNonPersistentAttrbsNotFoundMsg();
            } else if (this.nonPersistentErrorMessage && this.filterText === '') {
                this.attrNotFound = new AttributesMsgWidget({
                    label: 'NonPersistent',
                    errorMsg: this.getErrorMessage()
                });
                this.attrNotFound.attachTo(this.view.getNonPersistentErrorMessage());
            } else {
                this.options.nonPersistentAttributes.forEach(function(e) {
                    var widget = this.populateAttributeContainer(e);
                    if (widget) {
                        widget.attachTo(this.view.getAccordionContainerForKey(e.key));
                    }

                }.bind(this));
            }
        },

        getErrorMessage: function() {
            var errorMsg ='';
            if (this.error instanceof customError.NodeBusy) {
                errorMsg = this.error.title + ':' + this.error.body;
            } else {
                errorMsg = this.nonPersistentErrorMessage;
            }
            return errorMsg;
        },

        //When type is TIMESTAMP we format date correctly
        formatDateAttributes: function(value) {
            var date = new Date(value);
            return advancedDateTime(date).format('DTS');
        },

        populateAttributeContainer: function(element) {
            var clonedElement = JSON.parse(JSON.stringify(element));
            clonedElement.readOnly = true;
            if (this.widgetsProducer) {
                if (clonedElement.type === 'CHOICE')
                    { clonedElement.widgetsProducer= this.widgetsProducer; }
                /* Now showing help for the view mode too in order to bug : TORF-116829 switch :
                * clonedElement.fromReadOnlyPanel = true;
                * to remove the help for the no persistent attributes*/
                clonedElement.expanded = !!this.expansionList[element.key] && this.expansionList[element.key].status;
                clonedElement.fromReadOnlyPanel = true;
                clonedElement.widgetsProducer = this.widgetsProducer;
                return this.widgetsProducer.createWidget(clonedElement, this.options);
            }
            else {
                return null;
            }
        }

    });
});



