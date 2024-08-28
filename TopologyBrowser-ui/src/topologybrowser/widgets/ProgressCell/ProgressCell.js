define([
    'tablelib/Cell',
    'widgets/ProgressBar',
    '../LabelWidget/LabelWidget',
    'widgets/Button',
    'tablelib/Table',
    'networkobjectlib/utils/TopologyUtility',
    'widgets/Notification',
    'i18n!topologybrowser/app.json',
    'widgets/Dialog',
    'container/api',
    './ProgressCellView',
    'networkobjectlib/utils/Constants',
    '../../utils/Utils',
    '../Supervision/Rest'
], function(Cell, ProgressBar, LabelWidget, Button, Table, TopologyUtility, Notification, i18n, Dialog, container, View, Constants, Utils, SupervisionRest) {
    'use strict';
    var WidgetCell = Cell.extend({
        View: View,

        init: function(options) {
            this.options = options;
        },

        onCellReady: function() {
            this.progressObject = this.getRow().getData();

            for (var key in this.progressObject) {
                if (this.progressObject[key] === true) {
                    this.progressObject[key] = i18n.get('NOTIFICATION_PANEL.ENABLED');
                } else if (this.progressObject[key] === false) {
                    this.progressObject[key] = i18n.get('NOTIFICATION_PANEL.DISABLED');
                }
            }

            this.supervisionType = new LabelWidget({
                label: this.progressObject.ACTION + ' ' + i18n.get('NOTIFICATION_PANEL.SUPERVISION'),
            });

            var timestamp = this.progressObject.CURRENT_TIME * 1000;
            this.dateTime = TopologyUtility.convertTimestampToString(timestamp);
            this.NodeName = new LabelWidget({
                label: this.progressObject.NodeName,
            });

            this.viewButton = new Button({
                caption: i18n.get('NOTIFICATION_PANEL.VIEWSTATUS'),
                name: this.progressObject.NodeName,
                modifiers: [{}, {
                    name: 'color',
                    value: 'default'
                }]
            });

            this.infoNotification = new Notification({
                label: this.progressObject.ERROR,
                content: 'info',
                color: 'red',
                autoDismiss: false,
                icon: 'error',
            });

            this.linksTable = new Table({
                modifiers: [],
                data: [
                    {col1: i18n.get('NOTIFICATION_PANEL.PM'), col2: this.progressObject.PerformanceSupervision},
                    {
                        col1: i18n.get('NOTIFICATION_PANEL.CM'),
                        col2: this.progressObject.ConfigurationManagementSupervision
                    },
                    {col1: i18n.get('NOTIFICATION_PANEL.IS'), col2: this.progressObject.InventorySupervision},
                    {col1: i18n.get('NOTIFICATION_PANEL.FM'), col2: this.progressObject.FaultManagementSupervision},

                ],
                columns: [
                    {title: 'Supervision', attribute: 'col1', width: '150px'},
                    {title: 'Status', attribute: 'col2', width: '150px'},
                ]
            });

            this.progressBar = new ProgressBar({});

            if ((this.progressObject.PROGRESS !== null) && (this.progressObject.status !== null)) {
                this.supervisionType.attachTo(this.getElement());
                this.NodeName.attachTo(this.getElement());
                this.view.getLabel().setAttribute('class', 'eaTopologyBrowser-wLabelWidget-actionLabel ebLabel-text');
                this.view.getLabel().setAttribute('style', 'font-weight:bold');

                this.progressBar.attachTo(this.getElement());
                this.infoNotification.attachTo(this.getElement());
                this.view.getNotification().setAttribute('style', 'width:100%;display:block');

                if (this.progressObject.ERROR === null || this.progressObject.ERROR === '' || this.progressObject.ERROR === undefined) {
                    if (this.infoNotification) {
                        this.infoNotification.destroy();
                    }
                }
                this.viewButton.attachTo(this.getElement());
                this.viewButton.addEventHandler('click', this.viewStatus.bind(this));
                this.view.getButton().setAttribute('style', 'margin:10px 10px 10px 0');
                this.view.getElement().setAttribute('style', 'padding-left: 3px');
                
                if (this.options.table.topologyName === 'Network Data' || this.options.table.topologyName === 'Transport Topology') {
                    this.locateButton = new Button({
                        caption: i18n.get('NOTIFICATION_PANEL.LOCATENODE'),
                        name: this.progressObject.NodeName,
                        modifiers: [{
                        }, {
                            name: 'color',
                            value: 'default'
                        }]

                    });
                    this.locateButton.attachTo(this.getElement());
                    this.locateButton.addEventHandler('click', this.locateNode.bind(this));
                }
            }
        },

        viewStatus: function() {
            this.modalDialog = new Dialog({
                header: this.progressObject.ACTION + ' ' + i18n.get('NOTIFICATION_PANEL.SUPERVISION'),
                optionalContent: this.linksTable,
                content: this.progressObject.NodeName,
                buttons: [
                    {
                        caption: 'Close',
                        color: 'darkBlue',
                        action: function() {
                            this.modalDialog.hide();
                        }.bind(this)
                    }
                ],
            });
            this.modalDialog.show();
        },

        locateNode: function() {
            container.getEventBus().publish('flyout:hide');
            if (this.options.table.topologyName === 'Transport Topology') {
                SupervisionRest.getPOByQueryStringCustomTopology(this.options.table.topologyValue, this.progressObject.NodeName)
                    .then(function(data) {
                        if (data && data.length === 0) {
                            Utils.showDialog('error', i18n.get('errors.persistentObjectNotFound.title'), i18n.get('errors.persistentObjectNotFound.body'));
                            return;
                        }

                        var transformedIds = transformIds(data[0].path);
                        var lastSelectedId = transformedIds.pop();
                        var searchIndexId = lastSelectedId.split(':')[1] + ':' + data[0].poId;
                        transformedIds.push(lastSelectedId);

                        var topologyState = {
                            lastSelectionId: searchIndexId,
                            selectionIds: [searchIndexId],
                            expansionIds: transformedIds,
                            isHardRefresh: true
                        };

                        this.progressObject.eventbus.publish('topologyTree:refresh', topologyState);
                    }.bind(this))
                    .catch(function(error) {
                        Utils.showDialog('error', error.title, error.body);
                    }.bind(this));
            } else {
                if (!this.progressObject.managedElementPoId) {
                    Utils.showDialog('error', i18n.get('errors.persistentObjectNotFound.title'), i18n.get('errors.persistentObjectNotFound.body'));
                } else {
                    this.progressObject.eventbus.publish('topologyHeader:topologyDropdown:change', {
                        select: Constants.NETWORK_DATA,
                        poid: this.progressObject.managedElementPoId
                    });
                }

            }
        },

        setValue: function() {
            if (this.progressObject.PROGRESS !== null) {
                this.progressBar.setValue(this.progressObject.PROGRESS);
                this.progressBar.setLabel(this.dateTime);
            }

            switch (this.progressObject.STATUS) {
            case i18n.get('SUPERVISION.SUCCESS'):
                this.progressBar.setColor('green');
                break;
            case i18n.get('SUPERVISION.IN_PROGRESS'):
                this.progressBar.setColor('paleBlue');
                break;
            case i18n.get('SUPERVISION.CANCELED'):
                this.progressBar.setColor('orange');
                break;
            case i18n.get('SUPERVISION.FAILED'):
            case i18n.get('SUPERVISION.FAIL'):
            case i18n.get('SUPERVISION.INTERRUPTED'):
                this.progressBar.setColor('red');
                break;
            default:
                this.progressBar.setColor('paleBlue');
            }
        }
    });

    function transformIds(ids) {
        return ids.map(function(element, index, array) {
            if (index === 0) {
                return 'null:' + element;
            } else {
                return array[index - 1] + ':' + element;
            }
        });
    }

    return WidgetCell;
});
