define([
    'jscore/core',
    'template!./fdnPath.html',
    'styles!./fdnPath.less'
], function(core, template, style) {

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getInput: function() {
            return this.getElement().find('.elNetworkObjectLib-wFDNPath-input');
        },

        getInputValue: function() {
            return this.getInput().getNative().value.trim();
        },

        getButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wFDNPath-button');
        }

    });

});
