define([
    'jscore/core',
    'text!./_nodeDetails.html',
    'styles!./_nodeDetails.less'
], function(core, template, style) {

    return core.View.extend({

        /*
         @desc default method to get the html template associated with the view defined above
         */
        getTemplate: function() {
            return template;
        },

        /*
         @desc default method to get access to the style defined above
         */
        getStyle: function() {
            return style;
        },

        getAttributes: function() {
            return this.getElement().find('.elNetworkObjectLib-nodeDetails-attributes');
        }

    });

});




