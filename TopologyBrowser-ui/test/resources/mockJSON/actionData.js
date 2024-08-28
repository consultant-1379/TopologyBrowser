
if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {
        branchActionRequestData: {
            'application': 'topologybrowser',
            'multipleSelection': false,
            'conditions': [
                {
                    'dataType': 'Collection',
                    'properties': [
                        {
                            'name': 'subType',
                            'value': 'BRANCH'
                        }
                    ]
                }
            ]
        },
        leafActionRequestData: {
            'application': 'topologybrowser',
            'multipleSelection': false,
            'conditions': [
                {
                    'dataType': 'Collection',
                    'properties': [
                        {
                            'name': 'subType',
                            'value': 'LEAF'
                        }
                    ]
                }
            ]
        },
        subNetworkRequestData: {
            'application': 'topologybrowser',
            'multipleSelection': false,
            'conditions': [
                {
                    'dataType': 'ManagedObject',
                    'properties': [
                        {
                            'name': 'type',
                            'value': 'SubNetwork'
                        }
                    ]
                }
            ]
        },
        nodeRequestData: {
            'application': 'topologybrowser',
            'multipleSelection': false,
            'conditions': [
                {
                    'dataType': 'ManagedObject',
                    'properties': [
                        {
                            'name': 'type',
                            'value': 'MeContext'
                        },
                        {
                            'name': 'neType',
                            'value': 'ERBS'
                        }
                    ]
                }
            ]
        },
        multiCollectionRequestData: {
            'application': 'topologybrowser',
            'multipleSelection': true,
            'conditions': [
                {
                    'dataType': 'Collection',
                    'properties': [
                        {
                            'name': 'subType',
                            'value': 'LEAF'
                        }
                    ]
                },
                {
                    'dataType': 'Collection',
                    'properties': [
                        {
                            'name': 'subType',
                            'value': 'BRANCH'
                        }
                    ]
                }
            ]
        },
        //TODO update to have delete, rename and other remaining actions available for UDT

        // ACTION RESPONSE SECTION
        rootActionResponseData: {
            'actions': [
                {
                    'defaultLabel': 'Create Collection',
                    'name': 'networkexplorer-create-nested-collection',
                    'plugin': 'networkexplorer/networkexplorer-create-nested-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Actions',
                    'order': 100
                },
                {
                    "defaultLabel": "Create Private Network",
                    "name": "networkexplorer-create-private-network",
                    "multipleSelection": false,
                    "plugin": "networkexplorer/networkexplorer-create-private-network",
                    "category": "Collection Actions",
                    "order": 110
                }
            ],
            'action-matches': {
                'conditions': [
                    {
                        'dataType': 'Collection',
                        'properties': [
                            {
                                'name': 'subType',
                                'value': 'BRANCH'
                            }
                        ]
                    }
                ],
                'application': 'topologybrowser',
                'multipleSelection': false
            }
        },
        branchActionResponseData: {
            'actions': [
                {
                    'defaultLabel': 'Create Collection',
                    'name': 'networkexplorer-create-nested-collection',
                    'plugin': 'networkexplorer/networkexplorer-create-nested-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Actions',
                    'order': 100
                },
                {
                    "defaultLabel": "Create Private Network",
                    "name": "networkexplorer-create-private-network",
                    "multipleSelection": false,
                    "plugin": "networkexplorer/networkexplorer-create-private-network",
                    "category": "Collection Actions",
                    "order": 110
                },
                {
                    'defaultLabel': 'Rename',
                    'name': 'networkexplorer-delete-collection',
                    'plugin': 'networkexplorer/networkexplorer-rename-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 200
                },
                {
                    'defaultLabel': 'Delete',
                    'name': 'networkexplorer-delete-collections',
                    'plugin': 'networkexplorer/networkexplorer-delete-collections',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 300
                },
                {
                    'defaultLabel': 'Export Topology',
                    'name': 'networkexplorer-export-topology',
                    'plugin': 'networkexplorer/networkexplorer-export-topology',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'category': 'Collection Actions',
                    'order': 200
                }
            ],
            'action-matches': {
                'conditions': [
                    {
                        'dataType': 'Collection',
                        'properties': [
                            {
                                'name': 'subType',
                                'value': 'BRANCH'
                            }
                        ]
                    }
                ],
                'application': 'topologybrowser',
                'multipleSelection': false
            }
        },
        leafActionResponseData: {
            'actions': [
                {
                    'defaultLabel': 'Add Topology Data',
                    'name': 'networkexplorer-add-topology-data',
                    'plugin': 'networkexplorer/networkexplorer-add-topology-data',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 100
                },
                {
                    'defaultLabel': 'Delete',
                    'name': 'networkexplorer-delete-collections',
                    'plugin': 'networkexplorer/networkexplorer-delete-collections',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 300
                },
                {
                    'defaultLabel': 'Rename',
                    'name': 'networkexplorer-delete-collection',
                    'plugin': 'networkexplorer/networkexplorer-rename-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 200
                },
                {
                    'defaultLabel': 'Remove from Collection',
                    'name': 'networkexplorer-remove-leaf-collection',
                    'plugin': 'networkexplorer/networkexplorer-remove-leaf-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': true,
                    'category': 'Collection Modification Actions',
                    'order': 250
                },
                {
                    'defaultLabel': 'Export Collection',
                    'name': 'networkexplorer-export-collection',
                    'plugin': 'networkexplorer/networkexplorer-export-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'category': 'Collection Actions',
                    'order': 201
                }
            ],
            'action-matches': {
                'conditions': [
                    {
                        'dataType': 'Collection',
                        'properties': [
                            {
                                'name': 'subType',
                                'value': 'LEAF'
                            }
                        ]
                    }
                ],
                'application': 'topologybrowser',
                'multipleSelection': false
            }
        },
        searchCriteriaActionResponseData: {
            'actions': [
                {
                    'defaultLabel': 'Update Contents',
                    'name': 'networkexplorer-update-search-criteria-collection-contents',
                    'plugin': 'networkexplorer/networkexplorer-update-search-criteria-collection-contents',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 130
                },{
                    "defaultLabel": "Edit Criteria",
                    "name": "networkexplorer-edit-search-criteria-collection",
                    "multipleSelection": false,
                    "plugin": "networkexplorer/networkexplorer-edit-search-criteria-collection",
                    "category": "Collection Modification Actions",
                    "order": 120
                },
                {
                    'defaultLabel': 'Delete',
                    'name': 'networkexplorer-delete-collections',
                    'plugin': 'networkexplorer/networkexplorer-delete-collections',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 300
                },
                {
                    'defaultLabel': 'Rename',
                    'name': 'networkexplorer-delete-collection',
                    'plugin': 'networkexplorer/networkexplorer-rename-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'primary': false,
                    'category': 'Collection Modification Actions',
                    'order': 200
                },
                {
                    'defaultLabel': 'Remove from Collection',
                    'name': 'networkexplorer-remove-leaf-collection',
                    'plugin': 'networkexplorer/networkexplorer-remove-leaf-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': true,
                    'category': 'Collection Modification Actions',
                    'order': 250
                },
                {
                    'defaultLabel': 'Export Collection',
                    'name': 'networkexplorer-export-collection',
                    'plugin': 'networkexplorer/networkexplorer-export-collection',
                    'applicationId': 'networkexplorer',
                    'multipleSelection': false,
                    'category': 'Collection Actions',
                    'order': 201
                }
            ],
            'action-matches': {
                'conditions': [
                    {
                        'dataType': 'Collection',
                        'properties': [
                            {
                                'name': 'subType',
                                'value': 'SEARCH_CRITERIA'
                            }
                        ]
                    }
                ],
                'application': 'topologybrowser',
                'multipleSelection': false
            }
        },
        multiSelectCollectionData: {
            //TODO add response data to multi select
            'actions': [],
            'action-matches': {
                'conditions': [
                    {
                        'dataType': 'Collection',
                        'properties': [
                            {
                                'name': 'subType',
                                'value': 'LEAF'
                            }
                        ]
                    },
                    {
                        'dataType': 'Collection',
                        'properties': [
                            {
                                'name': 'subType',
                                'value': 'BRANCH'
                            }
                        ]
                    }
                ],
                'application': 'topologybrowser',
                'multipleSelection': true
            }
        },
        actionsForPrivate: {
            'defaultLabel': 'Set To Public',
            'name': 'networkexplorer-set-to-public',
            'plugin': 'networkexplorer/networkexplorer-set-to-public',
            'applicationId': 'networkexplorer',
            'multipleSelection': false,
            'primary': false,
            'category': 'Collection Modification Actions',
            'order': 215
        },
        getResponseData: function(requestDataObj) {
            var actions = [];
            //Collection
            if (isContainCollectionType(requestDataObj.conditions)) {
                //TODO after multi select handled this is if condition is not needed
                if (requestDataObj.conditions.length === 1) {
                    if (requestDataObj.conditions[0].properties[1].value === 'SEARCH_CRITERIA') {
                        actions = this.searchCriteriaActionResponseData;
                    } else if (requestDataObj.conditions[0].properties[1].value === 'LEAF' || requestDataObj.conditions[0].properties[0].value === 'LEAF') {
                        actions = this.leafActionResponseData;
                    } else if (requestDataObj.conditions[0].properties[1].value === 'BRANCH' || requestDataObj.conditions[0].properties[0].value === 'BRANCH') {
                        if (requestDataObj.conditions[0].properties[2].value === 0) {
                            actions = this.rootActionResponseData; // this step is for not keeping DELETE button on root Collection
                        } else {
                            actions = this.branchActionResponseData;
                        }
                    }
                    if (isAPrivateCollection(requestDataObj.conditions[0].properties)) {
                        if (actions.actions[3] && actions.actions[3].defaultLabel !=='Set To Public') {
                            actions.actions.splice(3,0,this.actionsForPrivate);
                        }
                    } else {
                        if (actions.actions[3] && actions.actions[3].defaultLabel ==='Set To Public') {
                            actions.actions.splice(3,1);
                        }
                    }
                    return actions;
                } else {
                    return this.multiSelectCollectionData;
                }
            }
            //Network data
            else {

                actions.push(
                    {
                        'name': 'topologybrowser-edit-state',
                        'multipleSelection': true,
                        'plugin': 'topologybrowser/topologybrowser-edit-state',
                        'category': 'Configuration Management',
                        'order': 310,
                        'applicationId': 'topologybrowser',
                        'defaultLabel': 'Edit State',
                        'primary': false
                    },{
                        'defaultLabel': 'Initiate CM Sync',
                        'name': 'topologybrowser-initiate-cm-sync',
                        'multipleSelection': true,
                        'plugin': 'topologybrowser/topologybrowser-initiate-cm-sync',
                        'category': 'Configuration Management',
                        'order': 300
                    });
                if (requestDataObj.multipleSelection) {
                    actions.push(
                        {
                            'defaultLabel': 'Multi Select',
                            'name': 'multi-select',
                            'applicationId': 'topologybrowser',
                            'multipleSelection': true,
                            'primary': false,
                            'category': 'Multi Select',
                            'order': 300
                        }
                    );
                }
                else {
                    actions.push(
                        {
                            'defaultLabel': 'Single Select',
                            'name': 'single-select',
                            'applicationId': 'topologybrowser',
                            'multipleSelection': true,
                            'primary': false,
                            'category': 'Single Select',
                            'order': 300
                        }
                    );
                }
                var uniqueItems = {};
                requestDataObj.conditions.forEach(function(condition, index) {
                    uniqueItems[index] = [];
                    condition.properties.forEach(function(property) {
                        if (uniqueItems[index].indexOf(property.name) === -1) {
                            uniqueItems[index].push(property.name);
                            actions.push(
                                {
                                    'defaultLabel': property.name + ' ' + property.value,
                                    'name': property.name + '-select',
                                    'applicationId': 'topologybrowser',
                                    'multipleSelection': true,
                                    'primary': false,
                                    'category': property.name,
                                    'order': 400
                                }
                            );
                        }
                    });
                });

                return {
                    'actions': actions,
                    'action-matches': requestDataObj
                };
            }
        }
    };

    function isContainCollectionType(data) {
        this.isCollection = false;
        data.forEach(function(obj) {
            if (obj.dataType === 'Collection') {
                this.isCollection = true;
            }
        }.bind(this));

        return this.isCollection;
    }
    function isAPrivateCollection(properties) {
        var isPrivate = false;
        properties.forEach(function(obj) {
            if (obj.name === 'category' && obj.value === 'Private') {
                isPrivate = true;
            }
        }.bind(this));

        return isPrivate;
    }
});
