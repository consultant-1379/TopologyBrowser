define([
    'i18n!networkobjectlib/dictionary.json',
    './Constants',
    'widgets/Dialog',
    'networkobjectlib/widgets/DialogContent/DialogContent',
    'i18n/AdvancedDateTime'
], function(i18n, Constants, Dialog, DialogContent, advDateTime) {

    var separator = ':';

    return {
        /**
         * converts response object to memory object.
         * response object -  {"id":"281474978659428","parentId":null,"name":"Transport Topology","category":"Public","type":"BRANCH"}
         * memory object - {"id":"281474978659428", "name":"Transport Topology", "parent":null,"children":0, "offset":1, "category":"Public","type":"BRANCH"}
         * @method convertToMemoryItem
         * @private
         * @param object
         * @param parentId
         * @returns {Object}
         */
        convertToMemoryItem: function(object, parentId) {
            var id;
            var parentPoid = null;
            if (parentId !== null) {
                parentPoid = String(this.getChildPoid(parentId));
            }

            if (this.isNoChildrenObject(this.getChildPoid(object.id))) {
                //Same as old id for noChildrenObject. eg: noChildrenObject.id = -910001, where 10001 is parentId
                id = String(object.id);
            } else {
                id = parentPoid + ':' + String(object.id);
            }

            var objectName = object.name ? object.name.trim() : object.moName;
            var children = 1;

            if (object.noOfChildrens < 0) {
                children = 0;
            } else if (object.noOfChildrens > 0) {
                children = object.noOfChildrens;
            }

            // Handling > symbol for expansion in tree
            //TODO: Check this for non Collection(LEAF/BRANCH) when integrating with TopologyTree
            if (!this.isCollection(object)) {
                children = 0;
            }

            // todo: this is a workaround until actionlibrary is updated.
            //  v4 does not return a level but some actions need it to work
            if (object.isCustomTopology !== undefined && object.isCustomTopology !== true) {
                object.level = 1;
            }

            return {
                id: id,
                label: objectName,
                parent: parentId ? String(parentId) : null,
                children: children,
                offset: object.offset ? object.offset : 0,
                type: object.type ? object.type : object.moType,
                subType: object.subType ? object.subType : null,
                neType: object.neType,
                syncStatus: object.syncStatus,
                managementState: object.managementState,
                radioAccessTechnology: object.radioAccessTechnology,
                level: object.level ? object.level : 0,
                category: object.category ? object.category : object.sharing,
                query: object.query,
                contentsUpdatedTime: this.getContentsUpdatedString(object),
                parentMoType: object.parentMoType,
                stereotypes: object.stereotypes ? object.stereotypes : [],
                hybrid: object.hybrid ? object.hybrid : null,
                totalNodeCount: object.totalNodeCount
            };
        },

        /**
         * Create NoChildrenObject
         *
         * @method createNoChildrenObject
         * @param parentId
         * @return {Object}
         */
        createNoChildrenObject: function(parentId) {
            var id = Constants.NO_CHILDREN_POID_PREFIX + this.getChildPoid(parentId);
            return this.convertToMemoryItem({
                id: id,
                name: i18n.tree.nodes.noChildren,
                moName: i18n.tree.nodes.noChildren,
                moType: null,
                noOfChildrens: -1,
                parentId: parentId
            }, parentId);
        },

        /**
         * converts memory object to object to be sent to dataviz
         * @method convertToTreeItem
         * @private
         * @param object
         * @returns {Object}
         */
        convertToTreeItem: function(object, memory) {
            if (object.neType !== undefined && (object.neType === 'Unmanaged' || object.neType === 'VirtualSubnetwork')) {
                object.syncStatus = i18n.get('notsupported');
            }
            var parent = memory.get(object.parent);
            var isObjectCollection = this.isLeafCollection(parent) || this.isSearchCriteriaCollection(parent) || this.isBranchCollection(parent);
            var isNode = !!parent && (this.isNodeLevel(object.type, parent.id, parent.type) || isObjectCollection && object.parentMoType !== 'MeContext');
            var icon = this.getIcon(object.id, object.type, object.subType, object.neType, object.query, isNode, object.hybrid);
            //TODO enable this for leaf nodes
            var syncStatus = this.getSyncStatus(object.syncStatus);
            var managementState = this.getManagementState(object.managementState);

            return {
                id: object.id,
                label: object.label,
                parent: object.parent,
                children: object.children ? object.children : 0,
                collectionType: this.getCollectionType(object),
                type: this.isCollection(object) ? null : object.type,
                subType: object.subType,
                neType: object.neType,
                icon: icon.icon,
                iconTitle: icon.title,
                level: object.level,
                query: object.query,
                contentsUpdatedTime: object.contentsUpdatedTime,
                syncStatusIcon: syncStatus.icon,
                syncStatusTitle: syncStatus.title,
                managementStateIcon: managementState.icon,
                managementStateTitle: managementState.title,
                radioAccessTechnology: object.radioAccessTechnology,
                stereotypes: object.stereotypes,
                totalNodeCount: object.totalNodeCount,
                showNodeCount: object.showNodeCount
            };
        },

        extractEnumMember: function(currentValue) {
            if (typeof currentValue === 'string' && currentValue.indexOf('$$$') !== -1) {
                return currentValue.split('$$$')[1];
            }
            return currentValue;
        },

        getDescriptionWithNamespace: function(enumMember) {
            if (enumMember.key.indexOf('$$$') !== -1) {
                return enumMember.description + ' | nameSpace: ' + enumMember.key;
            }
            return enumMember.description;
        },

        getEnumMemberDescription: function(changed,original,isOriginalValue) {
            var value = isOriginalValue ? changed.origValue : changed.value;
            if (typeof value === 'string' && changed.type === 'ENUM_REF' || changed.datatype === 'ENUM_REF') {
                return original.enumeration.enumMembers.map(function(member) {
                    if (value === member.value) {
                        return member.description + ' | nameSpace: ' + value;
                    }
                }).filter(function(member) {
                    return member !== undefined;
                });
            }
            return changed.value;
        },

        getValueArray: function(value, description) {
            return [value,description];
        },

        getCollectionType: function(object) {
            if (this.isBranchCollection(object)) {
                return 'BRANCH';
            }
            else if (this.isLeafCollection(object)) {
                return 'LEAF';
            }
            else if (this.isSearchCriteriaCollection(object)) {
                return 'SEARCH_CRITERIA';
            }
            return null;
        },

        getIcon: function(poid, type, subType, iconType, query, isNode, hybrid) {
            if (type === 'VirtualNetworkFunctionManager') {
                iconType = 'RVNFM';
            }
            else if (type === 'VirtualInfrastructureManager') {
                iconType = 'VIM';
            } else if (type === 'BRANCH' || subType === 'BRANCH') {
                return {icon: 'ebIcon_folderGroup', title: i18n.branchTitle};
            } else if (type === 'LEAF' && hybrid) {
                return {icon: 'ebIcon_folderGroup', title: i18n.hybridCollectionTitle};
            }
            if (poid === Constants.ALL_OTHER_NODES_POID) {
                return { icon: 'ebIcon_folder', title: ''};
            } else if (type === 'BRANCH' || subType === 'BRANCH') {
                return {icon: 'ebIcon_folderGroup', title: 'Transport Topology'};
            } else if (query || subType === 'SEARCH_CRITERIA') {
                return {icon: 'ebIcon_folderSearch', title: i18n.leafTitle};
            } else if (type === 'LEAF' || subType === 'LEAF') {
                return {icon: 'ebIcon_folder', title: i18n.leafTitle};
            } else if (this.isNoChildrenObject(poid)) {
                return {icon: null, title: ''};
            } else if (type === 'SubNetwork') {
                return {icon: 'ebIcon_network', title: 'SubNetwork'};
            } else if (!isNode && type !== 'NetworkElement' && type !== 'VirtualNetworkFunctionManager' && type !== 'VirtualInfrastructureManager') {
                return {icon: 'ebIcon_mo', title: ''};
            }


            switch (iconType ? iconType : type) {
            case 'RBS':
            case 'ERBS':
            case 'MSRBS_V1':
            case 'MSRBS_V2':
            case 'RadioNode':
            case 'RadioTNode':
            case '5GRadioNode':
            case 'VTFRadioNode':
            case 'vDU':
            case 'vCU-UP':
            case 'vCU-CP':
                return {icon: 'ebIcon_rbs', title: iconType};

            case 'ORadio':
                return {icon: 'ebIcon_O-RU', title: iconType};

            case 'O1Node':
                return {icon: 'ebIcon_O-RU', title: iconType};

            case 'MGW':
            case 'SIU02':
            case 'TCU02':
            case 'SSR':
            case 'vBNG':
            case 'JUNIPER-MX':
            case 'JUNIPER-SRX':
            case 'JUNIPER-PTX':
            case 'JUNIPER-vMX':
            case 'JUNIPER-vSRX':
            case 'Router 6K':
            case 'Router6672':
            case 'Router6675':
            case 'Router6273':
            case 'Router6673':
            case 'Router6274':
            case 'Router6x71':
            case 'Router6000-2':
            case 'Router8800':
            case 'CISCO-ASR900':
            case 'CISCO-ASR9000':
            case 'Media Gateway':
            case 'FRONTHAUL-6080':
            case 'FRONTHAUL-6020':
                return {icon: 'ebIcon_switch', title: iconType};

            case 'RNC':
            case 'CSCF':
            case 'RnNode':
            case 'CSCF-TSP':
            case 'SGSN-MME':
            case 'RVNFM':
            case 'VIM':
            case 'vRC':
                return {icon: 'ebIcon_controllingNode', title: iconType};

            case 'vPP':
            case 'vSD':
            case 'vRM':
            case 'vRSM':
            case 'UDM-AUSF':
            case 'UDR':
            case 'NSSF':
            case 'NRF':
            case 'CCPC':
            case 'CCRC':
            case 'CCSM':
            case 'SC':
            case 'CCES':
            case 'SMSF':
                return {icon: 'ebIcon_controllingNode', title: iconType};
            case 'Shared-CNF':
                return {icon: 'ebIcon_multipleFunctions', title: iconType};
            case 'CCDM':
                return {icon: 'ebIcon_database', title: iconType};
            case 'EDA' :
                return {icon: 'ebIcon_controllerGateway', title: iconType};

            case 'MINI-LINK-6351':
            case 'MINI-LINK-6352':
            case 'MINI-LINK-6366':
            case 'MINI-LINK-665x':
            case 'MINI-LINK-669x':
            case 'MINI-LINK-MW2':
            case 'MINI-LINK-CN210':
            case 'MINI-LINK-CN510R1':
            case 'MINI-LINK-CN510R2':
            case 'MINI-LINK-CN810R1':
            case 'MINI-LINK-CN810R2':
            case 'MINI-LINK-Indoor':
            case 'MINI-LINK-PT2020':
            case 'Switch-6391':
            case 'Fronthaul-6392':
                return {icon: 'ebIcon_microwave', title: iconType};

            case 'BSC':
            case 'bsc':
                return {icon: 'ebIcon_bsc', title: iconType};
            case 'Controller6610':
                return {icon: 'ebIcon_siteEnergyController', title: iconType};
            case 'Unmanaged':
                return {icon: 'ebIcon_networkElement', title: iconType};
            case 'VirtualSubnetwork':
                return {icon: 'ebIcon_network', title: iconType};
            case null:
            case undefined:
                return {icon: ['ebIcon_refresh', 'ebIcon_disabled'], title: ''};

            default:
                return {icon: 'ebIcon_mo', title: ''};
            }
        },

        /**
         * utility method to validate the poid
         *
         * @method isRootPoId
         * @private
         * @param poid input to validate
         * @returns {boolean}
         */
        isRootPoId: function(poid, customTopologyId) {
            return (poid === null || typeof poid === 'undefined' || poid === '' || poid === customTopologyId);
        },

        /**
         * returns if the specified mo is at node level
         * @param moType
         * @param parentId
         * @param parentType
         * @returns {boolean}
         */
        isNodeLevel: function(moType, parentId, parentType) {
            return (parentId === Constants.ALL_OTHER_NODES_POID) || (parentType === 'SubNetwork' && moType !== 'SubNetwork');
        },

        /**
         * checks if poid passed is a No children poid (starts with NO_CHILDREN_POID_PREFIX)
         *
         * @method isNoChildrenObject
         * @private
         * @param poid
         * @returns {boolean}
         */
        isNoChildrenObject: function(poid) {
            return (typeof poid === 'string') && (poid.substr(0, Constants.NO_CHILDREN_POID_PREFIX.length) === Constants.NO_CHILDREN_POID_PREFIX);
        },

        /**
         * return index and value to be sorted on a list to increase performance
         *
         * @method getSortable
         * @public
         * @param items
         * @returns {*}
         */
        getSortable: function(items) {
            return items.map(function(e, i) {
                // natural sort by default for alphanumeric numbers
                var padding = '';
                // pad numbers to have natural sort for numbers
                if (/^\d+$/.test(e.label)) {
                    padding = '0000000000';
                }
                var type = this.isSearchCriteriaCollection(e) ? 'LEAF' : this.getObjectType(e);
                var value = (type + '-' + e.label).replace(/\d+/g, function(m) {
                    return padding.substr(m.length - 1) + m;
                });
                return {index: i, value: value.trim().toLowerCase()};
            }.bind(this));
        },

        /**
         * return list of objects to be reloaded in order to current dataviz widget viewport request
         *
         * @method getSorted
         * @public
         * @param items
         * @returns {*}
         */
        getSorted: function(items) {
            // temporary array holds objects with position and sort-value
            var sortable = this.getSortable(items);

            // sorting the mapped array containing the reduced values
            sortable.sort(function(a, b) {
                return +(a.value > b.value) || +(a.value === b.value) - 1;
            }.bind(this));

            return sortable.map(function(e) {
                return items[e.index];
            });
        },

        isCollection: function(object) {
            return (object.type === 'NESTED' || object.type === 'BRANCH' || object.type === 'LEAF');
        },

        isNetworkObject: function(object) {
            return object && !this.isCollection(object);
        },

        isBranchCollection: function(object) {
            return object && (object.type === 'BRANCH' || object.subType === 'BRANCH');
        },

        isLeafCollection: function(object) {
            return object && (object.type === 'LEAF' ||  object.subType === 'LEAF');
        },

        isSearchCriteriaCollection: function(object) {
            return object && (object.subType === 'SEARCH_CRITERIA' || object.query);
        },

        isObjectBasedCollection: function(object) {
            return this.isLeafCollection(object) || this.isSearchCriteriaCollection(object);
        },

        convertTimestampToString: function(timestamp) {
            if (timestamp) {
                var timeString = new Date(parseInt(timestamp, 10));
                return advDateTime(timeString).format('DT');
            }
            return undefined;
        },

        getContentsUpdatedString: function(object) {
            if (this.isObjectBasedCollection(object)) {
                if (object.contentsUpdatedTime) {
                    return this.convertTimestampToString(object.contentsUpdatedTime);
                } else if (object.timeUpdated) {
                    return this.convertTimestampToString(object.timeUpdated);
                } else {
                    return this.convertTimestampToString(object.timeCreated);
                }
            } else {
                return undefined;
            }
        },

        getObjectTypeForSelection: function(object) {
            if (object && this.isCollection(object)) {
                // LEAF and SearchCriteria collections are to be considered same type for selection processing
                if (this.isBranchCollection(object)) {
                    if (object.type === 'BRANCH') {
                        return object.type.toLowerCase();
                    }
                    return object.subType.toLowerCase();
                } else {
                    return 'leaf';
                }
            } else {
                return 'node';
            }
        },

        /**
         * get syncStatus icon and title
         *
         * @private
         * @method getSyncStatus
         * @param syncStatus
         * @returns {Object} icon and title
         */
        getSyncStatus: function(syncStatus) {
            switch (syncStatus) {
            case 'UNSYNCHRONIZED':
                return {icon: 'ebIcon_syncError', title: i18n.get('unsynchronized')};
            case 'NOT_SUPPORTED':
                return {icon: 'ebIcon_sync_notSupported', title: i18n.get('notsupported')};
            case 'DELTA':
            case 'PENDING':
            case 'TOPOLOGY':
            case 'ATTRIBUTE':
                return {icon: 'ebIcon_syncing_animated', title: i18n.get('synchronizing')};
            /* falls through */
            default:
                return {icon: null, title: ''};
            }
        },

        /**
         * get managementState icon and title
         *
         * @private
         * @method getManagementState
         * @param managementState
         * @returns {Object} icon and title
         */
        getManagementState: function(managementState) {
            if (managementState === 'MAINTENANCE') {
                return {icon: 'ebIcon_maintenanceMode', title: i18n.nodeMaintenanceMsg};
            } else {
                return {icon: null, title: ''};
            }
        },

        createDialog: function(type, header, content, dialogOnClickOK, dialogOnClickCCancel, optionalContent) {
            var buttons = [
                {
                    caption: i18n.buttons.ok,
                    action: function() {
                        modalDialog.destroy();

                        if (typeof dialogOnClickOK === 'function') {
                            dialogOnClickOK();
                        }
                    }
                }
            ];

            if (dialogOnClickCCancel) {
                buttons.push({
                    caption: i18n.buttons.cancel,
                    action: function() {
                        modalDialog.destroy();

                        if (typeof dialogOnClickCCancel === 'function') {
                            dialogOnClickCCancel();
                        }
                    }
                });
            }

            var dialogContent = new DialogContent({
                content: content
            });
            var modalDialog = new Dialog({
                header: header,
                content: dialogContent,
                type: type,
                buttons: buttons,
                optionalContent: optionalContent
            });
            return modalDialog;
        },

        getChildPoid: function(compositeKey) {
            if (typeof compositeKey === 'string') {
                var splitResults = compositeKey.split(separator);
                // Not a compositeKey, return it back
                if (splitResults.length === 1) {
                    return splitResults[0];
                } else {
                    //compositeKey so return child part of the key
                    return splitResults[1];
                }
            } else {
                return '';
            }
        },

        getParentPoid: function(compositeKey) {
            if (typeof compositeKey === 'string') {
                // Not a compositeKey, return it back otherwise return parent part of the key
                return compositeKey.split(separator)[0];
            } else {
                return '';
            }
        },

        prepareFullPath: function(parents) {
            var fullPath = '';
            parents.forEach(function(parent, index) {
                if (index !== 0) {
                    fullPath = ':' + fullPath;
                }
                fullPath =  parent + fullPath;
            });
            return fullPath;
        },

        isObject: function(obj) {
            return (typeof obj === 'object') && obj !== null && !Array.isArray(obj);
        },

        waitFor: function(ms) {
            return new Promise(function(resolve) {
                setTimeout(resolve, ms);
            });
        },

        getObjectType: function(object) {
            if (object) {
                if (this.isCollection(object) && object.subType) {
                    return object.subType;
                } else {
                    return object.type;
                }
            }
        },

        getElementByProperty: function(array, property, matching) {
            var node;
            array.forEach(function(item) {
                if (item[property]===matching) {
                    node = item;
                }
            });
            return node;
        }
    };
});
