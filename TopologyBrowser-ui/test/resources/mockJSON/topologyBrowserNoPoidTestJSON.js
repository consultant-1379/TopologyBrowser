define([], function() {
    return {
        subNetworkResponse: {
            'treeNodes': [
                {
                    'moName': 'G2RBS',
                    'moType': 'SubNetwork',
                    'poId': '281474980185571',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '0',
                    'attributes': null,
                    'childrens': []
                },
                {
                    'moName': 'ENM1',
                    'moType': 'SubNetwork',
                    'poId': '281474980185637',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '2',
                    'attributes': null,
                    'childrens': [
                        {
                            'moName': 'LTE01ERBS00017',
                            'moType': 'MeContext',
                            'poId': '281474980185641',
                            'mibRootName': null,
                            'parentRDN': null,
                            'noOfChildrens': '1',
                            'attributes': null,
                            'childrens': null
                        },
                        {
                            'moName': 'SGSN-15B-WPP-V601',
                            'moType': 'MeContext',
                            'poId': '281475300926491',
                            'mibRootName': null,
                            'parentRDN': null,
                            'noOfChildrens': '0',
                            'attributes': null,
                            'childrens': null
                        }
                    ]
                },
                {
                    'moName': 'subnet_SGSNMME',
                    'moType': 'SubNetwork',
                    'poId': '281475300926505',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '1',
                    'attributes': null,
                    'childrens': [{
                        'moName': 'SGSN-15B-WPP-V601',
                        'moType': 'MeContext',
                        'poId': '281475300926509',
                        'mibRootName': null,
                        'parentRDN': null,
                        'noOfChildrens': '0',
                        'attributes': null,
                        'childrens': null
                    }]
                },
                {
                    'moName': 'ENM2',
                    'moType': 'SubNetwork',
                    'poId': '281475300926559',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '1',
                    'attributes': null,
                    'childrens': [{
                        'moName': 'LTE200ERBS00123',
                        'moType': 'MeContext',
                        'poId': '281475300926563',
                        'mibRootName': null,
                        'parentRDN': null,
                        'noOfChildrens': '0',
                        'attributes': null,
                        'childrens': null
                    }]
                }
            ],
            'withSubNetwork': true,
            'noOfSubNetworkChildren': 4,
            'noOfOtherNetworkChildren': 0,
            'allOtherNetwork': false
        },

        allOtherResponse: {
            'treeNodes': [
                {
                    'moName': 'Radionode_15B_V13',
                    'moType': 'MeContext',
                    'poId': '281474980185565',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '0',
                    'attributes': null,
                    'childrens': []
                },
                {
                    'moName': 'G2RBS_1',
                    'moType': 'MeContext',
                    'poId': '281474980185575',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '0',
                    'attributes': null,
                    'childrens': []
                },
                {
                    'moName': 'G2RBS_2',
                    'moType': 'MeContext',
                    'poId': '281474980185579',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '0',
                    'attributes': null,
                    'childrens': []
                },
                {
                    'moName': 'G2RBS_3',
                    'moType': 'MeContext',
                    'poId': '281474980185583',
                    'mibRootName': null,
                    'parentRDN': null,
                    'noOfChildrens': '0',
                    'attributes': null,
                    'childrens': []
                },
                {
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
                        'noOfChildrens': '14',
                        'attributes': null,
                        'childrens': null
                    }]
                }
            ],
            'withSubNetwork': false,
            'noOfSubNetworkChildren': 0,
            'noOfOtherNetworkChildren': 5,
            'allOtherNetwork': true
        }
    };
});
