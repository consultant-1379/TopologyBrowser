define([
    'jscore/core',
    './EditStateRegionView',
    'i18n!networkobjectlib/dictionary.json',
    '../../widgets/CounterBox/CounterBox',
    '../../widgets/EditManagementState/EditManagementState'
], function(core, EditStateRegionView, i18n, CounterBox, EditManagementState) {

    /**
     * EditStateRegion is a region that will display options to edit the state of a node.
     *
     * ### Options
     * [===
     *    ({Array<Object>} data) - node data, information of the nodes passed in used for total counter
     * ===]
     *
     * @class networkobjectlib/EditStateRegion
     * @extends Region
     */
    return core.Region.extend({

        View: function() {
            return new EditStateRegionView(i18n.get('editStateRegion'));
        },
        init: function(options) {
            this.data = options.data;
        },

        onViewReady: function() {
            this.includeManagementStateRadio();
            this.view.setNodesCount(this.data.length);
        },

        includeManagementStateRadio: function() {
            this.editManagementState = new EditManagementState();
            this.editManagementState.attachTo(this.view.getDetailsHolder());
        },

        getManagementStateRadio: function() {
            return this.editManagementState.getRadioSelection();
        }
    });
});
