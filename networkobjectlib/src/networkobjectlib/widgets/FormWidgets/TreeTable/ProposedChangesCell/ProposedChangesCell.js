/*global define*/
define([
    'tablelib/Cell'
], function(Cell) {
    'use strict';
    return Cell.extend({

        setValue: function(valueArray) {
            this.getElement().setText(valueArray[0]);
        },

        setTooltip: function(valueArray) {
            this.getElement().setAttribute('title', valueArray[1]);
        }
    });
});
