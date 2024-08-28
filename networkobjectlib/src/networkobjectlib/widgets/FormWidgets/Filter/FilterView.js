define([
    'jscore/core',
    'template!./Filter.html',
    'styles!./Filter.less',
    'i18n!networkobjectlib/dictionary.json'
], function(core, template, style, i18n) {

    return core.View.extend({

        showModifier: 'show',

        getTemplate: function() {
            return template({
                typeToFilter: i18n.typeToFilter
            });
        },

        getStyle: function() {
            return style;
        },

        getFilterInput: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-filter-form-filterInput');
        },

        getFilterInputValue: function() {
            return this.getFilterInput().getValue();
        },

        setFilterInputValue: function() {
            return this.getFilterInput().setValue();
        },

        getClearFilterIcon: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-filter-form-clearFilterIcon');
        },

        showClearFilterIcon: function() {
            this.setModifier(this.getClearIcon(),this.showModifier, 'true');
        },

        hideClearFilterIcon: function() {
            this.setModifier(this.getClearIcon(),this.showModifier, 'false');
        },

        getClearIcon: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-filter-form-clearIcon');
        } ,

        showSearchFilterIcon: function() {
            this.setModifier(this.getSearchIcon(),this.showModifier, 'true');
        },

        hideSearchFilterIcon: function() {
            this.setModifier(this.getSearchIcon(),this.showModifier, 'false');
        },

        getSearchIcon: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-filter-form-searchIcon');
        } ,

        showAttributeValuesFiltered: function() {
            this.setModifier(this.getAttributeValuesFiltered(),this.showModifier, 'true');
        },

        hideAttributeValuesFiltered: function() {
            this.setModifier(this.getAttributeValuesFiltered(),this.showModifier, 'false');
        },

        getAttributeValuesFiltered: function() {
            return this.getElement().find('.elNetworkObjectLib-wNodeDetailsForm-filter-form-attributeValuesFiltered');
        },

        setNumberOfAttributeValuesFiltered: function(filterAttributeCount, totalAttributeCount) {
            var text = i18n.valuesFiltered.replace('$1',filterAttributeCount).replace('$2',totalAttributeCount);
            this.getAttributeValuesFiltered().setText(text);
        },

        setModifier: function(element, modifier, value) {
            if (element.hasModifier(modifier)) {
                element.removeModifier(modifier);
            }
            element.setModifier(modifier,value);
        }

    });

});
