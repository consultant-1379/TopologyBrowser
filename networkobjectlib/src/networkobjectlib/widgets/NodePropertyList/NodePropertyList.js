define([
    'jscore/core',
    './NodePropertyListView',
    'widgets/Accordion',
    'widgets/InfoPopup',
    'i18n!networkobjectlib/dictionary.json',
    '../FormWidgets/AttributesMsgWidget/AttributesMsgWidget',
    'i18n/AdvancedDateTime'
], function(core, View, Accordion, InfoPopup, i18n, AttributesMsgWidget, advancedDateTime) {
    return core.Widget.extend({
        expanded: false,

        init: function(options, nonPersistentExpanded, nonPersistentCallback, filterText, persistentErrorMessage, expansionList, widgetsProducer) {
            this.options = options;
            this.options.onCollapseEventHandler = this.onCollapsableWidgetCollapseEvent.bind(this);
            this.options.onExpandEventHandler = this.onCollapsableWidgetExpandEvent.bind(this);
            this.expanded = nonPersistentExpanded;
            this.nonPersistentClickCallback = nonPersistentCallback;
            this.filterText = filterText;
            this.persistentErrorMessage = persistentErrorMessage;
            this.expansionList = expansionList;
            this.widgetsProducer = widgetsProducer;
            this.options.attributes.forEach(function(attribute) {
                if (!this.expansionList[attribute.key])
                    { this.expansionList[attribute.key]={status: false, children: {}}; }
            }.bind(this));
        },

        onCollapsableWidgetCollapseEvent: function(elementId) {
            this.options.attributes.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                this.expansionList[attribute.key].status = false;
            }.bind(this));
        },
        onCollapsableWidgetExpandEvent: function(elementId) {
            this.options.attributes.filter(function(attribute) { return attribute.key === elementId; }).forEach(function(attribute) {
                this.expansionList[attribute.key].status = true;
            }.bind(this));
        },

        view: function() {
            this.options.attributes.filter(function(e) {
                return e.type === 'TIMESTAMP';
            }).forEach(function(e) {
                if (Number.isInteger(e.value)) {
                    e.formattedTimestamp = this.formatDateAttributes(e.value);
                }
            }.bind(this));
            var listView = new View(this.options);
            return listView;
        },

        //When type is TIMESTAMP we format date correctly as e.g. 02/10/2016 10:22:03
        formatDateAttributes: function(value) {
            var date = new Date(value);
            return advancedDateTime(date).format('DTS');
        },

        onDOMAttach: function() {
            //Display Error is no persistent attributes
            if (this.options.attributes.length === 0 && this.filterText === '' && this.persistentErrorMessage) {
                this.attrNotFound = new AttributesMsgWidget({
                    label: 'Persistent',
                    errorMsg: this.persistentErrorMessage
                });
                this.attrNotFound.attachTo(this.view.getPropertyListContainer());
            } else {
                //After template has been rendered we populate the accordion placeholders with data
                this.options.attributes.forEach(function(e) {
                    e.widgetsProducer = this.widgetsProducer;
                    var widget = this.populateAttributeContainer(e);
                    if (widget) {
                        widget.attachTo(this.view.getAccordionContainerForKey(e.key));
                    }
                }.bind(this));
            }

            this.createNonPersistentAccordion();
            this.addEventHandlers();
        },

        createNonPersistentAccordion: function() {
            //Creating accordion for Non Persistent Attributes
            this.accordionNonPersistent = new Accordion({
                title: i18n.nonPersistentAttributes,
                expanded: this.expanded,
                enabled: true
            });
            this.accordionNonPersistent.attachTo(this.view.getAccordionNonPersistentContainer());

        },

        addEventHandlers: function() {
            this.accordionNonPersistent.addEventHandler('click',function() {
                this.nonPersistentExpanded = this.accordionNonPersistent.isExpanded();
                this.nonPersistentClickCallback(this.nonPersistentExpanded);
            }.bind(this));
        },

        setNonPersistentContent: function(content) {
            this.accordionNonPersistent.setContent(content);
        },

        populateAttributeContainer: function(element) {
            var clonedElement = JSON.parse(JSON.stringify(element));
            clonedElement.readOnly = true;
            clonedElement.expanded = !!this.expansionList[element.key] && this.expansionList[element.key].status;
            if (this.widgetsProducer) {
                if (clonedElement.type === 'CHOICE')
                    { clonedElement.widgetsProducer= this.widgetsProducer; }
                clonedElement.fromReadOnlyPanel = true;
                clonedElement.widgetsProducer = this.widgetsProducer;
                return this.widgetsProducer.createWidget(clonedElement, this.options);
            }
            else {
                return null;
            }
        },
    });

});



