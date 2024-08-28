define([], function() {
    return {

        firstReponse: {
            items: null,
            'treeNodes': [
                {
                    'moName': 'Selected',
                    'poId': '100',
                    'moType': 'Type: 1.0.0',
                    'fdn': null,
                    'items': null,
                    'childrens': [
                        {
                            'moName': 'SelectedChild1',
                            'poId': '1000',
                            'moType': 'Type: 1.0.0.0',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'SelectedChild2',
                            'poId': '1001',
                            'moType': 'Type: 1.0.0.1',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'SelectedChild3',
                            'poId': '1002',
                            'moType': 'Type: 1.0.0.2',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'SelectedChild4',
                            'poId': '1003',
                            'moType': 'Type: 1.0.0.3',
                            'fdn': null,
                            'items': null
                        }
                    ]
                },
                {
                    'moName': 'Parent',
                    'poId': '10',
                    'moType': 'Type: 1.0',
                    'fdn': null,
                    'items': null,
                    'childrens': [
                        {
                            'moName': 'Selected',
                            'poId': '100',
                            'moType': 'Type: 1.0.0',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild2',
                            'poId': '101',
                            'moType': 'Type: 1.0.1',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild3',
                            'poId': '102',
                            'moType': 'Type: 1.0.2',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild4',
                            'poId': '103',
                            'moType': 'Type: 1.0.3',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild5',
                            'poId': '104',
                            'moType': 'Type: 1.0.4',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild6',
                            'poId': '105',
                            'moType': 'Type: 1.0.5',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild7',
                            'poId': '106',
                            'moType': 'Type: 1.0.6',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild8',
                            'poId': '107',
                            'moType': 'Type: 1.0.7',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'ParentChild9',
                            'poId': '108',
                            'moType': 'Type: 1.0.8',
                            'fdn': null,
                            'items': null
                        }
                    ]
                },
                {
                    'moName': 'GrandParent',
                    'poId': '1',
                    'moType': null,
                    'fdn': null,
                    'childrens': [
                        {
                            'moName': 'Parent',
                            'poId': '10',
                            'moType': 'Type: 1.0',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'GrandParentChild2',
                            'poId': '11',
                            'moType': 'Type: 1.1',
                            'fdn': null,
                            'items': null
                        }
                    ]
                }
            ]
        },

        leftArrowClickResponse: {
            'treeNodes': [
                {
                    'moName': 'GreatGrandParent',
                    'poId': '5',
                    'moType': 'Type: .1',
                    'fdn': null,
                    'items': null,
                    'childrens': [
                        {
                            'moName': 'GrandParent',
                            'poId': '1',
                            'moType': null,
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'GreatGrandParentChild2',
                            'poId': '51',
                            'moType': 'Type: 5.1',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'GreatGrandParentChild3',
                            'poId': '52',
                            'moType': 'Type: 5.2',
                            'fdn': null,
                            'items': null
                        },
                        {
                            'moName': 'GreatGrandParentChild4',
                            'poId': '53',
                            'moType': 'Type: 5.3',
                            'fdn': null,
                            'items': null
                        }
                    ]
                }
            ]

        }

    };


});
