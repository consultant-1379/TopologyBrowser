define([
    'jscore/core',
    'template!./CustomTopology.html',
    'i18n!networkobjectlib/dictionary.json',
    'styles!./CustomTopology.less'
], function(core, template, dictionary, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template({
                template: dictionary.template,
                isApplyRecursively: this.options.applyRecursively
            });
        },

        getStyle: function() {
            return style;
        },

        getTree: function() {
            return this.getElement().find('.elNetworkObjectLib-rCustomTopology-treeObject');
        },

        getApplyRecursivelyCheckBox: function () {
            return this.getElement().find('.elNetworkObjectLib-rCustomTopology-ebCheckbox');
        },

        getIsApplyRecursivelyChecked: function() {
            return this.getApplyRecursivelyCheckBox()._getHTMLElement().checked;
        },

        getCheckboxInfoHolder: function() {
            return this.getElement().find('.elNetworkObjectLib-rCustomTopology-ebCheckbox-InfoPopup');
        },

        getTopology: function() {
            return this.getElement().find('.elNetworkObjectLib-rCustomTopology');
        },

        getItemFromEvent: function(event) {
            return event.originalEvent.target.closest('.elNetworkObjectLib-NodeItem');
        },

        getErrorMessageArea: function() {
            return this.getElement().find('.elNetworkObjectLib-rCustomTopology-messageArea');
        },

        getVisualisation: function() {
            return this.getElement().find('.elDataviz-Tree');
        }
    });
});