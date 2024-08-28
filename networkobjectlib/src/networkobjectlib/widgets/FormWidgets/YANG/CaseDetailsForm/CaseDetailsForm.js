define([
    '../../../FormList/FormList',
    './CaseDetailsFormView',
    '../../../FormWidgets/AttributesMsgWidget/AttributesMsgWidget',
], function(FormList, View, AttributesMsgWidget) {
    return FormList.extend({
        View: View,
        //Array of Edited Values To Be Saved
        valuesToBeSaved: [],
        //Array of the form elements, used for filtering
        formElements: [],
        //Array of invalid values ,used to disable save button
        invalidValues: [],

        init: function(options, expanded, widgetsProducer, caseName, onCasePanelAttributeChange) {
            this.formElements= [];
            this.options = options;
            this.invalidValues = [];
            this.valuesToBeSaved = [];
            this.expanded = expanded;
            this.widgetsProducer = widgetsProducer;
            this.caseName=caseName;
            this.onCasePanelAttributeChange=onCasePanelAttributeChange;
        },

        onViewReady: function() {
            this.attrNotFound = new AttributesMsgWidget({
                label: 'Persistent'
            });
            this.attrNotFound.attachTo(this.view.getNodeDetailsFormContainer());

            if (this.options.length === 0) {
                this.attrNotFound.showAttributesErrorMessage();
            } else if (this.persistentErrorMessage) {
                this.attrNotFound.showAttributesErrorMessage();
            } else {
                this.renderForm();
            }
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
                    if (element.type === 'CHOICE')
                        { element.widgetsProducer = this.widgetsProducer; }
                    this.widgetsProducer.attachWidget(element, this.options, this.formElements, this.view.getFormContainer());
                }
            }.bind(this));
        },

        handleChangedValue: function() {
            if (this.onCasePanelAttributeChange) {
                this.onCasePanelAttributeChange(this.caseName, this.valuesToBeSaved);
            }
        }
    });
});
