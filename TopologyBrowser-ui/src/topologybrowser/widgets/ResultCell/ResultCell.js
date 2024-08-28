define([
    'tablelib/Cell',
    './ResultCellView'
], function(Cell, View) {
    'use strict';
    return Cell.extend({
        View: View,

        view: function() {
            return new View(this.options);
        },
        setValue: function() {
            this.view.getIcon().setModifier('close');
            this.view.getIcon().setStyle('margin', '-45px -10px');
            this.view.getIcon().setStyle('position', 'absolute');
            this.view.getIcon().setStyle('cursor', 'pointer');
            this.view.getIcon().addEventHandler('click', this.removeNode.bind(this));
        },
        removeNode: function() {
            this.item = [{
                'NodeName': this.options.row.options.model.NodeName,
                'ACTION': this.options.row.options.model.ACTION
            }];
            this.options.row.options.model.eventbus.publish('supervision:resultCell:removeCell', this.getRow().getIndex());
        }

    });

});
