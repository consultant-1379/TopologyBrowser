/* global define */
define([
    'jscore/core',
    'container/api',
    './TopologyVisualisationView',
    '../topologyHeader/TopologyHeader',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/TopologyTree',
    '../customTopology/CustomTopology',
    '../../utils/LauncherUtils',
    '../../utils/UserSettings'
], function(core, Container,View, TopologyHeader, i18n, TopologyTree, CustomTopology, LauncherUtils, UserSettings) {


    return core.Region.extend({

        View: View,

        init: function() {
            this.topologies = {};
            if (this.options.showHeader === undefined) {
                this.options.showHeader = {
                    showTopology: {}
                };
            }

            if (this.options.showHeader && this.options.showHeader.showTopology) {
                this.initSelection();
                this.initCombination();
            }
        },

        initSelection: function() {
            var selection = isObject(this.options.showHeader.showTopology.selection) ? this.options.showHeader.showTopology.selection : {};
            var selectionOptions = {
                collectionOfCollections: 'none',
                collectionOfObjects: 'single',
                networkObjects: 'multi'
            };
            for (var option in selectionOptions) {
                selection[option] = selection.hasOwnProperty(option) ? this.checkSelectionOptionValue(selection[option]) : selectionOptions[option];
            }
            this.options.showHeader.showTopology.selection =  selection;
        },

        initCombination: function() {
            var combination = isObject(this.options.showHeader.showTopology.selection.combination) ? this.options.showHeader.showTopology.selection.combination : {};
            var combinationOptions = {
                collection: false,
                networkObjects: false
            };
            for (var option in combinationOptions) {
                combination[option] = combination.hasOwnProperty(option) ?
                    this.checkCombinationOptionValue(combination[option]) : combinationOptions[option];
            }
            this.options.showHeader.showTopology.selection.combination = combination;
        },

        checkSelectionOptionValue: function(optionValue) {
            if (optionValue === 'multi' || optionValue === 'single' || optionValue === 'none') {
                return optionValue;
            } else {
                throw new Error('Invalid selection option, valid options are single, multi or none');
            }
        },

        checkCombinationOptionValue: function(optionValue) {
            if (typeof optionValue === 'boolean') {
                return optionValue;
            } else {
                throw new Error('Invalid combination of selections option, valid options are true or false');
            }
        },

        // TODO review move TopologyHeader into init, and only keep start
        onStart: function() {
            if (this.options.showHeader) {
                if (this.options.showHeader.showTopology) {
                    this.topologyHeader = new TopologyHeader({
                        showTopology: this.options.showHeader.showTopology,
                        showSearchNodeIcon: this.options.showSearchNodeIcon,
                        context: this.getContext()
                    });
                    this.topologyHeader.start(this.view.getHeader());
                    this.topologyHeader.topologyDropdown.addEventHandler('change', function() {
                        this.topologyHeader.view.getSelectedNum().setText(0);
                        this.topologyHeader.view.hideClearSelection();
                    }.bind(this));
                }
                else {
                    this.topologyHeader = new TopologyHeader({
                        context: this.getContext()
                    });
                    this.topologyHeader.start(this.view.getHeader());
                }
            }

            if (this.options.showHeader  &&
                this.options.showHeader.showTopology &&
                this.options.showHeader.showTopology.showCustomTopology &&
                this.options.showHeader.showTopology.showCustomTopology.selectedTopology) {
                this.topologyTree = getTopologyTree.call(this, this.options, 'CustomTopology');
            } else {
                this.topologyTree = getTopologyTree.call(this, this.options, 'NetworkData');
            }
            this.topologyTree.start(this.view.getTree());
            this.getEventBus().subscribe('topologyTree:fetch:root:error', onFetchRootError, this);
            this.getEventBus().subscribe('topologyTree:load', onTopologyTreeLoad, this);
            this.getEventBus().subscribe('customTopology:start', onTopologyTreeLoad, this);
            //TODO review is needed for custom topology
            this.getEventBus().subscribe('topologyHeader:topologyDropdown:changed', this.changeTopologyTree, this);
            this.getEventBus().subscribe('topologyHeader:topologyDropdown:clicked', this.keepPreviousValue, this);
        },

        setBorderedMode: function(enabled) {
            this.view.setBorderedMode(enabled);
        },

        changeTopologyTree: function(data) {
            if (data.dropdownValue.value==='newCustomTopology') {
                this.getEventBus().publish('topologyHeader:topologyDropdown:reload', this.valueToSelect);
                this.createCustomTopologyFlyout();
            } else {

                this.getEventBus().publish('attributesRegion:clear');
                this.getEventBus().publish('topologyTree:select', []);
                this.topologyTree.stop();
                this.options.customTopologyId = data.dropdownValue.value;
                this.topologyTree = getTopologyTree.call(this, this.options, data.dropdownValue.type);
                this.topologyTree.start(this.view.getTree());

                this.getEventBus().publish('topologyBrowser:change:url', {
                    locationParamObject: {
                        topology: data.dropdownValue.value
                    },
                    preventListeners: true,
                    preventLoad: true
                });

                if (data.dropdownValue.value === 'networkData') {
                    this.getEventBus().publish('topologyTree:load', data.poid);
                }
                else {
                    //Custom topology
                    this.getEventBus().publish('customTopology:start', data.topologyState);
                }
            }
        },

        keepPreviousValue: function(valueToSelect) {
            this.valueToSelect = valueToSelect;
        },

        createCustomTopologyFlyout: function() {
            var actionCallback = {
                successCallBack: function(collection) {
                    if (collection) {
                        this.getEventBus().publish('topologyHeader:topologyDropdown:reload', {
                            name: collection.name,
                            value: collection.id
                        });
                        this.getEventBus().publish('topologyHeader:topologyDropdown:changed', {
                            dropdownValue: {
                                name: collection.name,
                                value: collection.id,
                                type: 'CustomTopology'
                            }
                        });
                        UserSettings.saveDropdownSettings(collection.id, 'CustomTopology');
                    }
                }.bind(this),
                failureCallBack: function() {
                    //nothing to do
                }
            };
            this.launcherUtils = new LauncherUtils([], actionCallback);

            this.launcherUtils.launchAction({
                plugin: 'networkexplorer/networkexplorer-create-nested-collection'
            }, [{id: '', isCustomTopology: true}]);
        }
    });

    function onTopologyTreeLoad() {
        this.view.setErrorMode(false);
    }

    function onFetchRootError() {
        this.view.setErrorMode(true);
    }

    function getTopologyTree(options, type) {
        if (this.topologies[type] && this.topologies[type].view) {
            //After topology state complete, review this with delete region
            delete this.topologies[type];
        }

        if (type === 'NetworkData') {
            this.topologies[type] = new TopologyTree(options);
        } else {
            // other topology type is only UDT for this moment.
            this.topologies[type] = new CustomTopology(options);
        }

        return this.topologies[type];
    }

    function isObject(obj) {
        return (typeof obj === 'object') && obj !== null && !Array.isArray(obj);
    }

});
