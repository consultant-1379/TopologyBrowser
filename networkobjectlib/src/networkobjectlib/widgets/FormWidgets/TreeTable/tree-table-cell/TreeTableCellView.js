/*global define*/
define([
    'jscore/core',
    'text!./treeTableCell.html',
    'styles!./treeTableCell.less'
], function(core, template, styles) {
    'use strict';

    var __prefix = '.elNetworkObjectLib-wTreeTableCell';

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        },

        getIcon: function() {
            return this.getElement().find(__prefix + '-icon');
        },

        getContent: function() {
            return this.getElement().find(__prefix + '-content');
        }
    });
});
