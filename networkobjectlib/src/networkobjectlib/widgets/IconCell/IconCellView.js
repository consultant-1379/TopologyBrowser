/*global define*/
define([
    'jscore/core',
    'template!./IconCellView.html'
], function(core, template) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template(this.options);
        },

        setCaption: function(caption) {
            this.getElement().find('.eaCellManagement-wLockInProgress-wIconCell-caption').setText(caption);
        },

        setIcon: function(ebIconClass) {
            this.getElement().find('.ebIcon')._getHTMLElement().className = 'ebIcon ' + ebIconClass; // using _getHTMLElement() to get actual DOM element
            this.getElement().find('.ebIcon').setAttribute('class', 'ebIcon ' + ebIconClass);
        }

    });
});
