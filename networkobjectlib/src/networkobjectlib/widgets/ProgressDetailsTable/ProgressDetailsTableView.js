define([
    'jscore/core',
    'template!./ProgressDetailsTable.html',
    'styles!./ProgressDetailsTable.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getTable: function() {
            return this.getElement().find('.elNetworkObjectLib-wProgressDetailsTable-table');
        }
    });

});
