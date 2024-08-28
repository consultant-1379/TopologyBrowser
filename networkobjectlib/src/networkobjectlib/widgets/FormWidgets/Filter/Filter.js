define([
    'jscore/core',
    './FilterView'
], function(core, View) {
    return core.Widget.extend({

        View: View,

        getText: function() {
            var filterText = this.view.getFilterInputValue(); // get the value of the input, which we filter on
            return filterText;
        },

        addKeyEnterFunction: function(callback) {
            this.view.getFilterInput().addEventHandler('keyup', function() {
                this.onHideSearchIconEvent();
                callback(this.getText());
            }.bind(this));
        },

        addClearFilterFunction: function(callback) {
            this.view.getClearFilterIcon().addEventHandler('click', function() {
                this.resetFilter();
                callback(this.getText());
            }.bind(this));
        },

        resetFilter: function() {
            this.view.setFilterInputValue('');
            this.onShowSearchIconEvent();
        },

        onHideSearchIconEvent: function() {
            this.view.hideSearchFilterIcon();
            this.view.showClearFilterIcon();
            this.view.showAttributeValuesFiltered();
        },

        onShowSearchIconEvent: function() {
            this.view.showSearchFilterIcon();
            this.view.hideClearFilterIcon();
            this.view.hideAttributeValuesFiltered();
        },

        getNumberOfAttributeValuesFiltered: function(filterAttributeCount,totalAttributeCount) {
            this.view.setNumberOfAttributeValuesFiltered(filterAttributeCount, totalAttributeCount);
        }

    });

});
