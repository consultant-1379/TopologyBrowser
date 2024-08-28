define([], function() {
    'use strict';

    return {
        root: {
            'id': '281474978623583',
            'parentId': null,
            'name': 'Transport Topology',
            'category': 'Public',
            'subType': 'BRANCH',
            'type': 'NESTED'
        },
        rootWithNoChildren: {
            root: {
                'id': '281474978623584',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            noChildrenObject: {
                category: undefined,
                children: 0,
                id: '-9281474978623584',
                label: 'No children found',
                level: 0,
                offset: 0,
                parent: '281474978623584',
                subType: undefined
            }
        },
        rootWithBranchCollection: {
            root: {
                'id': '281474978623585',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            branch: {
                'id': '281474978846997',
                'name': 'child_branch_001',
                'parentId': '281474978623585',
                'subType': 'BRANCH',
                'level': 1,
                'type': 'NESTED'
            }
        },
        rootWithLeafCollection: {
            root: {
                'id': '281474978623586',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            leaf: {
                'id': '281474978846996',
                'name': 'child_leaf_001',
                'parentId': '281474978623586',
                'subType': 'Leaf',
                'level': 1,
                'type': 'NESTED'
            }
        },
        rootWithSearchCriteriaCollection: {
            root: {
                'id': '281474978623586',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            leaf: {
                'id': '281474978846996',
                'name': 'child_leaf_001',
                'parentId': '281474978623586',
                'subType': 'SEARCH_CRITERIA',
                'level': 1,
                'query': 'MeContext',
                'type': 'NESTED'
            }
        },
        rootWithBothTypeOfCollection: {
            root: {
                'id': '281474978623587',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            leaf: {
                'id': '281474978846998',
                'name': 'child_leaf_002',
                'parentId': '281474978623587',
                'subType': 'Leaf',
                'level': 1,
                'type': 'NESTED'
            },
            branch: {
                'id': '281474978846999',
                'name': 'child_branch_002',
                'parentId': '281474978623587',
                'subType': 'BRANCH',
                'level': 1,
                'type': 'NESTED'
            }
        },
        branchCollectionWithNoChildren: {
            root: {
                'id': '281474978623588',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            branch: {
                'id': '381474978846970',
                'name': 'child_branch_003',
                'parentId': '281474978623588',
                'subType': 'BRANCH',
                'level': 1,
                'type': 'NESTED'
            },
            noChildrenObject: {
                category: undefined,
                children: 0,
                id: '-9381474978846970',
                label: 'No children found',
                level: 0,
                offset: 0,
                parent: '381474978846970',
                subType: undefined
            }
        },
        leafCollectionWithNoChildren: {
            root: {
                'id': '281474978623589',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH'
            },
            leaf: {
                'id': '381474978846971',
                'name': 'child_leaf_003',
                'parentId': '281474978623589',
                'subType': 'LEAF',
                'level': 1,
                'type': 'NESTED'
            },
            noChildrenObject: {
                category: undefined,
                children: 0,
                id: '-9381474978846971',
                label: 'No children found',
                level: 0,
                offset: 0,
                parent: '381474978846971',
                subType: undefined
            }
        },
        leafCollectionWithManagedObjectChild: {
            root: {
                'id': '281474978623589',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            leaf: {
                'id': '381474978846971',
                'name': 'child_leaf_003',
                'parentId': '281474978623589',
                'subType': 'LEAF',
                'level': 1,
                'type': 'NESTED'
            },
            managedObject: {
                category: undefined,
                children: 0,
                id: '481474978846971',
                label: 'moName',
                level: 0,
                offset: 0,
                parent: '381474978846971',
                type: 'MeContext'
            }
        },
        hybridCollectionWithManagedObjectAndLeafAndBranchChildren: {
            root: {
                'id': '281474978623590',
                'parentId': null,
                'name': 'Transport Topology',
                'category': 'Public',
                'subType': 'BRANCH',
                'type': 'NESTED'
            },
            branch: {
                'id': '381474978846972',
                'name': 'child_branch_003',
                'parentId': '281474978623590',
                'subType': 'BRANCH',
                'level': 1,
                'type': 'NESTED'
            },
            leaf: {
                'id': '381474978846973',
                'name': 'child_leaf_003',
                'parentId': '281474978623590',
                'subType': 'LEAF',
                'level': 1,
                'type': 'NESTED'
            },
            managedObject: {
                category: undefined,
                children: 0,
                id: '481474978846974',
                label: 'moName',
                level: 0,
                offset: 0,
                parent: '281474978623590',
                type: 'MeContext'
            }
        },

        memory: {
            '281474978623583': {
                category: 'Public',
                children: 1,
                id: '281474978623583',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978623584': {
                category: 'Public',
                children: 1,
                id: '281474978623584',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978623585': {
                category: 'Public',
                children: 1,
                id: '281474978623585',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978623586': {
                category: 'Public',
                children: 1,
                id: '281474978623586',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978623587': {
                category: 'Public',
                children: 1,
                id: '281474978623587',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978623588': {
                category: 'Public',
                children: 1,
                id: '281474978623588',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978623589': {
                category: 'Public',
                children: 1,
                id: '281474978623589',
                label: 'Transport Topology',
                level: 0,
                offset: 0,
                parent: null,
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978846996': {
                category: 'Public',
                children: 1,
                id: '281474978846996',
                label: 'child_leaf_001',
                level: 1,
                offset: 0,
                parent: '281474978623586',
                subType: 'LEAF',
                type: 'NESTED'
            },
            '281474978846997': {
                category: 'Public',
                children: 1,
                id: '281474978846997',
                label: 'child_branch_001',
                level: 1,
                offset: 0,
                parent: '281474978623585',
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '281474978846998': {
                category: 'Public',
                children: 1,
                id: '281474978846998',
                label: 'child_leaf_002',
                level: 1,
                offset: 0,
                parent: '281474978623587',
                subType: 'LEAF',
                type: 'NESTED'
            },
            '281474978846999': {
                category: 'Public',
                children: 1,
                id: '281474978846999',
                label: 'child_branch_002',
                level: 1,
                offset: 1,
                parent: '281474978623587',
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '381474978846970': {
                category: 'Public',
                children: 1,
                id: '381474978846970',
                label: 'child_branch_003',
                level: 1,
                offset: 1,
                parent: '281474978623588',
                subType: 'BRANCH',
                type: 'NESTED'
            },
            '381474978846971': {
                category: 'Public',
                children: 1,
                id: '381474978846971',
                label: 'child_leaf_003',
                level: 1,
                offset: 1,
                parent: '281474978623589',
                subType: 'LEAF',
                type: 'NESTED'
            },
        },
        children: {
            '281474978623583': [],
            '281474978623584': [{
                category: undefined,
                children: 0,
                id: '-9281474978623584',
                label: 'No children found',
                level: 0,
                offset: 0,
                parent: '281474978623584',
                subType: undefined
            }],
            '281474978623585': [{
                category: 'Public',
                children: 1,
                id: '281474978846997',
                label: 'child_branch_001',
                level: 1,
                offset: 0,
                parent: '281474978623585',
                subType: 'BRANCH',
                type: 'NESTED'
            }],
            '281474978623586': [{
                category: 'Public',
                children: 1,
                id: '281474978846996',
                label: 'child_leaf_001',
                level: 1,
                offset: 0,
                parent: '281474978623586',
                subType: 'LEAF',
                type: 'NESTED'
            }],
            '281474978623587': [{
                category: 'Public',
                children: 1,
                id: '281474978846998',
                label: 'child_leaf_002',
                level: 1,
                offset: 0,
                parent: '281474978623587',
                subType: 'LEAF',
                type: 'NESTED'
            }, {
                category: 'Public',
                children: 1,
                id: '281474978846999',
                label: 'child_branch_002',
                level: 1,
                offset: 1,
                parent: '281474978623587',
                subType: 'BRANCH',
                type: 'NESTED'
            }],
            '281474978623588': [{
                category: 'Public',
                children: 1,
                id: '381474978846970',
                label: 'child_branch_003',
                level: 1,
                offset: 1,
                parent: '281474978623588',
                subType: 'BRANCH',
                type: 'NESTED'
            }],
            '381474978846970': [{
                category: undefined,
                children: 0,
                id: '-9381474978846970',
                label: 'No children found',
                level: 0,
                offset: 0,
                parent: '381474978846970',
                subType: undefined
            }],
            '281474978623589': [{
                category: 'Public',
                children: 1,
                id: '381474978846971',
                label: 'child_leaf_003',
                level: 1,
                offset: 1,
                parent: '281474978623589',
                subType: 'LEAF',
                type: 'NESTED'
            }],
            '381474978846971': [{
                category: undefined,
                children: 0,
                id: '-9381474978846971',
                label: 'No children found',
                level: 0,
                offset: 0,
                parent: '381474978846971',
                subType: undefined,
                type: undefined
            }]
        }
    };
});
