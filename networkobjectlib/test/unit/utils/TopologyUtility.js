/*global  describe, sinon, beforeEach, afterEach, it*/
define([
    'networkobjectlib/utils/TopologyUtility',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/regions/topologyTree/TreeMemory'
], function(TopologyUtility, i18n, TreeMemory) {
    'use strict';
    describe('utils/TopologyUtility', function() {

        var sandbox,
            utility;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            utility = TopologyUtility;

        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('convertToMemoryItem(object, parentId)', function() {
            var testData = [
                {
                    data: {
                        object: {
                            id: '002',
                            name: 'a',
                            noOfChildrens: 0,
                            offset: 0,
                            type: 'NESTED',
                            subType: 'LEAF',
                            hybrid: null,
                            neType: 'ABC',
                            syncStatus: 'SYNCING',
                            managementState: 'NORMAL',
                            level: 0,
                            category: 'private',
                            query: 'anyQuery',
                            parentMoType: 'MeContext',
                            totalNodeCount: 0
                        },
                        parentId: '000:001'
                    },
                    expected: {
                        id: '001:002',
                        label: 'a',
                        parent: '000:001',
                        children: 1,
                        offset: 0,
                        type: 'NESTED',
                        subType: 'LEAF',
                        hybrid: null,
                        level: 0,
                        category: 'private',
                        query: 'anyQuery',
                        neType: 'ABC',
                        syncStatus: 'SYNCING',
                        contentsUpdatedTime: undefined,
                        managementState: 'NORMAL',
                        parentMoType: 'MeContext',
                        radioAccessTechnology: undefined,
                        stereotypes: [],
                        totalNodeCount: 0
                    },
                },
                {
                    data: {
                        object: {
                            id: '002',
                            name: 'a',
                            noOfChildrens: 0,
                            offset: 0,
                            type: 'LEAF',
                            hybrid: null,
                            neType: 'ABC',
                            syncStatus: 'SYNCING',
                            managementState: 'NORMAL',
                            level: 0,
                            sharing: 'private',
                            query: 'anyQuery',
                            parentMoType: 'MeContext',
                            totalNodeCount: 2,
                            stereotypes: [
                                {
                                    type: 'PrivateNetwork'
                                }
                            ]
                        },
                        parentId: '000:001'
                    },
                    expected: {
                        id: '001:002',
                        label: 'a',
                        parent: '000:001',
                        children: 1,
                        offset: 0,
                        type: 'LEAF',
                        hybrid: null,
                        subType: null,
                        level: 0,
                        category: 'private',
                        query: 'anyQuery',
                        neType: 'ABC',
                        syncStatus: 'SYNCING',
                        contentsUpdatedTime: undefined,
                        managementState: 'NORMAL',
                        parentMoType: 'MeContext',
                        radioAccessTechnology: undefined,
                        totalNodeCount: 2,
                        stereotypes: [
                            {
                                type: 'PrivateNetwork'
                            }
                        ]
                    }
                }
            ];
            testData.forEach(function(test) {
                it('Should convert to memory object', function() {

                    // Action
                    var memoryItem = utility.convertToMemoryItem(test.data.object, test.data.parentId);

                    // Assert
                    expect(memoryItem).to.eql(test.expected);

                });
            });

            var parents = [
                {value: null, expected: null},
                {value: undefined, expected: null},
                {value: 0, expected: null},
                {value: -123, expected: '-123'},
                {value: 123, expected: '123'},
                {value: '321', expected: '321'},
                {value: '-9', expected: '-9'}
            ];
            parents.forEach(function(test) {
                it('Should convert to memory object for parentId: ' + JSON.stringify(test.value), function() {

                    // Action
                    var memoryItem = utility.convertToMemoryItem({name: 'a'}, test.value);

                    // Assert
                    expect(memoryItem.parent).to.equal(test.expected);

                });
            });

            var types = [
                {value: {name: 'a', subType: 'BRANCH'}, expected: 'BRANCH'},
                {value: {name: 'a', subType: 'LEAF'}, expected: 'LEAF'},

            ];
            types.forEach(function(test) {
                it('Should convert to memory object for type: ' + JSON.stringify(test.value.subType), function() {

                    // Action
                    var memoryItem = utility.convertToMemoryItem(test.value, '324');

                    // Assert
                    expect(memoryItem.subType).to.equal(test.expected);

                });
            });

            it('Should convert to memory object for type: moType', function() {

                // Action
                var memoryItem = utility.convertToMemoryItem({name: 'a', moType: 'moType'}, '324');

                // Assert
                expect(memoryItem.type).to.equal('moType');

            });

            var levels = [
                {value: {name: 'a', level: 0}, expected: 0},
                {value: {name: 'a', level: undefined}, expected: 0},
                {value: {name: 'a', level: 3}, expected: 3},

            ];
            levels.forEach(function(test) {
                it('Should convert to memory object for level: ' + JSON.stringify(test.value.level), function() {

                    // Action
                    var memoryItem = utility.convertToMemoryItem(test.value, '324');

                    // Assert
                    expect(memoryItem.level).to.equal(test.expected);

                });
            });
            //TODO: Check this for non Collection(LEAF/BRANCH) when integrating with TopologyTree
            var children = [
                {value: 0, expected: 1, type: 'NESTED', subType: 'LEAF'},
                {value: -1, expected: 0, type: 'NESTED', subType: 'LEAF'},
                {value: -123, expected: 0, type: 'NESTED', subType: 'LEAF'},
                {value: 1, expected: 1, type: 'NESTED', subType: 'LEAF'},
                {value: 123, expected: 123, type: 'NESTED', subType: 'LEAF'},
                {value: 0, expected: 0, type: 'MeContext'},
                {value: -1, expected: 0, type: 'MeContext'},
                {value: -123, expected: 0, type: 'MeContext'},
                {value: 1, expected: 0, type: 'MeContext'},
                {value: 123, expected: 0, type: 'MeContext'}
            ];
            children.forEach(function(test) {
                it('Should convert to memory object for noOfChildren: ' + JSON.stringify(test.value) + ' type: ' + JSON.stringify(test.type), function() {

                    // Action
                    var memoryItem = utility.convertToMemoryItem({name: 'a', noOfChildrens: test.value, type: test.type, subType: test.subType}, '1');

                    // Assert
                    expect(memoryItem.children).to.equal(test.expected);

                });
            });

            [{
                object: {name: 'a', type: 'NESTED', subType: 'BRANCH', contentsUpdatedTime: undefined, timeCreated: 1544310600000},
                expected: undefined
            },{
                object: {name: 'a', type: 'NESTED', subType: 'LEAF', contentsUpdatedTime: 1544610600000, timeCreated: 1544310600000},
                expected: 1544610600000
            },{
                object: {name: 'a', type: 'NESTED', subType: 'LEAF', contentsUpdatedTime: undefined, timeCreated: 1544310600000},
                expected: 1544310600000
            },{
                object: {name: 'a', type: 'NESTED', subType: 'SEARCH_CRITERIA', contentsUpdatedTime: 1544610600000, timeCreated: 1544310600000},
                expected: 1544610600000
            },{
                object: {name: 'a', type: 'NESTED', subType: 'SEARCH_CRITERIA', contentsUpdatedTime: undefined, timeCreated: 1544310600000},
                expected: 1544310600000
            }].forEach(function(test) {
                it('Should convert to memory object for contentsUpdatedTime: ' + (test.object.contentsUpdatedTime ? 'not null' : 'null') + ', type: ' + test.object.subType, function() {

                    // Action
                    var memoryItem = utility.convertToMemoryItem(test.object);
                    test.expected = utility.convertTimestampToString(test.expected);

                    // Assert
                    expect(memoryItem.contentsUpdatedTime).to.equal(test.expected);

                });
            });
        });

        describe('createNoChildrenObject(parentId)', function() {
            var testData = [
                {value: undefined, expected: '-9'},
                {value: null, expected: '-9'},
                {value: 0, expected: '-9'},
                {value: '0', expected: '-90'},
                {value: '1234', expected: '-91234'},
                {value: 1234, expected: '-9'}
            ];
            testData.forEach(function(test) {
                it('Should create no children object for parentId: ' +
                    JSON.stringify(test.value) + ' gives id: ' + JSON.stringify(test.expected), function() {

                    // Action
                    var actualObject = utility.createNoChildrenObject(test.value);

                    // Assert
                    expect(actualObject.id).to.equal(test.expected);

                });
            });

        });

        describe('convertToTreeItem(object)', function() {

            var testData = [{
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    type: 'NESTED',
                    subType: 'BRANCH',
                    neType: 'MeContext'
                },
                expected: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    collectionType: 'BRANCH',
                    neType: 'MeContext'
                }
            },
            {
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: undefined,
                    type: 'NESTED',
                    subType: 'BRANCH',
                    neType: 'MeContext'
                },
                expected: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 0,
                    collectionType: 'BRANCH',
                    neType: 'MeContext'
                }
            },
            {
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    type: undefined,
                    neType: 'Unmanaged'
                },
                expected: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    collectionType: null,
                    neType: 'Unmanaged'
                }
            }

            ];
            testData.forEach(function(test) {
                it('Should convert object : ' +
                    JSON.stringify(test.value) + ' into tree Object: ' + JSON.stringify(test.expected), function() {
                    //Assemble
                    var memory  = new TreeMemory();
                    memory.addObject('002', {name: 'a', type: ''}, '001');
                    sandbox.spy(utility, 'getIcon');

                    // Action
                    var actualObject = utility.convertToTreeItem(test.value, memory);

                    // Assert
                    expect(actualObject.id).to.equal(test.expected.id);
                    expect(actualObject.children).to.equal(test.expected.children);
                    expect(actualObject.collectionType).to.equal(test.expected.collectionType);

                });
            });

        });

        describe('isRootPoId(poid)', function() {
            var testData = [
                {poid: '100', customTopologyId: undefined, expected: false},
                {poid: null, customTopologyId: undefined, expected: true},
                {poid: undefined, customTopologyId: undefined, expected: true},
                {poid: '10', customTopologyId: '10', expected: true},
                {poid: '10', customTopologyId: '13', expected: false}
            ];
            testData.forEach(function(test) {
                it('Should check RootPoid for poid: ' +
                    JSON.stringify(test.poid) + ' customTopologyId: ' + JSON.stringify(test.customTopologyId), function() {

                    // Action
                    var actualObject = utility.isRootPoId(test.poid, test.customTopologyId);

                    // Assert
                    expect(actualObject).to.equal(test.expected);

                });
            });

        });

        describe('getIcon(name, type)', function() {
            var testData = [
                {data: {subType: 'BRANCH'}, expected: {icon: 'ebIcon_folderGroup', title: i18n.branchTitle}},
                {data: {subType: 'LEAF'}, expected: {icon: 'ebIcon_folder', title: i18n.leafTitle}},
                {data: {subType: 'SEARCH_CRITERIA'}, expected: {icon: 'ebIcon_folderSearch', title: i18n.leafTitle}},
                {data: {query: 'EUTRANCELLFDD'}, expected: {icon: 'ebIcon_folderSearch', title: i18n.leafTitle}},
                {data: {type: 'SubNetwork'}, expected: {icon: 'ebIcon_network', title: 'SubNetwork'}},
                {data: {poid: '-9'}, expected: {icon: null, title: ''}},
                {data: {poid: '100', isNode: false} , expected: {icon: 'ebIcon_mo', title: ''}},
                {data: {poid: '100', isNode: true, iconType: 'RBS'} , expected: {icon: 'ebIcon_rbs', title: 'RBS'}},
                {data: {poid: '100', isNode: true, iconType: 'ERBS'} , expected: {icon: 'ebIcon_rbs', title: 'ERBS'}},
                {data: {poid: '100', isNode: true, iconType: 'MSRBS_V1'} , expected: {icon: 'ebIcon_rbs', title: 'MSRBS_V1'}},
                {data: {poid: '100', isNode: true, iconType: 'MSRBS_V2'} , expected: {icon: 'ebIcon_rbs', title: 'MSRBS_V2'}},
                {data: {poid: '100', isNode: true, iconType: 'RadioNode'} , expected: {icon: 'ebIcon_rbs', title: 'RadioNode'}},
                {data: {poid: '100', isNode: true, iconType: 'RadioTNode'} , expected: {icon: 'ebIcon_rbs', title: 'RadioTNode'}},
                {data: {poid: '100', isNode: true, iconType: 'ORadio'} , expected: {icon: 'ebIcon_O-RU', title: 'ORadio'}},
                {data: {poid: '100', isNode: true, iconType: 'O1Node'} , expected: {icon: 'ebIcon_O-RU', title: 'O1Node'}},
                {data: {poid: '100', isNode: true, iconType: 'MGW'} , expected: {icon: 'ebIcon_switch', title: 'MGW'}},
                {data: {poid: '100', isNode: true, iconType: 'SIU02'} , expected: {icon: 'ebIcon_switch', title: 'SIU02'}},
                {data: {poid: '100', isNode: true, iconType: 'TCU02'} , expected: {icon: 'ebIcon_switch', title: 'TCU02'}},
                {data: {poid: '100', isNode: true, iconType: 'JUNIPER-MX'} , expected: {icon: 'ebIcon_switch', title: 'JUNIPER-MX'}},
                {data: {poid: '100', isNode: true, iconType: 'JUNIPER-SRX'} , expected: {icon: 'ebIcon_switch', title: 'JUNIPER-SRX'}},
                {data: {poid: '100', isNode: true, iconType: 'JUNIPER-PTX'} , expected: {icon: 'ebIcon_switch', title: 'JUNIPER-PTX'}},
                {data: {poid: '100', isNode: true, iconType: 'Router 6K'} , expected: {icon: 'ebIcon_switch', title: 'Router 6K'}},
                {data: {poid: '100', isNode: true, iconType: 'RNC'} , expected: {icon: 'ebIcon_controllingNode', title: 'RNC'}},
                {data: {poid: '100', isNode: true, iconType: 'MINI-LINK-Indoor'} , expected: {icon: 'ebIcon_microwave', title: 'MINI-LINK-Indoor'}},
                {data: {poid: '100', isNode: true, iconType: 'RNC'} , expected: {icon: 'ebIcon_controllingNode', title: 'RNC'}},
                {data: {poid: '100', isNode: true, iconType: 'MINI-LINK-Indoor'} , expected: {icon: 'ebIcon_microwave', title: 'MINI-LINK-Indoor'}},
                {data: {poid: '100', isNode: true, iconType: undefined} , expected: {icon: ['ebIcon_refresh', 'ebIcon_disabled'], title: ''}},
                {data: {poid: '100', isNode: true, iconType: null} , expected: {icon: ['ebIcon_refresh', 'ebIcon_disabled'], title: ''}},
                {data: {poid: '100', isNode: true, iconType: 'er3333'} , expected: {icon: 'ebIcon_mo', title: ''}},
                {data: {poid: '100', isNode: true, iconType: 'Unmanaged'} , expected: {icon: 'ebIcon_networkElement', title: 'Unmanaged'}},
                {data: {poid: '100', isNode: true, iconType: 'VirtualSubnetwork'} , expected: {icon: 'ebIcon_network', title: 'VirtualSubnetwork'}},
            ];

            it('Should get icon' , function() {
                // Action
                testData.forEach(function(test) {
                    // Assert
                    expect(utility.getIcon(test.data.poid, test.data.type, test.data.subType, test.data.iconType, test.data.query, test.data.isNode)).to.eql(test.expected);
                });
            });

        });

        describe('isNodeLevel(moType, parentId, parentType)', function() {
            var testData = [
                {data: {moType: '', parentId: '', parentType: ''}, expected: false},
                {data: {moType: 'asd', parentId: '1000', parentType: 'mo'}, expected: false},
                {data: {moType: '', parentId: '-2', parentType: ''}, expected: true},
                {data: {moType: 'SubNetwork222222', parentId: '', parentType: 'SubNetwork'}, expected: true},
                {data: {moType: 'SubNetwork', parentId: '', parentType: 'SubNetwork'}, expected: false}
            ];
            testData.forEach(function(test) {
                it('Should check node level for : ' + JSON.stringify(test.data), function() {
                    //Action
                    var actual = utility.isNodeLevel(test.data.moType, test.data.parentId, test.data.parentType);

                    //Assert
                    expect(actual).to.equal(test.expected);
                });
            });
        });

        describe('isNoChildrenObject(poid)', function() {
            it('Should check for no children objects', function() {

                var testData = [
                    {value: '0', expected: false},
                    {value: '-1' , expected: false},
                    {value: '12' , expected: false},
                    {value: '-90', expected: true},
                    {value: '-92345' , expected: true},
                    {value: '-9null' , expected: true},
                    {value: '-9undefined' , expected: true},

                ];
                testData.forEach(function(test) {
                    // Assert
                    expect(utility.isNoChildrenObject(test.value)).to.equal(test.expected);
                });
            });
        });

        describe('getSortable(items)', function() {
            it('Should return the indexed list of Mos', function() {

                var testData = [
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE02ERBS00011' },
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE01ERBS0005' },
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE02ERBS0008' },
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'TJ8CL' },
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'TJ13E' },
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: '8' },
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: '13' }
                ];

                var indexedTestData = [
                    {index: 0 , value: 'mecontext-lte02erbs00011'},
                    {index: 1 , value: 'mecontext-lte01erbs0005'},
                    {index: 2 , value: 'mecontext-lte02erbs0008'},
                    {index: 3 , value: 'mecontext-tj8cl'},
                    {index: 4 , value: 'mecontext-tj13e'},
                    {index: 5 , value: 'mecontext-00000000008'},
                    {index: 6 , value: 'mecontext-00000000013'}
                ];

                // Assert
                var mapSortable = utility.getSortable(testData);
                for (var index=0; index < mapSortable.length; index++) {
                    expect(mapSortable[index]).to.eql(indexedTestData[index]);
                }

            });
        });

        describe('getSorted(items)', function() {
            it('Should sort the array of Mos', function() {

                var testData = [
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE02ERBS00011'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE01ERBS0005'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE02ERBS0008'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'TJ8CL'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'TJ13E'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: '8'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: '13'}
                ];

                var sortedTestData = [
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: '8'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: '13'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE01ERBS0005'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE02ERBS00011'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'LTE02ERBS0008'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'TJ13E'},
                    {type: 'MeContext', parentId: 'ERBS_SubNetwork', parentType: 'SubNetwork', label: 'TJ8CL'}
                ];

                // Assert
                var mapSorted = utility.getSorted(testData);
                for (var index=0; index < mapSorted.length; index++) {
                    expect(sortedTestData[index].label).to.equal(mapSorted[index].label);
                }
            });
        });

        describe('getSyncStatus()', function() {
            [
                {
                    parameter: 'NOT_SUPPORTED',
                    expectedIcon: 'ebIcon_sync_notSupported',
                    expectedTitle: 'NOT_SUPPORTED'
                },
                {
                    parameter: 'UNSYNCHRONIZED',
                    expectedIcon: 'ebIcon_syncError',
                    expectedTitle: 'UNSYNCHRONIZED'
                },
                {
                    parameter: 'ATTRIBUTE',
                    expectedIcon: 'ebIcon_syncing_animated',
                    expectedTitle: 'SYNCHRONIZING'
                }
            ].forEach(function(testData) {
                it('should return the correct sync icon and title for ' + testData.parameter, function() {
                    var type = utility.getSyncStatus(testData.parameter);
                    expect(type.icon).to.equal(testData.expectedIcon);
                    expect(type.title).to.equal(testData.expectedTitle);
                });
            });
        });

        describe('getManagementState', function() {
            it('should return the correct sync icon and title for MAINTENANCE', function() {
                var type = utility.getManagementState('MAINTENANCE');
                expect(type.icon).to.equal('ebIcon_maintenanceMode');
                expect(type.title).to.equal('Node is in maintenance');
            });
        });

        describe('getObjectTypeForSelection', function() {
            it('should return the correct correct object type for the input', function() {
                var input = {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    type: 'NESTED',
                    subType: 'BRANCH',
                    neType: 'MeContext'
                };
                var type = utility.getObjectTypeForSelection(input);
                expect(type).to.equal('branch');
            });
        });

        describe('getObjectType(collection)', function() {
            var testData = [{
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    type: 'NESTED',
                    subType: 'BRANCH',
                    neType: 'MeContext'
                },
                expected: 'BRANCH'
            },
            {
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: undefined,
                    type: 'NESTED',
                    subType: 'LEAF',
                    neType: 'MeContext'
                },
                expected: 'LEAF'
            },
            {
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: undefined,
                    type: 'NESTED',
                    subType: 'SEARCH_CRITERIA',
                    neType: 'MeContext'
                },
                expected: 'SEARCH_CRITERIA'
            },
            {
                value: {
                    id: '1',
                    label: 'a',
                    parent: '002',
                    children: 10,
                    type: undefined,
                    neType: 'MeContext'
                },
                expected: undefined
            }
            ];
            testData.forEach(function(test) {
                it('Should return collection type : ' + JSON.stringify(test.expected), function() {
                    // Action
                    var type = utility.getObjectType(test.value);

                    // Assert
                    expect(type).to.equal(test.expected);
                });
            });
        });

    });
});
