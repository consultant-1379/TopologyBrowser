if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {
        singleRoot: {
            rootId: 281474978623583,
            roots: {
                281474978623583: {
                    'id': '281474978623583',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                281474978623583: {
                    'id': '281474978623583',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623583: []
            }
        },
        rootWithBranchCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846997: {
                    'id': '281474978846997',
                    'name': 'child_branch_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846997',
                        'name': 'child_branch_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    }
                ]
            }
        },
        rootWithLeafCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                }
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    }
                ]
            }
        },
        rootWithSearchCriteriaCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'SEARCH_CRITERIA',
                    'query': 'MeContext',
                    'level': 1
                }
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'SEARCH_CRITERIA',
                        'query': 'MeContext',
                        'level': 1
                    }
                ]
            },
            leafChildren: {
                281474978846998: {
                    category: '',
                    id: '281474978846998',
                    name: 'child_leaf_001',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        }
                    ]
                }
            }
        },
        rootWithBranchLeafAndSearchCriteriaCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978624574: {
                    'id': '281474978624574',
                    'parentId': '281474978623585',
                    'name': 'child_branch_001',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
                281474978622563: {
                    'id': '281474978622563',
                    'parentId': '281474978623585',
                    'name': 'child_leaf_001',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_search_criteria_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'SEARCH_CRITERIA',
                    'category': 'Public',
                    'query': 'MeContext',
                    'contentsUpdatedTime': 1544610600000,
                    'level': 1
                }
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978624574',
                        'name': 'child_branch_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    },{
                        'id': '281474978622563',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    },{
                        'id': '281474978846998',
                        'name': 'child_search_criteria_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'SEARCH_CRITERIA',
                        'query': 'MeContext',
                        'contentsUpdatedTime': 1544610600000,
                        'level': 1
                    }
                ]
            },
            leafChildren: {
                281474978622563: {
                    category: '',
                    id: '281474978622563',
                    name: 'child_leaf_001',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        },
                    ]
                },
                281474978846998: {
                    id: '281474978846998',
                    name: 'child_search_criteria_001',
                    query: 'MeContext',
                    contentsUpdatedTime: 1544610600000,
                    objects: []
                }
            }
        },
        rootWithTwoLeafCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'category': 'Public',
                    'level': 1
                },
                281474978846999: {
                    'id': '281474978846999',
                    'name': 'child_leaf_002',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'category': 'Private',
                    'level': 1
                }
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'category': 'Public',
                        'level': 1
                    },
                    {
                        'id': '281474978846999',
                        'name': 'child_leaf_002',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'category': 'Private',
                        'level': 1
                    }
                ]
            }
        },
        rootWithOneLeafCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978841234: {
                    'id': '281474978841234',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                },
                281474978841235: {
                    'id': '281474978841235',
                    'name': 'child_leaf_002',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                }
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978841234',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    },
                    {
                        'id': '281474978841235',
                        'name': 'child_leaf_002',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    }
                ]
            }
        },
        rootWithOnePrivateNetworkCollection: {
            rootId: 281474978623585,
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978841234: {
                    'id': '281474978841234',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1,
                    stereotypes: [{
                        type: 'PrivateNetwork'
                    }]
                },
                281474978841235: {
                    'id': '281474978841235',
                    'name': 'child_leaf_002',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                }
            },
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978841234',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1,
                        stereotypes: [{
                            type: 'PrivateNetwork'
                        }]
                    },
                    {
                        'id': '281474978841235',
                        'name': 'child_leaf_002',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    }
                ]
            }
        },
        rootWithNineBranchCollection: {
            rootId: 28147497884000,
            nodes: {
                28147497884000: {
                    'id': '28147497884000',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                28147497884001: {
                    'id': '28147497884001',
                    'name': 'child_branch_001',
                    'parentId': '28147497884000',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
                28147497884002: {
                    'id': '28147497884002',
                    'name': 'child_branch_002',
                    'parentId': '28147497884001',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 2
                },
                28147497884003: {
                    'id': '28147497884003',
                    'name': 'child_branch_003',
                    'parentId': '28147497884002',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 3
                },
                28147497884004: {
                    'id': '28147497884004',
                    'name': 'child_branch_004',
                    'parentId': '28147497884003',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 4
                },
                28147497884005: {
                    'id': '28147497884005',
                    'name': 'child_branch_005',
                    'parentId': '28147497884004',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 5
                },
                28147497884006: {
                    'id': '28147497884006',
                    'name': 'child_branch_006',
                    'parentId': '28147497884005',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 6
                },
                28147497884007: {
                    'id': '28147497884007',
                    'name': 'child_branch_007',
                    'parentId': '28147497884006',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 7
                },
                28147497884008: {
                    'id': '28147497884008',
                    'name': 'child_branch_008',
                    'parentId': '28147497884007',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 8
                },
                28147497884009: {
                    'id': '28147497884009',
                    'name': 'child_branch_009',
                    'parentId': '28147497884008',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 9
                }
            },
            roots: {
                28147497884000: {
                    'id': '28147497884000',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                28147497884000: [
                    {
                        'id': '28147497884001',
                        'name': 'child_branch_001',
                        'parentId': '28147497884000',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    }
                ],
                28147497884001: [
                    {
                        'id': '28147497884002',
                        'name': 'child_branch_002',
                        'parentId': '28147497884001',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 2
                    }
                ],
                28147497884002: [
                    {
                        'id': '28147497884003',
                        'name': 'child_branch_003',
                        'parentId': '28147497884002',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 3
                    }
                ],
                28147497884003: [
                    {
                        'id': '28147497884004',
                        'name': 'child_branch_004',
                        'parentId': '28147497884003',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 4
                    }
                ],
                28147497884004: [
                    {
                        'id': '28147497884005',
                        'name': 'child_branch_005',
                        'parentId': '28147497884004',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 5
                    }
                ],
                28147497884005: [
                    {
                        'id': '28147497884006',
                        'name': 'child_branch_006',
                        'parentId': '28147497884005',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 6
                    }
                ],
                28147497884006: [
                    {
                        'id': '28147497884007',
                        'name': 'child_branch_007',
                        'parentId': '28147497884006',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 7
                    }
                ],
                28147497884007: [
                    {
                        'id': '28147497884008',
                        'name': 'child_branch_008',
                        'parentId': '28147497884007',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 8
                    }
                ],
                28147497884008: [
                    {
                        'id': '28147497884009',
                        'name': 'child_branch_009',
                        'parentId': '28147497884008',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 9
                    }
                ]

            }
        },
        rootWithBothTypeOfCollection: {
            rootId: 281474978623587,
            nodes: {
                281474978623587: {
                    'id': '281474978623587',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623587',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                },
                281474978846999: {
                    'id': '281474978846999',
                    'name': 'child_branch_001',
                    'parentId': '281474978623587',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                }
            },
            roots: {
                281474978623587: {
                    'id': '281474978623587',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623587: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623587',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    },
                    {
                        'id': '281474978846999',
                        'name': 'child_branch_001',
                        'parentId': '281474978623587',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    }
                ]
            },
            leafChildren: {
                281474978846998: {
                    category: '',
                    id: '281474978846998',
                    name: 'child_leaf_001',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        }
                    ]
                }
            }
        },
        rootWithNineBothCollection: {
            rootId: 28147497884000,
            roots: {
                28147497884000: {
                    'id': '28147497884000',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                28147497884000: {
                    'id': '28147497884000',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                28147497884001: {
                    'id': '28147497884001',
                    'name': 'child_branch_001',
                    'parentId': '28147497884000',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
                28147497884002: {
                    'id': '28147497884002',
                    'name': 'child_branch_002',
                    'parentId': '28147497884001',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 2
                },
                28147497884003: {
                    'id': '28147497884003',
                    'name': 'child_branch_003',
                    'parentId': '28147497884002',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 3
                },
                28147497884004: {
                    'id': '28147497884004',
                    'name': 'child_branch_004',
                    'parentId': '28147497884003',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 4
                },
                28147497884005: {
                    'id': '28147497884005',
                    'name': 'child_branch_005',
                    'parentId': '28147497884004',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 5
                },
                28147497884006: {
                    'id': '28147497884006',
                    'name': 'child_branch_006',
                    'parentId': '28147497884005',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 6
                },
                28147497884007: {
                    'id': '28147497884007',
                    'name': 'child_branch_007',
                    'parentId': '28147497884006',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 7
                },
                28147497884008: {
                    'id': '28147497884008',
                    'name': 'child_branch_008',
                    'parentId': '28147497884007',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 8
                },
                28147497884009: {
                    'id': '28147497884009',
                    'name': 'child_branch_009',
                    'parentId': '28147497884008',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 9
                },
                28147497884011: {
                    'id': '28147497884011',
                    'name': 'child_leaf_001',
                    'parentId': '28147497884000',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                },
                28147497884012: {
                    'id': '28147497884012',
                    'name': 'child_leaf_002',
                    'parentId': '28147497884001',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 2
                },
                28147497884013: {
                    'id': '28147497884013',
                    'name': 'child_leaf_003',
                    'parentId': '28147497884002',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 3
                },
                28147497884014: {
                    'id': '28147497884014',
                    'name': 'child_leaf_004',
                    'parentId': '28147497884003',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 4
                },
                28147497884015: {
                    'id': '28147497884015',
                    'name': 'child_leaf_005',
                    'parentId': '28147497884004',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 5
                },
                28147497884016: {
                    'id': '28147497884016',
                    'name': 'child_leaf_006',
                    'parentId': '28147497884005',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 6
                },
                28147497884017: {
                    'id': '28147497884017',
                    'name': 'child_leaf_007',
                    'parentId': '28147497884006',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 7
                },
                28147497884018: {
                    'id': '28147497884018',
                    'name': 'child_leaf_008',
                    'parentId': '28147497884007',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 8
                },
                28147497884019: {
                    'id': '28147497884019',
                    'name': 'child_leaf_009',
                    'parentId': '28147497884008',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 9
                }

            },
            children: {
                28147497884000: [
                    {
                        'id': '28147497884001',
                        'name': 'child_branch_001',
                        'parentId': '28147497884000',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    },
                    {
                        'id': '28147497884011',
                        'name': 'child_leaf_001',
                        'parentId': '28147497884000',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    }

                ],
                28147497884001: [
                    {
                        'id': '28147497884002',
                        'name': 'child_branch_002',
                        'parentId': '28147497884001',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 2
                    },
                    {
                        'id': '28147497884012',
                        'name': 'child_leaf_002',
                        'parentId': '28147497884001',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 2
                    }
                ],
                28147497884002: [
                    {
                        'id': '28147497884003',
                        'name': 'child_branch_003',
                        'parentId': '28147497884002',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 3
                    },
                    {
                        'id': '28147497884013',
                        'name': 'child_leaf_003',
                        'parentId': '28147497884002',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 3
                    }
                ],
                28147497884003: [
                    {
                        'id': '28147497884004',
                        'name': 'child_branch_004',
                        'parentId': '28147497884003',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 4
                    },
                    {
                        'id': '28147497884014',
                        'name': 'child_leaf_004',
                        'parentId': '28147497884003',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 4
                    }
                ],
                28147497884004: [
                    {
                        'id': '28147497884005',
                        'name': 'child_branch_005',
                        'parentId': '28147497884004',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 5
                    },
                    {
                        'id': '28147497884015',
                        'name': 'child_leaf_005',
                        'parentId': '28147497884004',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 5
                    }
                ],
                28147497884005: [
                    {
                        'id': '28147497884006',
                        'name': 'child_branch_006',
                        'parentId': '28147497884005',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 6
                    },
                    {
                        'id': '28147497884016',
                        'name': 'child_leaf_006',
                        'parentId': '28147497884005',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 6
                    }
                ],
                28147497884006: [
                    {
                        'id': '28147497884007',
                        'name': 'child_branch_007',
                        'parentId': '28147497884006',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 7
                    },
                    {
                        'id': '28147497884017',
                        'name': 'child_leaf_007',
                        'parentId': '28147497884006',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 7
                    }
                ],
                28147497884007: [
                    {
                        'id': '28147497884008',
                        'name': 'child_branch_008',
                        'parentId': '28147497884007',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 8
                    },
                    {
                        'id': '28147497884018',
                        'name': 'child_leaf_008',
                        'parentId': '28147497884007',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 8
                    }
                ],
                28147497884008: [
                    {
                        'id': '28147497884009',
                        'name': 'child_branch_009',
                        'parentId': '28147497884008',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 9
                    },
                    {
                        'id': '28147497884019',
                        'name': 'child_leaf_009',
                        'parentId': '28147497884008',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 9
                    }
                ]
            }
        },
        rootWithLeafCollectionAndNodes: {
            rootId: 281474978623585,
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    }
                ]
            },
            leafChildren: {
                281474978846998: {
                    category: '',
                    id: '281474978846998',
                    name: 'child_leaf_001',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        }
                    ]
                }
            }
        },
        rootWithLeafCollectionAndDuplicatedNodes: {
            rootId: 281474978623585,
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'category': 'Public',
                    'level': 1
                },
                281474978846999: {
                    'id': '281474978846999',
                    'name': 'child_leaf_002',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'category': 'Private',
                    'level': 1
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'category': 'Public',
                        'level': 1
                    },
                    {
                        'id': '281474978846999',
                        'name': 'child_leaf_002',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'category': 'Private',
                        'level': 1
                    }
                ]
            },
            leafChildren: {
                281474978846998: {
                    category: '',
                    id: '281474978846998',
                    name: 'child_leaf_001',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        }
                    ]
                },
                281474978846999: {
                    category: '',
                    id: '281474978846999',
                    name: 'child_leaf_002',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        }
                    ]
                }
            }
        },
        rootWithLeafCollectionAndMultipleNodes: {
            rootId: 281474978623585,
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_leaf_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                },
                281474978846999: {
                    'id': '281474978846999',
                    'name': 'child_leaf_002',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'category': 'Private',
                    'level': 1
                },
                281474978847000: {
                    'id': '281474978846999',
                    'name': 'child_leaf_003',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 1
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_leaf_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    },
                    {
                        'id': '281474978846999',
                        'name': 'child_leaf_002',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    },
                    {
                        'id': '281474978847000',
                        'name': 'child_leaf_003',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 1
                    }

                ]
            },
            leafChildren: {
                281474978846998: {
                    category: '',
                    id: '281474978846998',
                    name: 'child_leaf_001',
                    objects: [
                        {
                            id: '281475059730933'
                        },
                        {
                            id: '281475029105735'
                        }
                    ]
                },
                281474978846999: {
                    category: '',
                    id: '281474978846999',
                    name: 'child_leaf_002',
                    objects: [
                        {
                            id: '281475029126429'
                        },
                        {
                            id: '281475029148688'
                        }
                    ]
                }
            }
        },
        rootWithMultipleBranchCollectionsAtSameLevel: {
            rootId: 281474978623585,
            roots: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                281474978623585: {
                    'id': '281474978623585',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'name': 'child_branch_001',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
                281474978846999: {
                    'id': '281474978846999',
                    'name': 'child_branch_002',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
                281474978847000: {
                    'id': '281474978846999',
                    'name': 'child_branch_003',
                    'parentId': '281474978623585',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 1
                },
                281474978847001: {
                    'id': '281474978847001',
                    'name': 'child_leaf_001',
                    'parentId': '281474978846998',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 2
                },
                281474978847002: {
                    'id': '281474978847002',
                    'name': 'child_leaf_002',
                    'parentId': '281474978846998',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 2
                },
                281474978847003: {
                    'id': '281474978847003',
                    'name': 'child_leaf_003',
                    'parentId': '281474978846999',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 2
                },
                281474978847004: {
                    'id': '281474978847004',
                    'name': 'child_leaf_004',
                    'parentId': '281474978846999',
                    'type': 'NESTED',
                    'subType': 'LEAF',
                    'level': 2
                }
            },
            children: {
                281474978623585: [
                    {
                        'id': '281474978846998',
                        'name': 'child_branch_001',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    },
                    {
                        'id': '281474978846999',
                        'name': 'child_branch_002',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    },
                    {
                        'id': '281474978847000',
                        'name': 'child_branch_003',
                        'parentId': '281474978623585',
                        'type': 'NESTED',
                        'subType': 'BRANCH',
                        'level': 1
                    }

                ],
                281474978846998: [
                    {
                        'id': '281474978847001',
                        'name': 'child_leaf_001',
                        'parentId': '281474978846998',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 2
                    },
                    {
                        'id': '281474978847002',
                        'name': 'child_leaf_002',
                        'parentId': '281474978846998',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 2
                    }
                ],
                281474978846999: [
                    {
                        'id': '281474978847003',
                        'name': 'child_leaf_003',
                        'parentId': '281474978846999',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 2
                    },
                    {
                        'id': '281474978847004',
                        'name': 'child_leaf_004',
                        'parentId': '281474978846999',
                        'type': 'NESTED',
                        'subType': 'LEAF',
                        'level': 2
                    }
                ]


            }
        },
        moreThanOneRoot: {
            rootId: 281474978623587,
            roots: {
                281474978623587: {
                    'id': '281474978623587',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            nodes: {
                281474978623587: {
                    'id': '281474978623587',
                    'parentId': null,
                    'name': 'Transport Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                },
                281474978846998: {
                    'id': '281474978846998',
                    'parentId': null,
                    'name': 'Root Non Custom Topology',
                    'category': 'Public',
                    'type': 'NESTED',
                    'subType': 'BRANCH',
                    'level': 0
                }
            },
            children: {
                281474978623587: [],
                281474978846998: []
            }
        }

    };
});


