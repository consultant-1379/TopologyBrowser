define([
    'jscore/core',
    './NodeItemView'
], function(core, View) {

    return core.Widget.extend({

        View: View,

        onViewReady: function() {

            this.view.setLabel(this.options.label, this.options.contentsUpdatedTime);
            this.setType();
            this.view.setNodeCount(this.options.totalNodeCount, this.options);
            this.view.setSyncStatus(this.options.syncStatusIcon, this.options.syncStatusTitle);
            this.view.setManagementState(this.options.managementStateIcon, this.options.managementStateTitle);
            this.view.setRadioAccessTechnologies(this.options.radioAccessTechnology);
            this.view.setIcon(this.options.icon, this.options.iconTitle);
            this.view.setId(this.options.id);

            this.view.manageVisibleIcons();
        },

        setType: function() {
            if (this.options.stereotypes && this.options.stereotypes.length > 0 && this.options.stereotypes[0].type) {
                this.view.setType(this.options.stereotypes[0].type);
            }
            else {
                this.view.setType(this.options.type);
            }
        }
    });
});
