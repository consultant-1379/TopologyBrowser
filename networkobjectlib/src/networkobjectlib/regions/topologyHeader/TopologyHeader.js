/* global define */
define([
    'jscore/core',
    './TopologyHeaderView',
    'i18n!networkobjectlib/dictionary.json',
    './Rest',
    'widgets/SelectBox',
    '../../widgets/SearchNode/SearchNode',
    '../../utils/Constants',
    '../../utils/UserSettings'
], function(core, View, i18n, Rest, SelectBox, SearchNode, Constants, UserSettings) {

    return core.Region.extend({
        View: View,

        init: function() {
            this.options.showTopology = this.options.showTopology === undefined ? true : this.options.showTopology;
            if (this.options.showTopology) {
                if (this.options.showTopology.showCustomTopology) { //if show custom topology dropdown enabled, then need to setup value for excludeTopologies
                    if (this.options.showTopology.showCustomTopology === true) {
                        this.options.showTopology.showCustomTopology = {};
                    }
                    if (!this.options.showTopology.showCustomTopology.excludeTopologies || !Array.isArray((this.options.showTopology.showCustomTopology.excludeTopologies))) {
                        this.options.showTopology.showCustomTopology.excludeTopologies = []; //default value is []
                    }
                }
            }
        },

        onStart: function() {
            if (this.options.showTopology) {
                var dropDownItems = [
                    {header: i18n.modelBasedTopologyHeader},
                    {name: i18n.networkData, value: 'networkData', title: i18n.networkData, type: 'NetworkData'}
                ];
                this.topologyDropdown = new SelectBox({
                    showHeader: true,
                    width: 'auto',
                    value: {name: i18n.networkData, value: 'networkData', title: i18n.networkData, type: 'NetworkData'},
                    items: dropDownItems
                });
                this.topologyDropdown.attachTo(this.view.getDropdown());
                this.view.getLinebar();
                this.topologyDropdown.addEventHandler('click', function() {
                    this.getEventBus().publish('topologyHeader:topologyDropdown:clicked', this.topologyDropdown.getValue());
                }.bind(this));
                this.topologyDropdown.addEventHandler('change', function() {
                    this.getEventBus().publish('topologyHeader:topologyDropdown:changed', { dropdownValue: this.topologyDropdown.getValue() });
                    if (this.topologyDropdown.getValue().value !== 'newCustomTopology') {
                        UserSettings.saveDropdownSettings(this.topologyDropdown.getValue().value, this.topologyDropdown.getValue().type);
                    }
                }.bind(this));
                this.getEventBus().subscribe('topologyHeader:topologyDropdown:reload', setDropdownItems, this);
                this.getEventBus().subscribe('topologyHeader:topologyDropdown:change', changeDropdown.bind(this), this);
                this.getEventBus().subscribe('topologyHeader:topologyDropdown:changed', this.createSearchNodeWidget, this);
            }

            this.getEventBus().subscribe(Constants.CustomEvent.NODE_OBJECT_SELECT, onTreeSelect, this);
            this.getEventBus().subscribe(Constants.CustomEvent.REFRESH_COMPLETE, onTreeRefreshCompleted, this);
            this.view.getClearSelection().addEventHandler('click', onClearClick, this);
            this.view.getSelectedText().setText(i18n.selected);
            this.view.getClearSelectionLink().setText(i18n.clear);
            this.view.getRefreshButton().addEventHandler('click', onRefreshClick, this);
            this.view.getRefreshButton().setProperty('title', i18n.refresh);
            this.view.getFindButton().setProperty('title', i18n.find);
            this.view.getFindButton().addEventHandler('click', this.toggleSearchNodeWidget.bind(this));
            if (!this.options.showSearchNodeIcon) {
                this.view.getFindSpan().detach();
            }
            this.searchWidgetIsToggled = false;
        },

        onViewReady: function() {
            setDropdownItems.call(this);
            this.view.hideClearSelection();
        },

        processTopologyChange: function(items, data) {
            var found = items.filter(function(element) {
                return element.value === data.select;
            });

            if (found.length > 0) {
                this.topologyDropdown.setValue(found[0]);
            } else {
                if (data.select) {
                    this.topologyDropdown.setValue({
                        value: data.select,
                        name: i18n.selectTopology,
                        title: i18n.selectTopology,
                        type: 'CustomTopology'
                    });
                }
            }
            var dropDownValue = this.topologyDropdown.getValue();
            this.getEventBus().publish('topologyHeader:topologyDropdown:changed', {
                dropdownValue: dropDownValue,
                topologyState: data.topologyState,
                poid: data.poid
            });
            return dropDownValue;
        },

        createSearchNodeWidget: function() {
            if (this.searchNodeWidget) {
                this.searchNodeWidget.updateSearchNodeWidget(this.topologyDropdown.getValue().value);
            } else {
                this.searchNodeWidget = new SearchNode({
                    context: this.getContext(),
                    selectedTopologyId: this.topologyDropdown.getValue().value
                });
            }
            if (this.searchWidgetIsToggled) {
                this.searchNodeWidget.attachTo(this.getElement());
                this.searchWidgetIsToggled = true;
            }
        },

        toggleSearchNodeWidget: function() {
            if (this.searchWidgetIsToggled) {
                this.searchNodeWidget.detach();
                this.searchWidgetIsToggled = false;
            } else if (!this.searchNodeWidget) {
                this.searchWidgetIsToggled = true;
                this.createSearchNodeWidget();
            } else {
                this.searchNodeWidget.attachTo(this.getElement());
                this.searchWidgetIsToggled = true;
            }
        }
    });

    function setDropdownItems(valueToSelect) {
        if (this.options.showTopology && this.options.showTopology.showCustomTopology) {
            getDropdownItems.call(this).then(function(items) {
                this.topologyDropdown.setItems(items);
                if (valueToSelect) {
                    this.topologyDropdown.setValue(valueToSelect);
                }
            }.bind(this));
        }
    }

    function getDropdownItems() {
        return Rest.getDropdown().then(function(response) {
            var dropDownItems = [
                {header: i18n.modelBasedTopologyHeader},
                {name: i18n.networkData, value: 'networkData', title: i18n.networkData, type: 'NetworkData'}
            ];
            var generatedCustomTopologies = response.filter(
                function(e) {
                    return this.indexOf(e.value) < 0;
                },
                this.options.showTopology.showCustomTopology.excludeTopologies
            ).sort(function(a, b) {
                return a.name.localeCompare(b.name, undefined, {
                    numeric: true
                });
            });

            if (this.options.showTopology && this.options.showTopology.showCustomTopology &&
                this.options.showTopology.showCustomTopology.showCreateCustomTopology) {

                dropDownItems.push({header: i18n.customTopologiesHeader});
                dropDownItems.push({
                    name: i18n.createCustomTopology,
                    value: 'newCustomTopology',
                    title: i18n.createCustomTopology,
                    type: 'newCustomTopology',
                    disabled: false,
                    icon: 'add'
                }, {
                    type: 'separator'
                });

                if (generatedCustomTopologies.length > 0) {
                    dropDownItems = dropDownItems.concat(generatedCustomTopologies);
                }

            } else {
                if (generatedCustomTopologies.length > 0) {
                    dropDownItems.push({header: i18n.customTopologiesHeader});
                    dropDownItems = dropDownItems.concat(generatedCustomTopologies);
                }
            }

            return dropDownItems;
        }.bind(this));
    }

    function onTreeSelect(selection) {
        var items = selection.networkObjects.concat(selection.nestedCollections);
        this.view.getSelectedNum().setText(items.length);
        if (items.length > 0) {
            this.view.showClearSelection();
        } else {
            this.view.hideClearSelection();
        }
    }

    function onClearClick() {
        this.getEventBus().publish('topologyTree:select', []);
    }

    function onRefreshClick() {
        setDropdownItems.call(this);
        this.getEventBus().publish('topologyTree:refresh');
        this.view.getRefreshButton().setAttribute('disabled');
    }

    function onTreeRefreshCompleted() {
        this.view.getRefreshButton().removeAttribute('disabled');
    }

    function changeDropdown(data) {
        //TODO remove this if condition and logic under else when exposing the UDT.
        UserSettings.getDropdownSettings()
            .then(function(settings) {

                var networkData = {
                    name: i18n.networkData,
                    value: 'networkData',
                    title: i18n.networkData,
                    type: 'NetworkData'
                };

                // Network Data
                if ((this.topologyDropdown && data.select === Constants.defaultTopologies.NETWORK_DATA && settings.value.id === Constants.defaultTopologies.NETWORK_DATA) || data.poid || !this.topologyDropdown) {
                    if (this.topologyDropdown) {
                        this.topologyDropdown.setValue(networkData);
                    }
                    this.getEventBus().publish('topologyHeader:topologyDropdown:changed', {
                        dropdownValue: networkData,
                        topologyState: data.topologyState,
                        poid: data.poid
                    });
                    return Promise.resolve(networkData);
                }

                // User Settings
                if (this.topologyDropdown && settings && settings.value.id && data.select === 'networkData') {
                    var topology = {topologyState: {}, select: settings.value.id};
                    if (this.options.showTopology && this.options.showTopology.showCustomTopology) {
                        getDropdownItems.call(this).then(function(items) {
                            this.processTopologyChange(items, topology);
                        }.bind(this));
                    }
                }

                // Custom Topology
                if (this.topologyDropdown && data.select !== 'networkData') {
                    if (this.options.showTopology && this.options.showTopology.showCustomTopology) {
                        getDropdownItems.call(this).then(function(items) {
                            if (data.select !== settings.value.id) {
                                UserSettings.saveDropdownSettings(data.select, 'CustomTopology');
                            }
                            this.processTopologyChange(items, data);
                        }.bind(this));
                    } else {
                        if (this.topologyDropdown) {
                            this.topologyDropdown.setValue(networkData);
                        }
                        this.getEventBus().publish('topologyHeader:topologyDropdown:changed', {
                            dropdownValue: networkData,
                            topologyState: data.topologyState,
                            poid: data.poid
                        });
                        return Promise.resolve(networkData);
                    }
                }
            }.bind(this));

    }

});
