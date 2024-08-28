/* global define */
define([
    'jscore/core',
    'template!./SearchNode.html',
    'styles!./SearchNode.less'
], function(core, template, style) {
    'use strict';

    return core.View.extend({


        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function() {
            return style;
        },

        getFindInput: function() {
            return this.getElement().find('.elNetworkObjectLib-wSearchNode-find-filter-findInput');
        },

        getFindCount: function() {
            return this.getElement().find('.elNetworkObjectLib-wSearchNode-find-filter-findCount');
        },

        getSearchUpButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wSearchNode-find-filter-searchUpBtn');
        },

        getSearchDownButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wSearchNode-find-filter-searchDownBtn');
        },

        getClearSearchIconButton: function() {
            return this.getElement().find('.elNetworkObjectLib-wSearchNode-find-filter-closeIcon');
        },

        setFindCount: function(index, length) {
            this.getFindCount().setText((index + 1) + '/' + length);
        },

        showClearSearchIconButton: function(filterString) {
            this.getClearSearchIconButton().setStyle({visibility: filterString === '' ? 'hidden' : 'visible'});
        },

        showFindCount: function() {
            this.getFindCount().setStyle({visibility: 'visible'});
        },

        hideFindCount: function() {
            this.getFindCount().setStyle({visibility: 'hidden'});
        },

        hideClearSearchIconButton: function() {
            this.hideFindCount();
            this.showClearSearchIconButton('');
            this.getClearSearchIconButton().focus();
        },

        disableSearchUpButton: function() {
            this.getSearchUpButton().setAttribute('disabled','disabled');
        },

        enableSearchUpButton: function() {
            this.getSearchUpButton().removeAttribute('disabled');
        },

        disableSearchDownButton: function() {
            this.getSearchDownButton().setAttribute('disabled','disabled');
        },

        enableSearchDownButton: function() {
            this.getSearchDownButton().removeAttribute('disabled');
        },

        getSearchInputMessage: function() {
            return this.getElement().find('.elNetworkObjectLib-wSearchNode-find-notFound');
        },

        showInputErrorMessage: function(message) {
            this.getFindInput().setModifier('borderColor_red');
            this.getSearchInputMessage().setText(message);
            this.getSearchInputMessage().setStyle({display: 'block'});
        },

        clearInputErrorMessage: function() {
            this.getFindInput().removeModifier('borderColor_red');
            this.getSearchInputMessage().setText('');
            this.getSearchInputMessage().setStyle({display: 'none'});
        }
    });
});
