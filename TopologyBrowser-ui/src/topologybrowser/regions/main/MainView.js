/* global define */
define([
    'jscore/core',
    'template!./_main.html',
    'styles!./_main.less'
], function(core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        }
    });
});
