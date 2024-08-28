define([
    'jscore/core',
    'template!./_moTypeDetails.html',
    'styles!./_moTypeDetails.less',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, style, i18n) {

    return core.View.extend({

        enableModifier: 'enabled',
        disabledModifier: 'disabled',
        trueBoolean: 'enabled',
        falseBoolean: 'disabled',

            /*
             @desc default method to get the html template associated with the view defined above
             */
        getTemplate: function() {
            return template({
                editAttributes: i18n.buttons.editAttributes,
                saveChanges: i18n.buttons.saveChanges,
                cancel: i18n.buttons.cancel
            });
        },

            /*
             @desc default method to get access to the style defined above
             */
        getStyle: function() {
            return style;
        },

            /*
             @desc Adds a click handler to the 'x' button
             @param function fn This method is called from the presenter which specifies which function should be called when this click event occurs
             */
        addCloseClickHandler: function(fn) {
            this.getElement().find('.elNetworkObjectLib-attributesRegion-closeDetailsIconButton').addEventHandler('click', fn);
        },

        setShowModifierFor: function(elem, value) {
            try {
                if (elem) {
                       //TODO: we need to switfh css for modifier
                    elem.setModifier('show', value ? this.trueBoolean : this.falseBoolean);
                       //elem.setStyle("display", value ? "block" : "none");
                }
            }
            catch (e) {
                return;
            }
        },
        getSelectedNodePropertiesHeaderContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-selectedNodeHeader');
        },

        getSelectedNodePropertiesMessageArea: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-messageArea');
        },

        getSelectedNodePropertiesMessageText: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-messageArea-message');
        },

        getSelectedNodePropertiesMessageTitle: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-messageArea-title');
        },

            /*
             @desc utility method to get a reference to the selectedNodePropertiesContainer
             */
        getSelectedNodePropertiesContentDiv: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-Content');
        },

        getFilterContainer: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-filterContainer');
        },
        getFilterContainerPanel: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-filter');
        },

        getEditPropertiesButton: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-editPropertiesLink');
        },

        getEditPropertiesButtonHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-editPropertiesLinkContainer');
        },

        setModifier: function(element, modifier, value) {
            this.removeModifier(element,modifier);
            element.setModifier(modifier,value);
        },

        removeModifier: function(element, modifier) {
            if (element.hasModifier(modifier)) {
                element.removeModifier(modifier);
            }
        },

        getControlPanel: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-controlPanel');
        },

        getSaveButton: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-saveButton');
        },

        getCancelButton: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-cancelLink');
        },

        getAttributeValuesNotSaved: function() {
            return this.getElement().find('.elNetworkObjectLib-attributesRegion-attributeValuesNotSaved');
        },

        setNumberOfAttributeValuesNotSaved: function(num) {
            this.getAttributeValuesNotSaved().setText('Changes: ' +'('+num +')');
        },

        setMessageAreaText: function(title, message) {
            this.getSelectedNodePropertiesMessageTitle().setText(title);
            this.getSelectedNodePropertiesMessageText().setText(message);
        }
    });
}
);
