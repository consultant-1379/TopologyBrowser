/*global define*/
define([
    'jscore/core',
    'text!./treeTable.html',
    'styles!./treeTable.less'
], function(core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        }
    });
});
