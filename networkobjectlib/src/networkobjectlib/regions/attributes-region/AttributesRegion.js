define([
    'jscore/core',
    './AttributesRegionView',
    'i18n!networkobjectlib/dictionary.json',
    'container/api',
    'widgets/Tabs',
    'widgets/Loader',
    '../moTypeDetails/MoTypeDetailsWidget',
    '../moTypeDetails/Rest',
    '../nodeDetails/NodeDetailsWidget',
    'collection-management-lib/CollectionDetails',
    '../../widgets/FormWidgets/ReadOnly/ReadOnly',
    '../../utils/Constants'
], function(core, DisplayTabView, i18n, container, Tabs, Loader, MoTypeDetailsWidget, Rest, NodeDetailsWidget, CollectionDetails, ReadOnly, Constants) {

    /**
     * AttributesRegion is a region that will display and save persistent and non-persistent attributes
     *
     * ### Options
     * [===
     *    {AppContext} context - application context, required for sharing events.
     * ===]
     *
     * ### Events Subscribed
     * [===
     *     attributesRegion:load ({String} poid) - fetch and display attributes
     *     attributesRegion:loadCollection ({String} poid) - fetch and display attributes from Custom Collections
     *     attributesRegion:clear () - clear attributes from display and cancel pending get requests
     *     collectionDetails:fetch:collection:success ({Response} response) - Sends back the collection details in case of success
     *     collectionDetails:fetch:collection:error ({Error} error) - Sends back object with error information in case of failure
     *
     * ===]
     *
     * ### Events Published
     * [===
     *      attributesRegion:save:success () - triggered when attributes were saved successfully
     *      attributesRegion:save:error:closed () - triggered when user exits save error dialog
     *      attributesRegion:fetch:persistent:success ({Response} response) - triggered when persistent attributes were fetched successfully
     *      attributesRegion:fetch:persistent:error   ({CustomError} error) - triggered when couldn't fetch persistent attributes
     *      attributesRegion:fetch:model:success    ({Response} response) - triggered when model information was fetched successfully
     *      attributesRegion:fetch:model:error ({CustomError} error) - triggered when could not fetch model information
     *
     * ===]
     *
     * ### Response
     * [===
     *     {Object} data - Data response
     *     {Object} xhr - UISDK xhr object
     * ===]
     *
     *
     * @class networkobjectlib/AttributesRegion
     * @extends Region
     */

    var CustomEvent = {
        LOAD: 'attributesRegion:load',
        LOAD_COLLECTION: Constants.CustomEvent.LOAD_COLLECTION_DETAILS,
        CLEAR: 'attributesRegion:clear',
        SHOW_MESSAGE: 'attributesRegion:show:message'
    };

    var MO_DETAILS_INDEX = 0;

    return core.Region.extend({

        View: DisplayTabView,

        init: function() {
            this.moTypeDetailsRegion = new MoTypeDetailsWidget({
                context: this.getContext()
            });

            this.nodeDetailsRegion = new NodeDetailsWidget({
                context: this.getContext()
            });

            this.tabsWidget = new Tabs({
                tabs: [
                    {title: i18n.moDetails, content: this.moTypeDetailsRegion},
                    {title: i18n.nodeDetails, content: this.nodeDetailsRegion}
                ]
            });

            this.loadingTimerId = null;
        },

        onStart: function() {
            this.getEventBus().subscribe(CustomEvent.LOAD, this.load, this);
            this.getEventBus().subscribe(CustomEvent.LOAD_COLLECTION, this.loadCollection, this);
            this.getEventBus().subscribe(CustomEvent.CLEAR, this.clear, this);
            this.getEventBus().subscribe(CustomEvent.SHOW_MESSAGE, this.showMessage, this);

            this.getEventBus().subscribe('attributesRegion:fetch:persistent:success', onFetchPersistentSuccess, this);
            this.getEventBus().subscribe('attributesRegion:fetch:persistent:error', onFetchPersistentError, this);
            this.getEventBus().subscribe('attributesRegion:fetch:model:success', onFetchModelSuccess, this);
            this.getEventBus().subscribe('attributesRegion:fetch:model:error', onFetchModelError, this);
            this.getEventBus().subscribe('topologyTree:fetch:root:error', onFetchRootError, this);
            this.getEventBus().subscribe('attributesRegion:save:success', onSaveFinish, this);
            this.getEventBus().subscribe('attributesRegion:save:error', onSaveFinish, this);
            this.getEventBus().subscribe('attributesRegion:save:start', onSaveStart, this);
            this.getEventBus().subscribe('collectionDetails:fetch:collection:success', onFetchCollectionSuccess, this);
            this.getEventBus().subscribe('collectionDetails:fetch:collection:error', onFetchCollectionError, this);
        },

        onStop: function() {
            this.clearCollectionDetailsPanel();
            clearTimeout(this.loadingTimerId);
        },

        onViewReady: function() {
            this.moTypeDetailsRegion.attachTo(this.view.getTabs());
        },

        /**
         * Load attributes and and display in region
         *
         * @private
         * @method load
         * @param {String} poid
         */
        load: function(poid) {
            this.showLoader();
            this.moTypeDetailsRegion.requestMoAttributes(poid, false, true);
        },

        /**
         * Loads the collection details and show them in collection details region
         *
         * @private
         * @method loadCollection
         * @param {String} poid
         */
        loadCollection: function(poid) {
            this.clearAttributesPanel();
            this.clearCollectionDetailsPanel();
            this.collectionDetailsRegion = new CollectionDetails({
                context: this.getContext(),
                poid: poid
            });
            this.collectionDetailsRegion.start(this.view.getTabs());
            switchToCollectionDetails.call(this);
            this.getEventBus().publish('attributesRegion:updateCurrentFDN', '', this);
            this.view.updateFDN('');
        },

        /**
         * Clear attributes from region
         * @private
         * @method clear
         */
        clear: function() {
            this.hideLoader();
            this.getEventBus().publish('attributesRegion:updateCurrentFDN', '', this);
            Rest.cancelRequestsByTypes(['getAttributes', 'getModelInfo']);
            this.clearAttributesPanel();
        },

        /**
         * Show message with title and description
         *
         * @private
         * @method showMessage
         */
        showMessage: function(obj, icon) {
            this.clearAttributesPanel();
            this.moTypeDetailsRegion.showMessage(obj, icon);
        },

        clearAttributesPanel: function() {
            this.view.showSelectedHolder(false);
            this.view.updateSelectedName('');
            this.view.updateSelectedType('');
            this.view.updateFDN('');

            this.moTypeDetailsRegion.clearAttributesPanel();
            this.nodeDetailsRegion.showError(i18n.defaultNetworkMessageTitle, i18n.defaultNetworkMessageText);

            switchToTabMode.call(this, false);
        },

        /**
         * Verifies if collection details region is running and stop it
         *
         * @private
         * @method clearCollectionDetailsPanel
         */
        clearCollectionDetailsPanel: function() {
            if (this.collectionDetailsRegion && this.collectionDetailsRegion.isRunning()) {
                this.collectionDetailsRegion.clearCollectionDetailsItems();
                this.collectionDetailsRegion.stop();
            }
        },

        getWidgetsFromResponse: function(attributes) {
            return attributes.map(function(a) {
                var key = a.key;
                return new ReadOnly({
                    key: key,
                    value: a.value,
                    collections: a.collections
                });
            });
        },

        showLoader: function() {
            if (this.loader) {
                this.loader.destroy();
                this.loader = null;
            }
            this.loader = new Loader();
            this.loader.attachTo(this.getElement());
        },

        hideLoader: function() {
            if (this.loader) {
                this.loader.destroy();
            }
        }
    });

    function onFetchPersistentSuccess(response) {
        this.view.showSelectedHolder(true);
        this.view.updateSelectedName(response.data.name);
        this.view.updateSelectedType(response.data.type);
        this.view.updateFDN(response.data.fdn);

        this.getEventBus().publish('attributesRegion:updateCurrentFDN', response.data.fdn, this);

        // convert json to widgets and show in node details tab
        var widgets = this.getWidgetsFromResponse(response.data.networkDetails || []);
        this.nodeDetailsRegion.showWidgets(widgets);

        // show tabs if not a SubNetwork
        var tabMode = response.data.type !== 'SubNetwork';
        switchToTabMode.call(this, tabMode);
    }

    function onFetchPersistentError(error) {
        this.showMessage(error, 'error');
        this.hideLoader();
    }

    function onFetchCollectionSuccess(name, type) {
        switchToCollectionDetails.call(this);
    }

    function onFetchCollectionError(error) {
        this.showMessage(error, 'error');
        this.hideLoader();
    }

    function onFetchModelSuccess() {
        this.hideLoader();
    }

    function onFetchModelError() {
        this.hideLoader();
    }

    // show inline error message if root not fetched.
    function onFetchRootError() {
        this.clearAttributesPanel();
    }

    function onSaveStart() {
        container.getEventBus().publish('container:loader', {content: 'Processing request...'});

        // change loading message if taking too long
        this.loadingTimerId = setTimeout(function() {
            container.getEventBus().publish('container:loader', {content: 'Your request is taking longer than expected, please wait.'});
        }, 10000);
    }

    function onSaveFinish() {
        // abort loading timer if save request was already completed
        clearTimeout(this.loadingTimerId);
        container.getEventBus().publish('container:loader-hide');
    }

    function switchToTabMode(tabMode) {
        this.clearCollectionDetailsPanel();
        if (tabMode) {
            this.moTypeDetailsRegion.detach();
            // need to call this to attach moTypeDetailsRegion to tab widget
            this.tabsWidget.setSelectedTab(MO_DETAILS_INDEX);
            this.tabsWidget.attachTo(this.view.getTabs());

            this.tabsWidget.setContentHeight('calc(100% - 30px)');
        } else {
            this.tabsWidget.detach();
            this.moTypeDetailsRegion.attachTo(this.view.getTabs());
        }
    }

    function switchToCollectionDetails() {
        this.moTypeDetailsRegion.detach();
        this.tabsWidget.detach();
    }

});




