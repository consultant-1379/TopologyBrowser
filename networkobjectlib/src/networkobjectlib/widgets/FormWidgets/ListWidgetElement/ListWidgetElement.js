define([
    'jscore/core',
    './ListWidgetElementView'
], function(core, View) {
    return core.Widget.extend({

        View: View,

        attributeWidget: null,

        index: null,

        init: function(options) {
            this.options = options;

        },

        onViewReady: function() {
            //this.setWidget(this.options.widget);
            this.setDeleteStatus(this.options.minusEnabled);
            this.setDeleteAction(this.options.minusAction);
        },

        destroyWidget: function() {
            if (this.attributeWidget !== null) {
                this.attributeWidget.destroy();
            }
        },

        setWidget: function(widget) {
            this.attributeWidget = widget;
            if (this.attributeWidget) {
                this.attributeWidget.attachTo(this.view.getListWidgetContainer());
            }
        },

        setDeleteStatus: function(value) {
            if (value) {
                this.view.getDelete().removeModifier('disabled');
            }
            else {
                this.view.getDelete().setModifier('disabled');

            }
        },

        getDeleteStatus: function() {
            return !this.view.getDelete().hasModifier('disabled');
        },

        setDeleteAction: function(action) {
            this.view.getDelete().addEventHandler('click', function() {
                if (this.getDeleteStatus()) {
                    action(this.getIndex());
                }
            }.bind(this));
        },

        update: function(index,deleteStatus) {
            this.setIndex(index);
            if (this.attributeWidget && this.attributeWidget.setIndex) {
                this.attributeWidget.setIndex(index);
            }
            //Update the key on teh widget
            this.setDeleteStatus(deleteStatus);
        },

        setIndex: function(index) {
            this.index = index;
        },

        getIndex: function() {
            return this.index;
        }

    });
});



