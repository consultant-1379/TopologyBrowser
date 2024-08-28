define([
    'jscore/core',
    'template!./_readOnly.html',
    'styles!./_readOnly.less',
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getValue: function() {
            return this.getElement().find('.elNetworkObjectLib-readOnly-value');
        },

        getCollectionValue: function() {
            return this.getElement().find('.elNetworkObjectLib-readOnly-collections');
        },
    });

});
