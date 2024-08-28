define([
    'jscore/core',
    './SupervisionWidgetView',
    'widgets/Button',
    'widgets/InlineMessage',
    'tablelib/Table',
    '../ProgressCell/ProgressCell',
    '../ResultCell/ResultCell',
    'widgets/Loader',
    './Rest',
    'i18n!topologybrowser/app.json',
    'networkobjectlib/utils/customError',
    '../../utils/Utils'
], function(core, View, Button, InlineMessage, Table, ProgressCell, ResultCell, Loader, Rest, i18n, customError, Utils) {
    'use strict';
    return core.Widget.extend({
        View: View,

        init: function(options) {
            this.options = options;
            this.filterObject = [];
            this.progressObject = {};
            this.user = Utils.getCurrentUser();
            this.memory = {};
            this.tree = undefined;
            options.eventbus.subscribe('supervision:setWebPushData', this.setWebPushData.bind(this));
            options.eventbus.subscribe('supervision:showLoader', this.showLoader.bind(this));
            options.eventbus.subscribe('supervision:hideLoader', this.hideLoader.bind(this));
            options.eventbus.subscribe('supervision:initTreeData', this.setData.bind(this));
        },

        setData: function(memory) {
            this.tree = memory;
        },

        onViewReady: function() {
            this.emptyDataMessage();
        },

        clearTasksButton: function() {
            this.clearButton = new Button({
                caption: i18n.get('NOTIFICATION_PANEL.CLEARTASKS'),
                name: i18n.get('SUPERVISION.TOOLTIP'),
                label: i18n.get('NOTIFICATION_PANEL.CLEARTASKS_LABEL'),
                tooltips: true,
                modifiers: [{}, {
                    name: 'color',
                    value: 'default',
                }]
            });
            this.clearButton.attachTo(this.view.getInfoValue());
            this.view.getInfoValue().setStyle('position', 'fixed');
            this.view.getInfoValue().setStyle('z-index', '1');
            this.view.getInfoValue().setStyle('margin', '4px');
            this.clearButton.addEventHandler('click', this.clearCompletedTasks.bind(this));
        },

        removeRowData: function(data) {
            this.deleteData = {};
            this.deleteDataPayload = {};
            this.enablePayload = [];
            this.disablePayload = [];
            if (this.filterObject[data].ACTION === 'DISABLE') {
                this.disablePayload.push(this.filterObject[data].NodeName);
            } else if (this.filterObject[data].ACTION === 'ENABLE') {
                this.enablePayload.push(this.filterObject[data].NodeName);
            }
            this.deleteData = {
                'userName': this.user,
                'enableNodesList': this.enablePayload,
                'disableNodesList': this.disablePayload
            };
            this.deleteDataPayload[this.filterObject[data].NodeName + this.filterObject[data].ACTION] = this.filterObject[data];
            this.sortingOnDeletion();
        },

        emptyDataMessage: function() {
            this.inlineMessage = new InlineMessage({
                header: i18n.get('NOTIFICATION_PANEL.EMPTY'),
                description: i18n.get('NOTIFICATION_PANEL.EMPTY_DESCRIPTION')
            });
            this.inlineMessage.attachTo(this.view.getEmptyMessage());
        },

        createTable: function() {
            if (!this.table) {
                this.table = new Table({
                    plugins: [],
                    tooltips: false,
                    columns: [{
                        sortable: true,
                        cellType: ProgressCell,
                    },
                    {
                        attribute: 'STATUS',
                        width: '20px',
                        cellType: ResultCell,
                    }],
                });
            }
            this.table.attachTo(this.view.getProgress());
        },

        setWebPushData: function(notifications) {
            if (this.inlineMessage) {
                this.inlineMessage.destroy();
            }

            if (this.clearButton) {
                this.clearButton.destroy();
            }

            if (notifications && notifications.length <= 0) {
                this.emptyDataMessage();
                return;
            }

            this.clearTasksButton();

            if (notifications && notifications.length > 0) {
                notifications.forEach(function(options) {
                    if (options.STATUS === 'DELETE') {
                        delete this.progressObject[options.NodeName + options.ACTION];
                        this.filterObject = [];
                        for (var key_d in this.progressObject) {
                            this.filterObject.unshift(this.progressObject[key_d]);
                        }
                    } else if (this.progressObject.hasOwnProperty(options.NodeName + options.ACTION) === true) {
                        this.progressObject[options.NodeName + options.ACTION] = options;
                        this.filterObject = [];
                        for (var key in this.progressObject) {
                            this.filterObject.unshift(this.progressObject[key]);
                        }
                    } else {
                        this.progressObject[options.NodeName + options.ACTION] = options;
                        this.filterObject.unshift(options);
                    }
                }.bind(this));
            }

            if (this.filterObject.length > 0) {
                this.createTable();
                this.table.topologyName = this.topologyDropdownValue.name;
                this.table.topologyValue = this.topologyDropdownValue.value;
                this.filterObject.sort(function(a, b) {
                    return b.START_TIME - a.START_TIME;
                });
                this.addManagedElementPoIdToFilterObjects(this.filterObject);
                this.table.setData(this.filterObject);
            } else {
                this.filterObject = [];
                if (this.table) {
                    this.table.destroy();
                }
                if (this.clearButton) {
                    this.clearButton.destroy();
                }
                if (!this.emptyDataMessage) {
                    this.emptyDataMessage();
                }
            }
        },

        clearCompletedTasks: function() {
            this.deleteDataPayload = {};
            this.deleteData = {};
            this.enablePayload = [];
            this.disablePayload = [];
            this.completedTasksObj = [];
            for (var key in this.progressObject) {
                if (this.progressObject[key].PROGRESS === 100 || this.progressObject[key].STATUS === i18n.get('SUPERVISION.FAIL') || this.progressObject[key].STATUS === i18n.get('SUPERVISION.FAILED') || this.progressObject[key].STATUS === i18n.get('SUPERVISION.INTERRUPTED')) {
                    this.completedTasksObj.push(this.progressObject[key]);
                    this.deleteDataPayload[key] = this.progressObject[key];
                    if (this.progressObject[key].ACTION === 'ENABLE') {
                        this.enablePayload.push(this.progressObject[key].NodeName);
                    } else if (this.progressObject[key].ACTION === 'DISABLE') {
                        this.disablePayload.push(this.progressObject[key].NodeName);
                    }
                } else {
                    this.filterObject.push(this.progressObject[key]);
                }
            }
            this.deleteData = {
                'userName': this.user,
                'enableNodesList': this.enablePayload,
                'disableNodesList': this.disablePayload
            };
            this.sortingOnDeletion();
        },

        sortingOnDeletion: function() {
            this.showLoader();
            return Rest.deleteNotifyData(this.deleteData)
                .then(function(status) {
                    if (status === 'SUCCESS') {
                        this.filterObject = [];
                        for (var keys in this.deleteDataPayload) {
                            delete this.progressObject[keys];
                        }
                        for (var key in this.progressObject) {
                            this.filterObject.push(this.progressObject[key]);
                        }
                        if (this.filterObject.length > 0) {
                            this.filterObject.sort(function(a, b) {
                                return b.START_TIME - a.START_TIME;
                            });
                            this.table.setData(this.filterObject);
                        } else {
                            this.filterObject = [];
                            if (this.table) {
                                this.table.destroy();
                            }
                            if (this.clearButton) {
                                this.clearButton.destroy();
                            }
                            this.emptyDataMessage();
                        }
                    }
                    this.hideLoader();
                }.bind(this))
                .catch(function(error) {
                    this.hideLoader();
                    Utils.showDialog('error', error.message, error.body);
                }.bind(this));
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
        },

        addManagedElementPoIdToFilterObjects: function(filterObjects) {
            if (this.tree) {
                Object.keys(this.tree).forEach(function(key) {
                    var nodeLabel = this.tree[key].label;
                    var nodePoid = this.tree[key].id;
                    var nodeParent = this.tree[key].parent;
                    filterObjects.forEach(function(object) {
                        var filterObjectName = object.NodeName;
                        if (nodeLabel === filterObjectName) {
                            object.managedElementPoId = nodePoid;
                            object.parent = nodeParent;
                        }
                    });
                }.bind(this));
            }
        }
    });
});
