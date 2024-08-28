if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return {
        'treeNodes': [
            {
                'moName': 'Stockholm_01_ME',
                'moType': 'ManagedElement',
                'poId': '12',
                'fdn': null,
                'items': null,
                'childrens': [
                    {
                        'moName': 'Stockholm_01_ENodeB',
                        'moType': 'ENodeBFunction',
                        'poId': '123',
                        'fdn': null,
                        'items': null
                    },
                    {
                        'moName': 'Stockholm_01_Equip',
                        'moType': 'Equipment',
                        'poId': '124',
                        'fdn': null,
                        'items': null

                    },
                    {
                        'moName': 'Stockholm_01_EquipSupportFunc',
                        'moType': 'EquipmentSupportFunction',
                        'poId': '125',
                        'fdn': null,
                        'items': null

                    } ,
                    {
                        'moName': 'Stockholm_01_IpOam',
                        'moType': 'IpOam',
                        'poId': '126',
                        'fdn': null,
                        'items': null

                    } ,
                    {
                        'moName': 'Stockholm_01_IpSys',
                        'moType': 'IpSystem',
                        'poId': '127',
                        'fdn': null,
                        'items': null
                    },
                    {
                        'moName': 'Stockholm_01_MEData',
                        'moType': 'ManagedElementData',
                        'poId': '128',
                        'fdn': null,
                        'items': null

                    },
                    {
                        'moName': 'Stockholm_01_ResAllocFun',
                        'moType': 'ResourceAllocationFunction',
                        'poId': '129',
                        'fdn': null,
                        'items': null

                    } ,
                    {
                        'moName': 'Stockholm_01_SectEquipFunc',
                        'moType': 'SectorEquipmentFunction',
                        'poId': '1210',
                        'fdn': null,
                        'items': null
                    },
                    {
                        'moName': 'Stockholm_01_SwMgnt',
                        'moType': 'SoftwareManagement',
                        'poId': '1211',
                        'fdn': null,
                        'items': null

                    },
                    {
                        'moName': 'Stockholm_01_SysFunc',
                        'moType': 'SystemFunctions',
                        'poId': '1212',
                        'fdn': null,
                        'items': null

                    } ,
                    {
                        'moName': 'Stockholm_01_TransNet',
                        'moType': 'TransportNetwork',
                        'poId': '1213',
                        'fdn': null,
                        'items': null
                    }
                ]
            },
            {
                'moName': 'Stockholm_01_Root',
                'moType': 'MeContext',
                'poId': '1',
                'fdn': null,
                'items': null,
                'childrens': [  {
                    'moName': 'Stockholm_01_ME',
                    'moType': 'ManagedElement',
                    'poId': '12',
                    'fdn': null,
                    'items': null
                }]
            }
        ]

    }
        ;
})
;

