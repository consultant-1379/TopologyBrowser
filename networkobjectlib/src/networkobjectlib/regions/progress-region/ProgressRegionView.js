define([
    'jscore/core',
    'template!./_progressRegion.html',
    'styles!./_progressRegion.less',
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getSummaryHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-progressRegion-summary');
        },

        addCounterBox: function(counterBox) {
            var listItem = new core.Element('li');
            listItem.setAttribute('class', 'elNetworkObjectLib-progressRegion-summary-counter');
            this.getSummaryHolder().prepend(listItem);
            counterBox.attachTo(listItem);
        },

        getProgressBarHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-progressRegion-summary-progress-bar');
        },

        getDetailsHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-progressRegion-details');
        },

        getDetailsFooter: function() {
            return this.getElement().find('.elNetworkObjectLib-progressRegion-footer');
        }

    });
});
