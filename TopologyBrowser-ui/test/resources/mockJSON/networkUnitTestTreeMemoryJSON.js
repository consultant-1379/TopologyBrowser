define([], function() {
    return {
        moFirstResponse: {
            'treeNodes': [
                {
                    'attributes': null,
                    'childrens': [{
                        'attributes': null,
                        'childrens': null,
                        'mibRootName': null,
                        'moName': 'LTE01ERBS00017',
                        'moType': 'MeContext',
                        'noOfChildrens': '1',
                        'parentRDN': null,
                        'poId': '281474980185641'
                    }],
                    'mibRootName': null,
                    'moName': 'ENM1',
                    'moType': 'SubNetwork',
                    'noOfChildrens': '1',
                    'parentRDN': null,
                    'poId': '281474980185637'
                },
                {
                    'moName': 'LTE01ERBS00017',
                    'moType': 'MeContext',
                    'poId': '281474980185641',
                    'mibRootName': null,
                    'parentRDN': null,
                    'attributes': null,
                    'noOfChildrens': 1,
                    'childrens': [
                        {
                            'moName': 'ERBS-Tree-Testing',
                            'moType': 'MeContext',
                            'poId': '1688849860320582',
                            'mibRootName': null,
                            'parentRDN': null,
                            'attributes': null,
                            'noOfChildrens': 0,
                            'childrens': []
                        }
                    ]
                },
                {
                    'attributes': null,
                    'childrens': [{
                        'attributes': null,
                        'childrens': null,
                        'mibRootName': null,
                        'moName': '1',
                        'moType': 'ManagedElement',
                        'noOfChildrens': '1',
                        'parentRDN': null,
                        'poId': '281475000992622'
                    }],
                    'mibRootName': null,
                    'moName': 'LTE01ERBS00018',
                    'moType': 'MeContext',
                    'noOfChildrens': '1',
                    'parentRDN': null,
                    'poId': '281474980185642'
                }

            ]
        },
        moSecondResponse: {
            'treeNodes': [
                {
                    'moName': 'LTE01ERBS00018',
                    'moType': 'MeContext',
                    'poId': '281474980185642',
                    'mibRootName': null,
                    'parentRDN': null,
                    'attributes': null,
                    'noOfChildrens': 1,
                    'childrens': [
                        {
                            'moName': 'ERBS002_level_1',
                            'moType': 'SubNetwork',
                            'poId': '1688849860320670',
                            'noOfChildrens': 0,
                            'mibRootName': null,
                            'parentRDN': null,
                            'attributes': null,
                            'childrens': null
                        }
                    ]
                },
            ]
        },
        moRootFirstResponse: {
            'treeNodes': [{
                'moName': 'G2RBS',
                'moType': 'SubNetwork',
                'poId': '281474980185571',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '0',
                'attributes': null,
                'childrens': []
            }, {
                'moName': 'ENM1',
                'moType': 'SubNetwork',
                'poId': '281474980185637',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '1',
                'attributes': null,
                'childrens': [{
                    'moName': 'LTE01ERBS00017',
                    'moType': 'MeContext',
                    'poId': '281474980185641',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '1',
                    'attributes': null,
                    'childrens': null
                }]
            }],
            'withSubNetwork': true,
            'noOfSubNetworkChildren': 2,
            'noOfOtherNetworkChildren': 0,
            'allOtherNetwork': false
        },
        moRootSecondResponse: {
            'treeNodes': [{
                'moName': 'Radionode_15B_V13',
                'moType': 'MeContext',
                'poId': '281474980185565',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '0',
                'attributes': null,
                'childrens': []
            }, {
                'moName': 'G2RBS_1',
                'moType': 'MeContext',
                'poId': '281474980185575',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '0',
                'attributes': null,
                'childrens': []
            }, {
                'moName': 'G2RBS_2',
                'moType': 'MeContext',
                'poId': '281474980185579',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '0',
                'attributes': null,
                'childrens': []
            }, {
                'moName': 'G2RBS_3',
                'moType': 'MeContext',
                'poId': '281474980185583',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '0',
                'attributes': null,
                'childrens': []
            }, {
                'moName': 'LTE01ERBS00018',
                'moType': 'MeContext',
                'poId': '281475069327969',
                'mibRootName': null,
                'parentRDN': null,
                'noOfChildrens': '1',
                'attributes': null,
                'childrens': [{
                    'moName': '1',
                    'moType': 'ManagedElement',
                    'poId': '281475277363714',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '1',
                    'attributes': null,
                    'childrens': null
                }]
            }],
            'withSubNetwork': false,
            'noOfSubNetworkChildren': 0,
            'noOfOtherNetworkChildren': 5,
            'allOtherNetwork': true
        },

    };


});
