/* global define */
define([
    'jscore/core',
    './MainView',
    'webpush/main',
    'networkobjectlib/utils/Constants',
    'networkobjectlib/TopologyVisualisation',
    '../../utils/Utils'
], function(core, View, WebPush, Constants, TopologyVisualisation, Utils) {

    return core.Region.extend({
        View: View,

        init: function() {
            this.topologyVisualisation = new TopologyVisualisation({
                context: this.getContext(),
                showFDN: true,
                multiselect: true,
                applyRecursively: false,
                showNodeCount: true,
                showSearchNodeIcon: true,
                showHeader: {
                    showTopology: {
                        showCustomTopology: {
                            excludeTopologies: [],
                            selectedTopology: this.options.selectedTopology,
                            showCreateCustomTopology: true
                        },
                        selection: {
                            collectionOfCollections: 'multi',
                            collectionOfObjects: 'multi',
                            networkObjects: 'multi',
                            combination: {
                                collection: true,
                                networkObjects: false
                            }
                        }
                    }
                }
            });
        },

        onStart: function() {
            this.topologyVisualisation.start(this.getElement());

            WebPush.subscribe('/collection:update', function(event) {
                var userName = Utils.getCurrentUser();
                if (userName && userName !== event.userName) {
                    this.getEventBus().publish(Constants.CustomEvent.SHOW_REFRESH_NOTIFICATION, event);
                }
            }.bind(this));

            this.getEventBus().subscribe('topologyTree:fetch:root:error', onFetchRootError, this);
            this.getEventBus().subscribe('topologyTree:load', onTopologyTreeLoad, this);
            this.getEventBus().subscribe('customTopology:start', onTopologyTreeLoad, this);
        }
    });

    function onTopologyTreeLoad() {
        this.topologyVisualisation.setBorderedMode(true);
    }

    function onFetchRootError() {
        this.topologyVisualisation.setBorderedMode(false);
    }
});
