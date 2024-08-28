define([], function() {
    'use strict';

    return {
        'getCollectionInfoRoot': {
            data: {
                category: 'Public',
                id: '281474978893937',
                lastUpdated: '09/26/2018 03:30',
                name: 'Transport Topology',
                poId: '281474978893937',
                readOnly: false,
                sortable: false,
                timeCreated: '09/26/2018 03:30'
            }
        },
        'getTypeInfoRoot': {
            data: {
                category: 'Public',
                id: '281474978893937',
                name: 'Transport Topology',
                parentId: null,
                poId: '281474978893937',
                subType: 'BRANCH',
                type: 'NESTED'
            }
        },
        'getCollectionInfoBranch': {
            data: {
                category: 'Public',
                id: '281474978934238',
                lastUpdated: '09/26/2018 03:31',
                name: 'Test Branch',
                poId: '281474978934238',
                readOnly: false,
                sortable: false,
                timeCreated: '09/26/2018 03:31',
                userId: 'administrator'
            }
        },
        'getTypeInfoBranch': {
            data: {
                category: 'Public',
                id: '281474978934238',
                name: 'Test Branch',
                parentId: '281474978893937',
                poId: '281474978893938',
                subType: 'BRANCH',
                type: 'NESTED'
            }
        },
        'getCollectionInfoLeaf': {
            data: {
                category: 'Public',
                id: '281474978934239',
                lastUpdated: '09/26/2018 03:32',
                name: 'Test Leaf',
                poId: '281474978934239',
                readOnly: false,
                sortable: false,
                timeCreated: '09/26/2018 03:32',
                userId: 'administrator'
            }
        },
        'getTypeInfoLeaf': {
            data: {
                category: 'Public',
                id: '281474978934239',
                name: 'Test Leaf',
                parentId: '281474978893938',
                poId: '281474978893939',
                subType: 'LEAF',
                type: 'NESTED'
            }
        },
        'getCollectionInfoSearchCriteria': {
            data: {
                category: 'Public',
                id: '281474978934240',
                lastUpdated: '09/26/2018 03:32',
                name: 'Test Search Criteria',
                poId: '281474978934240',
                readOnly: false,
                sortable: false,
                query: 'anyQuery',
                timeCreated: '09/26/2018 03:32',
                contentsUpdatedTime: '09/26/2018 03:32',
                userId: 'administrator'
            }
        },
        'getTypeInfoSearchCriteria': {
            data: {
                category: 'Public',
                id: '281474978934240',
                name: 'Test Search Criteria',
                parentId: '2814749788939',
                poId: '281474978893940',
                subType: 'SEARCH_CRITERIA',
                type: 'NESTED'
            }
        }
    };

});
