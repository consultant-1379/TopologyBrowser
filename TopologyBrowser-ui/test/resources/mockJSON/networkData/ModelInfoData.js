if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {
        'EPG-OI': {
            'key': 'access-operations',
            'writeBehavior': 'PERSIST_AND_DELEGATE',
            'readBehavior': 'FROM_PERSISTENCE',
            'userExposure': 'ALWAYS',
            'immutable': false,
            'type': 'UNION',
            'constraints': null,
            'activeChoiceCase': null,
            'defaultValue': '*',
            'description': 'Access operations associated with this rule. This leaf matches if it has the value '*' or if the bit corresponding to the requested operation is set.',
            'namespaceversions': {
                'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                    '2012.2.22'
                ]
            },
            'trafficDisturbances': '',
            'precondition': '',
            'dependencies': '',
            'sideEffects': '',
            'unit': '',
            'multiplicationFactor': '',
            'lifeCycle': {
                'description': null,
                'state': 'CURRENT'
            },
            'listMembers': [
                {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': '',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': '\\*'
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': '',
                    'namespaceversions': {},
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': null
                },
                {
                    'key': 'BITS',
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': '',
                    'immutable': false,
                    'type': 'BITS',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': '',
                    'namespaceversions': {},
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': null,
                    'bitsMembers': [
                        {
                            'key': 'create',
                            'value': 0
                        },
                        {
                            'key': 'read',
                            'value': 1
                        },
                        {
                            'key': 'update',
                            'value': 2
                        },
                        {
                            'key': 'delete',
                            'value': 3
                        },
                        {
                            'key': 'exec',
                            'value': 4
                        }
                    ]
                }
            ]
        },
        'vEPG-OI': {
            'key': 'access-operations',
            'writeBehavior': 'PERSIST_AND_DELEGATE',
            'readBehavior': 'FROM_PERSISTENCE',
            'userExposure': 'ALWAYS',
            'immutable': false,
            'type': 'UNION',
            'constraints': null,
            'activeChoiceCase': null,
            'defaultValue': '*',
            'description': 'Access operations associated with this rule. This leaf matches if it has the value '*' or if the bit corresponding to the requested operation is set.',
            'namespaceversions': {
                'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                    '2012.2.22'
                ]
            },
            'trafficDisturbances': '',
            'precondition': '',
            'dependencies': '',
            'sideEffects': '',
            'unit': '',
            'multiplicationFactor': '',
            'lifeCycle': {
                'description': null,
                'state': 'CURRENT'
            },
            'listMembers': [
                {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': '',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': '',
                    'namespaceversions': {},
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': null
                },
                {
                    'key': 'BITS',
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': '',
                    'immutable': false,
                    'type': 'BITS',
                    'constraints': 'delete exec',
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': '',
                    'namespaceversions': {},
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': null,
                    'bitsMembers': [
                        {
                            'key': 'create',
                            'value': 0
                        },
                        {
                            'key': 'read',
                            'value': 1
                        },
                        {
                            'key': 'update',
                            'value': 2
                        },
                        {
                            'key': 'delete',
                            'value': 3
                        },
                        {
                            'key': 'exec',
                            'value': 4
                        }
                    ]
                }
            ]
        },
        'ericsson-bits-single': {
            'key': 'a-bits',
            'bitsMembers': [
                {
                    'key': 'create',
                    'value': 0
                },
                {
                    'key': 'read',
                    'value': 1
                },
                {
                    'key': 'update',
                    'value': 2
                },
                {
                    'key': 'delete',
                    'value': 3
                },
                {
                    'key': 'exec',
                    'value': 4
                }
            ],
            'writeBehavior': 'PERSIST_AND_DELEGATE',
            'readBehavior': 'FROM_PERSISTENCE',
            'userExposure': 'ALWAYS',
            'immutable': false,
            'type': 'BITS',
            'constraints': {
                'nullable': true,
            },
            'activeChoiceCase': null,
            'defaultValue': '*',
            'description': 'Access operations associated with this rule. This leaf matches if it has the value '*' or if the bit corresponding to the requested operation is set.',
            'namespaceversions': {
                'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                    '2012.2.22'
                ]
            },
            'trafficDisturbances': '',
            'precondition': '',
            'dependencies': '',
            'sideEffects': '',
            'unit': '',
            'multiplicationFactor': '',
            'lifeCycle': {
                'description': null,
                'state': 'CURRENT'
            }
        },
        common: {
            'moType': 'rule',
            'attributes': [
                {
                    'key': 'access-operations',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'UNION',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': '*',
                    'description': 'Access operations associated with this rule. This leaf matches if it has the value '*' or if the bit corresponding to the requested operation is set.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    },
                    'listMembers': [
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': '\\*'
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        },
                        {
                            'key': 'BITS',
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'BITS',
                            'constraints': null,
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null,
                            'bitsMembers': [
                                {
                                    'key': 'create',
                                    'value': 0
                                },
                                {
                                    'key': 'read',
                                    'value': 1
                                },
                                {
                                    'key': 'update',
                                    'value': 2
                                },
                                {
                                    'key': 'delete',
                                    'value': 3
                                },
                                {
                                    'key': 'exec',
                                    'value': 4
                                }
                            ]
                        }
                    ]
                },
                {
                    'key': 'action',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'The access control action associated with the rule. If a rule is determined to match a particular request, then this object is used to determine whether to permit or deny the request.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    },
                    'enumeration': {
                        'key': 'action-type',
                        'description': 'action-type',
                        'enumMembers': [
                            {
                                'key': 'permit',
                                'value': 0,
                                'description': 'Requested action is permitted.'
                            },
                            {
                                'key': 'deny',
                                'value': 1,
                                'description': 'Requested action is denied.'
                            }
                        ]
                    }
                },
                {
                    'key': 'comment',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'A textual description of the access rule.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'module-name',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'UNION',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': '*',
                    'description': 'Name of the module associated with this rule. This leaf matches if it has the value '*' or if the object being accessed is defined in the module with the specified module name.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    },
                    'listMembers': [
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': '\\*'
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        },
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': null
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        }
                    ]
                },
                {
                    'key': 'name',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': true,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': [
                            {
                                'minValue': 1,
                                'maxValue': 4294967295
                            }
                        ],
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'Arbitrary name assigned to the rule.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'notification-name',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'UNION',
                    'constraints': null,
                    'activeChoiceCase': {
                        'caseName': 'notification',
                        'choiceName': 'rule-type'
                    },
                    'defaultValue': null,
                    'description': 'This leaf matches if it has the value '*' or if its value equals the requested notification name.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    },
                    'listMembers': [
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': '\\*'
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        },
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': null
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        }
                    ]
                },
                {
                    'key': 'path',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': {
                        'caseName': 'data-node',
                        'choiceName': 'rule-type'
                    },
                    'defaultValue': null,
                    'description': 'Data Node Instance Identifier associated with the data node controlled by this rule. Configuration data or state data instance identifiers start with a top-level data node. A complete instance identifier is required for this type of path value. The special value '/' refers to all possible datastore contents.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'rpc-name',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'UNION',
                    'constraints': null,
                    'activeChoiceCase': {
                        'caseName': 'protocol-operation',
                        'choiceName': 'rule-type'
                    },
                    'defaultValue': null,
                    'description': 'This leaf matches if it has the value '*' or if its value equals the requested protocol operation name.',
                    'namespaceversions': {
                        'urn:ietf:params:xml:ns:yang:ietf-netconf-acm': [
                            '2012.2.22'
                        ]
                    },
                    'trafficDisturbances': '',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    },
                    'listMembers': [
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': '\\*'
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        },
                        {
                            'key': null,
                            'writeBehavior': null,
                            'readBehavior': null,
                            'userExposure': '',
                            'immutable': false,
                            'type': 'STRING',
                            'constraints': {
                                'nullable': true,
                                'valueRangeConstraints': null,
                                'validContentRegex': null
                            },
                            'activeChoiceCase': null,
                            'defaultValue': null,
                            'description': '',
                            'namespaceversions': {},
                            'trafficDisturbances': '',
                            'precondition': '',
                            'dependencies': '',
                            'sideEffects': '',
                            'unit': '',
                            'multiplicationFactor': '',
                            'lifeCycle': null
                        }
                    ]
                }
            ],
            'choices': [
                {
                    'name': 'rule-type',
                    'mandatory': false,
                    'cases': [
                        {
                            'name': 'protocol-operation',
                            'attributes': [
                                {
                                    'name': 'rpc-name'
                                }
                            ],
                            'description': 'protocol-operation',
                            'hasPrimaryType': false
                        },
                        {
                            'name': 'notification',
                            'attributes': [
                                {
                                    'name': 'notification-name'
                                }
                            ],
                            'description': 'notification',
                            'hasPrimaryType': false
                        },
                        {
                            'name': 'data-node',
                            'attributes': [
                                {
                                    'name': 'path'
                                }
                            ],
                            'description': 'data-node',
                            'hasPrimaryType': false
                        }
                    ]
                }
            ]
        },
        defaultNode: {
            'moType': 'ManagedElement',
            'attributes': [
                {
                    'key': 'administrativeState',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': 'UNLOCKED',
                    'description': 'The administrative state.\nIf set to SHUTTINGDOWN, the state will immediately be brought to LOCKED.',
                    'namespaceversions': {
                        'ReqAntennaSystem': [
                            '3.21.0'
                        ]
                    },
                    'trafficDisturbances': 'Changing this attribute can cause loss of traffic.',
                    'precondition': '',
                    'dependencies': '',
                    'sideEffects': '',
                    'unit': '',
                    'multiplicationFactor': '',
                    'lifeCycle': {
                        'state': 'CURRENT',
                        'description': null
                    },
                    'enumeration': {
                        'key': 'AdmState',
                        'description': 'Administrative state of a resource.',
                        'enumMembers': [
                            {
                                'key': 'memberNamespace1$$$LOCKED',
                                'value': 0,
                                'description': 'The resource is administratively prohibited from performing services for its users(enum1)',
                                'lifeCycleState': 'CURRENT'
                            },
                            {
                                'key': 'memberNamespace2$$$LOCKED',
                                'value': 1,
                                'description': 'The resource is administratively prohibited from performing services for its users(enum2)',
                                'lifeCycleState': 'CURRENT'
                            },
                            {
                                'key': 'UNLOCKED',
                                'value': 2,
                                'description': 'The resource is administratively permitted to perform services for its users.\nThis is independent of its inherent operability.',
                                'lifeCycleState': 'CURRENT'
                            },
                            {
                                'key': 'SHUTTINGDOWN',
                                'value': 3,
                                'description': 'Use of the resource is administratively permitted to existing instances of use only.\nWhile the system remains in the shutting down state the manager may at any time cause the managed object to revert to the locked state.',
                                'lifeCycleState': 'CURRENT'
                            }
                        ]
                    }
                },
                {
                    'key': 'dateTimeOffset',
                    'writeBehavior': 'NOT_ALLOWED',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 6,
                                'maxValue': 6
                            }
                        ],
                        'validContentRegex': '^([+|-])(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9])$'
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'Difference between the value of the localDateTime attribute and UTC.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'dnPrefix',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'It provides naming context that allows the managed objects to be partitioned into logical domains.\r\nA Distingushed Name (DN) is defined by 3GPP TS 32.300, which splits the DN into a DN Prefix and Local DN, for example DN format: dnPrefix=<DN Prefix>, localDn =<Local DN> Fault Management: dnPrefix does not impact Fault Management, since an NMS recognises a Managed Element by IP address Performance Management (PM): The dnPrefix is present in the PM Data file, Result Output Period (ROP) file, if the dnPrefix attribute is specified, that is, not an empty string. Example: DC=ericsson.se,g3SubNetwork=Sweden\r\nExample: DC=ericsson.se,g3SubNetwork=Sweden\r\n',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'mockLongAttribute',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'This is a mock attribute for min/max testing of a long in JS',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'mockObsoleteAttribute',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'This is a mock attribute for min/max testing of a long in JS',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'lifeCycle': {
                        'state': 'OBSOLETE'
                    }
                },
                {
                    'key': 'localDateTime',
                    'writeBehavior': 'NOT_ALLOWED',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 19,
                                'maxValue': 19
                            }
                        ],
                        'validContentRegex': '^([0-9]{4})-(1[0-2]|0[1-9])-(0[1-9]|[1|2][0-9]|3[0-1])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])([\\.][0-9]+){0,1}$'
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'This is the local date and time for the Managed Element.\r\nThe following format is used: YYYY-MM-DDThh:mm:ss\r\n\r\nThe meaning of each field is as follows:\r\nYYYY = four digit year\r\nMM = two digit month (01=January, etc.)\r\nDD = two digit day of month (01 through 31)\r\nT = time designator (shows start of time component)\r\nhh = two digits of hour (00 through 23, AM/PM not allowed)\r\nmm = two digits of minute (00 through 59)\r\nss = two digits of second (00 through 59, leap second not allowed)\r\nThe hyphen [-] and the colon [:] are used as separators within the date and time of day expressions, respectively.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'lifeCycle': {
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'managedElementId',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': true,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': null,
                        'validContentRegex': ''
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'Holds the name used when identifying the MO.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'lifeCycle': {
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'managedElementType',
                    'writeBehavior': 'NOT_ALLOWED',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'The type of product being managed.\r\nFor example the type could be  RBS or CSCF.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'networkManagedElementId',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'Replaces the value component of the RDN in the COM Northbound Interface. \nThis attribute shall, if used, be set to a simple alphanumeric value. The value should be unique within the network namespace.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'lifeCycle': {
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'licConnectedUsersPercentileConf',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'INTEGER',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': [
                            {
                                'minValue': 1,
                                'maxValue': 100
                            }
                        ],
                        'valueResolution': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': 90,
                    'description': 'The percentile to use for the counter pmLicConnectedUsersActual.',
                    'namespaceversions': {
                        'Lrat': [
                            '3.130.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'lifeCycle': {
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'neType',
                    'writeBehavior': 'INHERITED',
                    'readBehavior': 'INHERITED',
                    'userExposure': 'ALWAYS',
                    'immutable': true,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'This attribute represents node type.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'enumeration': {
                        'key': 'NeType',
                        'description': 'This represents the types of node',
                        'enumMembers': [
                            {
                                'key': 'BGF',
                                'value': 65697,
                                'description': 'BGF network element type'
                            },
                            {
                                'key': 'BSC',
                                'value': 66066,
                                'description': 'BSC network element type'
                            },
                            {
                                'key': 'BSP',
                                'value': 66079,
                                'description': 'BSP network element type'
                            },
                            {
                                'key': 'CCN-TSP',
                                'value': 1324816210,
                                'description': 'CCN-TSP network element type'
                            },
                            {
                                'key': 'CISCO-ASR900',
                                'value': 1225129997,
                                'description': 'CISCO-ASR900 network element type'
                            },
                            {
                                'key': 'CISCO-ASR9000',
                                'value': 675675709,
                                'description': 'CISCO-ASR9000 network element type'
                            },
                            {
                                'key': 'CSCF',
                                'value': 2077907,
                                'description': 'CSCF network element type'
                            },
                            {
                                'key': 'CSCF-TSP',
                                'value': 858206793,
                                'description': 'CSCF-TSP network element type'
                            },
                            {
                                'key': 'DSC',
                                'value': 67988,
                                'description': 'DSC network element type'
                            },
                            {
                                'key': 'EME',
                                'value': 68765,
                                'description': 'EME network element type'
                            },
                            {
                                'key': 'EOS',
                                'value': 68841,
                                'description': 'EOS network element type'
                            },
                            {
                                'key': 'EPG',
                                'value': 68860,
                                'description': 'EPG network element type'
                            },
                            {
                                'key': 'EPG-OI',
                                'value': 2051454027,
                                'description': 'EPG-OI network element type'
                            },
                            {
                                'key': 'ERBS',
                                'value': 2136510,
                                'description': 'ERBS network element type'
                            },
                            {
                                'key': 'ESC',
                                'value': 68949,
                                'description': 'ESC network element type'
                            },
                            {
                                'key': 'EXOS',
                                'value': 2142679,
                                'description': 'EXOS network element type'
                            },
                            {
                                'key': 'FRONTHAUL-6020',
                                'value': 911725804,
                                'description': 'FRONTHAUL-6020 network element type'
                            },
                            {
                                'key': 'FRONTHAUL-6080',
                                'value': 911725990,
                                'description': 'FRONTHAUL-6080 network element type'
                            },
                            {
                                'key': 'Fronthaul-6392',
                                'value': 2059915530,
                                'description': 'Fronthaul-6392 network element type'
                            },
                            {
                                'key': 'GenericESA',
                                'value': 1988953028,
                                'description': 'GenericESA network element type'
                            },
                            {
                                'key': 'HDS',
                                'value': 71383,
                                'description': 'HDS network element type'
                            },
                            {
                                'key': 'HLR-FE',
                                'value': 2133974814,
                                'description': 'HLR-FE network element type'
                            },
                            {
                                'key': 'HLR-FE-BSP',
                                'value': 957966608,
                                'description': 'HLR-FE-BSP network element type'
                            },
                            {
                                'key': 'HLR-FE-IS',
                                'value': 862185927,
                                'description': 'HLR-FE-IS network element type'
                            },
                            {
                                'key': 'HSS-FE',
                                'value': 2140469252,
                                'description': 'HSS-FE network element type'
                            },
                            {
                                'key': 'HSS-FE-TSP',
                                'value': 1017581672,
                                'description': 'HSS-FE-TSP network element type'
                            },
                            {
                                'key': 'IP-STP',
                                'value': 2129734551,
                                'description': 'IP-STP network element type'
                            },
                            {
                                'key': 'IP-STP-BSP',
                                'value': 77467973,
                                'description': 'IP-STP-BSP network element type'
                            },
                            {
                                'key': 'IPWorks',
                                'value': 1557609829,
                                'description': 'IPWorks network element type'
                            },
                            {
                                'key': 'JUNIPER-MX',
                                'value': 548151361,
                                'description': 'JUNIPER-MX network element type'
                            },
                            {
                                'key': 'JUNIPER-PTX',
                                'value': 187174146,
                                'description': 'JUNIPER-PTX network element type'
                            },
                            {
                                'key': 'JUNIPER-SRX',
                                'value': 187171325,
                                'description': 'JUNIPER-SRX network element type'
                            },
                            {
                                'key': 'MGW',
                                'value': 76285,
                                'description': 'MGW network element type'
                            },
                            {
                                'key': 'MINI-LINK-6351',
                                'value': 175213034,
                                'description': 'MINI-LINK-6351 network element type'
                            },
                            {
                                'key': 'MINI-LINK-6352',
                                'value': 175213033,
                                'description': 'MINI-LINK-6352 network element type'
                            },
                            {
                                'key': 'MINI-LINK-6366',
                                'value': 175212998,
                                'description': 'MINI-LINK-6366 network element type'
                            },
                            {
                                'key': 'MINI-LINK-665x',
                                'value': 175210080,
                                'description': 'MINI-LINK-665x network element type'
                            },
                            {
                                'key': 'MINI-LINK-669x',
                                'value': 175209956,
                                'description': 'MINI-LINK-669x network element type'
                            },
                            {
                                'key': 'MINI-LINK-CN210',
                                'value': 1123829463,
                                'description': 'MINI-LINK-CN210 network element type'
                            },
                            {
                                'key': 'MINI-LINK-CN510R1',
                                'value': 1960549493,
                                'description': 'MINI-LINK-CN510R1 network element type'
                            },
                            {
                                'key': 'MINI-LINK-CN510R2',
                                'value': 1960549492,
                                'description': 'MINI-LINK-CN510R2 network element type'
                            },
                            {
                                'key': 'MINI-LINK-CN810R1',
                                'value': 1957778930,
                                'description': 'MINI-LINK-CN810R1 network element type'
                            },
                            {
                                'key': 'MINI-LINK-CN810R2',
                                'value': 1957778929,
                                'description': 'MINI-LINK-CN810R2 network element type'
                            },
                            {
                                'key': 'MINI-LINK-Indoor',
                                'value': 276096208,
                                'description': 'MINI-LINK-Indoor network element type'
                            },
                            {
                                'key': 'MINI-LINK-PT2020',
                                'value': 101255747,
                                'description': 'MINI-LINK-PT2020 network element type'
                            },
                            {
                                'key': 'MRF',
                                'value': 76609,
                                'description': 'MRF network element type'
                            },
                            {
                                'key': 'MSC-BC-BSP',
                                'value': 2098438915,
                                'description': 'MSC-BC-BSP network element type'
                            },
                            {
                                'key': 'MSC-BC-IS',
                                'value': 1868807110,
                                'description': 'MSC-BC-IS network element type'
                            },
                            {
                                'key': 'MSC-DB',
                                'value': 2011829010,
                                'description': 'MSC-DB network element type'
                            },
                            {
                                'key': 'MSC-DB-BSP',
                                'value': 2140193600,
                                'description': 'MSC-DB-BSP network element type'
                            },
                            {
                                'key': 'MSRBS_V1',
                                'value': 183086755,
                                'description': 'MSRBS_V1 network element type'
                            },
                            {
                                'key': 'MTAS',
                                'value': 2376729,
                                'description': 'MTAS network element type'
                            },
                            {
                                'key': 'MTAS-TSP',
                                'value': 232278525,
                                'description': 'MTAS-TSP network element type'
                            },
                            {
                                'key': 'RBS',
                                'value': 80931,
                                'description': 'RBS network element type'
                            },
                            {
                                'key': 'RNC',
                                'value': 81287,
                                'description': 'RNC network element type'
                            },
                            {
                                'key': 'RVNFM',
                                'value': 78367953,
                                'description': 'RVNFM network element type'
                            },
                            {
                                'key': 'RadioNode',
                                'value': 1033560189,
                                'description': 'RadioNode network element type'
                            },
                            {
                                'key': 'RadioTNode',
                                'value': 1980163451,
                                'description': 'RadioTNode network element type'
                            },
                            {
                                'key': 'Router6274',
                                'value': 1373112958,
                                'description': 'Router6274 network element type'
                            },
                            {
                                'key': 'Router6672',
                                'value': 1373109116,
                                'description': 'Router6672 network element type'
                            },
                            {
                                'key': 'Router6675',
                                'value': 1373109113,
                                'description': 'Router6675 network element type'
                            },
                            {
                                'key': 'Router6x71',
                                'value': 1373045691,
                                'description': 'Router6x71 network element type'
                            },
                            {
                                'key': 'Router8800',
                                'value': 1373047831,
                                'description': 'Router8800 network element type'
                            },
                            {
                                'key': 'SAPC',
                                'value': 2537665,
                                'description': 'SAPC network element type'
                            },
                            {
                                'key': 'SBG',
                                'value': 81880,
                                'description': 'SBG network element type'
                            },
                            {
                                'key': 'SBG-IS',
                                'value': 1855634625,
                                'description': 'SBG-IS network element type'
                            },
                            {
                                'key': 'SGSN-MME',
                                'value': 337707129,
                                'description': 'SGSN-MME network element type'
                            },
                            {
                                'key': 'SIU02',
                                'value': 78910209,
                                'description': 'SIU02 network element type'
                            },
                            {
                                'key': 'SSR',
                                'value': 82418,
                                'description': 'SSR network element type'
                            },
                            {
                                'key': 'Switch-6391',
                                'value': 545798802,
                                'description': 'Switch-6391 network element type'
                            },
                            {
                                'key': 'TCU02',
                                'value': 79654984,
                                'description': 'TCU02 network element type'
                            },
                            {
                                'key': 'UPG',
                                'value': 84236,
                                'description': 'UPG network element type'
                            },
                            {
                                'key': 'VEPG',
                                'value': 2630886,
                                'description': 'VEPG network element type'
                            },
                            {
                                'key': 'VPN-TSP',
                                'value': 1379695928,
                                'description': 'VPN-TSP network element type'
                            },
                            {
                                'key': 'VTFRadioNode',
                                'value': 2053637173,
                                'description': 'VTFRadioNode network element type'
                            },
                            {
                                'key': 'WMG',
                                'value': 86065,
                                'description': 'WMG network element type'
                            },
                            {
                                'key': 'cSAPC-TSP',
                                'value': 13166584,
                                'description': 'cSAPC-TSP network element type'
                            },
                            {
                                'key': 'vBGF',
                                'value': 3581035,
                                'description': 'vBGF network element type'
                            },
                            {
                                'key': 'vBNG',
                                'value': 3581253,
                                'description': 'vBNG network element type'
                            },
                            {
                                'key': 'vCSCF',
                                'value': 111053385,
                                'description': 'vCSCF network element type'
                            },
                            {
                                'key': 'vDSC',
                                'value': 3583326,
                                'description': 'vDSC network element type'
                            },
                            {
                                'key': 'vEME',
                                'value': 3584103,
                                'description': 'vEME network element type'
                            },
                            {
                                'key': 'vEPG-OI',
                                'value': 597294015,
                                'description': 'vEPG-OI network element type'
                            },
                            {
                                'key': 'vHLR-FE',
                                'value': 514773228,
                                'description': 'vHLR-FE network element type'
                            },
                            {
                                'key': 'vHSS-FE',
                                'value': 508278790,
                                'description': 'vHSS-FE network element type'
                            },
                            {
                                'key': 'vIP-STP',
                                'value': 483515297,
                                'description': 'vIP-STP network element type'
                            },
                            {
                                'key': 'vIPWorks',
                                'value': 2064420507,
                                'description': 'vIPWorks network element type'
                            },
                            {
                                'key': 'vMRF',
                                'value': 3591947,
                                'description': 'vMRF network element type'
                            },
                            {
                                'key': 'vMSC',
                                'value': 3591975,
                                'description': 'vMSC network element type'
                            },
                            {
                                'key': 'vMSC-HC',
                                'value': 365609631,
                                'description': 'vMSC-HC network element type'
                            },
                            {
                                'key': 'vMTAS',
                                'value': 111352207,
                                'description': 'vMTAS network element type'
                            },
                            {
                                'key': 'vPP',
                                'value': 115958,
                                'description': 'vPP network element type'
                            },
                            {
                                'key': 'vSBG',
                                'value': 3597218,
                                'description': 'vSBG network element type'
                            },
                            {
                                'key': 'vSD',
                                'value': 116039,
                                'description': 'vSD network element type'
                            },
                            {
                                'key': 'vUPG',
                                'value': 3599574,
                                'description': 'vUPG network element type'
                            },
                            {
                                'key': 'vWCG',
                                'value': 3601093,
                                'description': 'vWCG network element type'
                            },
                            {
                                'key': 'vWMG',
                                'value': 3601403,
                                'description': 'vWMG network element type'
                            }
                        ]
                    }
                },
                {
                    'key': 'platformType',
                    'writeBehavior': 'INHERITED',
                    'readBehavior': 'INHERITED',
                    'userExposure': 'ALWAYS',
                    'immutable': true,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'This attribute represents platform type.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'enumeration': {
                        'key': 'PlatformType',
                        'description': 'This represents the types of platform',
                        'enumMembers': [
                            {
                                'key': 'CPP',
                                'value': 66947,
                                'description': 'CPP platform type'
                            },
                            {
                                'key': 'ECIM',
                                'value': 2122306,
                                'description': 'ECIM platform type'
                            },
                            {
                                'key': 'ER6000',
                                'value': 2052796519,
                                'description': 'ER6000 platform type'
                            },
                            {
                                'key': 'ESA',
                                'value': 68947,
                                'description': 'ESA platform type'
                            },
                            {
                                'key': 'EXTREME',
                                'value': 587302772,
                                'description': 'EXTREME platform type'
                            },
                            {
                                'key': 'FRONTHAUL-6000',
                                'value': 911725742,
                                'description': 'FRONTHAUL-6000 platform type'
                            },
                            {
                                'key': 'IPOS-OI',
                                'value': 1565899364,
                                'description': 'IPOS-OI platform type'
                            },
                            {
                                'key': 'IS',
                                'value': 2346,
                                'description': 'IS platform type'
                            },
                            {
                                'key': 'MINI-LINK-Indoor',
                                'value': 276096208,
                                'description': 'MINI-LINK-Indoor platform type'
                            },
                            {
                                'key': 'MINI-LINK-Outdoor',
                                'value': 1275859647,
                                'description': 'MINI-LINK-Outdoor platform type'
                            },
                            {
                                'key': 'R8800',
                                'value': 77452370,
                                'description': 'R8800 platform type'
                            },
                            {
                                'key': 'SSR',
                                'value': 82418,
                                'description': 'SSR platform type'
                            },
                            {
                                'key': 'STN',
                                'value': 82445,
                                'description': 'STN platform type'
                            },
                            {
                                'key': 'TSP',
                                'value': 83377,
                                'description': 'TSP platform type'
                            },
                            {
                                'key': 'VRE',
                                'value': 85257,
                                'description': 'VRE platform type'
                            }
                        ]
                    }
                },
                {
                    'key': 'productIdentity',
                    'writeBehavior': 'DELEGATE',
                    'readBehavior': 'FROM_DELEGATE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'LIST',
                    'constraints': {
                        'nullable': true,
                        'ordered': null,
                        'uniqueMembers': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': null
                            }
                        ]
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'Contains product information for the Managed Element and its Managed Functions.\r\nThis attribute is deprecated.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': '',
                    'listReference': {
                        'key': null,
                        'writeBehavior': null,
                        'readBehavior': null,
                        'userExposure': null,
                        'immutable': false,
                        'type': 'COMPLEX_REF',
                        'constraints': null,
                        'activeChoiceCase': null,
                        'defaultValue': null,
                        'description': null,
                        'namespaceversions': {},
                        'trafficDisturbances': '',
                        'complexRef': {
                            'key': 'ProductIdentity',
                            'description': 'Contains product information for a Managed Element and ManagedFunction(s).\r\nThis entity is deprecated.',
                            'attributes': [
                                {
                                    'key': 'productNumber',
                                    'writeBehavior': null,
                                    'readBehavior': null,
                                    'userExposure': null,
                                    'immutable': false,
                                    'type': 'STRING',
                                    'constraints': {
                                        'nullable': false,
                                        'valueRangeConstraints': null,
                                        'validContentRegex': null
                                    },
                                    'activeChoiceCase': null,
                                    'defaultValue': null,
                                    'description': 'The product number in Ericsson ABC format.\r\nFor information, refer to Ericsson Corporate Basic Standards.',
                                    'namespaceversions': {},
                                    'trafficDisturbances': ''
                                },
                                {
                                    'key': 'productRevision',
                                    'writeBehavior': null,
                                    'readBehavior': null,
                                    'userExposure': null,
                                    'immutable': false,
                                    'type': 'STRING',
                                    'constraints': {
                                        'nullable': false,
                                        'valueRangeConstraints': null,
                                        'validContentRegex': null
                                    },
                                    'activeChoiceCase': null,
                                    'defaultValue': null,
                                    'description': 'The product revision in the form R[1-9][A-Z].\r\nFor information, refer to Ericsson Corporate Basic Standards.',
                                    'namespaceversions': {},
                                    'trafficDisturbances': ''
                                },
                                {
                                    'key': 'productDesignation',
                                    'writeBehavior': null,
                                    'readBehavior': null,
                                    'userExposure': null,
                                    'immutable': false,
                                    'type': 'STRING',
                                    'constraints': {
                                        'nullable': false,
                                        'valueRangeConstraints': null,
                                        'validContentRegex': null
                                    },
                                    'activeChoiceCase': null,
                                    'defaultValue': null,
                                    'description': 'Common product name.',
                                    'namespaceversions': {},
                                    'trafficDisturbances': ''
                                }
                            ]
                        }
                    },
                    'lifeCycle': {
                        'state': 'CURRENT'
                    }
                },
                {
                    'key': 'release',
                    'writeBehavior': 'NOT_ALLOWED',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'The release of the product type specified by the attribute managedElementType. \r\nIt commonly contains the Managed Element release, for example L12.0, 13A, R1A',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'siteLocation',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'A freetext attribute describing the geographic location of a Managed Element.\r\n',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'timeZone',
                    'writeBehavior': 'NOT_ALLOWED',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'This is the timeZone in which the Managed Element resides. \r\nThe possible values for this attribute are defined in the public-domain zoneinfo or Olson database. Locations are identified by a string indicating the continent or ocean and then the name of the location, typically the largest city within the region. See http://www.iana.org/time-zones for more information. Example: Europe/Stockholm.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'userLabel',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'A freetext string for additional information to assist Managed Element identification.',
                    'namespaceversions': {
                        'ComTop': [
                            '10.20.0'
                        ]
                    },
                    'trafficDisturbances': ''
                },
                {
                    'key': 'community-list',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'userExposure': 'ALWAYS',
                    'immutable': false,
                    'type': 'LIST',
                    'constraints': {
                        'nullable': true,
                        'ordered': null,
                        'uniqueMembers': false,
                        'valueRangeConstraints': [
                            {
                                'minValue': 1,
                                'maxValue': 8
                            }
                        ]
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'Community number list',
                    'namespaceversions': {
                        'urn:rdns:com:ericsson:oammodel:ericsson-route-policy-ipos': [
                            '1.0.3'
                        ]
                    },
                    'lifeCycle': {
                        'description': null,
                        'state': 'CURRENT'
                    },
                    'listReference': {
                        'key': 'community-list',
                        'writeBehavior': 'PERSIST_AND_DELEGATE',
                        'readBehavior': 'FROM_PERSISTENCE',
                        'userExposure': 'ALWAYS',
                        'immutable': false,
                        'type': 'UNION',
                        'constraints': null,
                        'description': 'Community number list',
                        'namespaceversions': {},
                        'multiplicationFactor': '',
                        'lifeCycle': {
                            'description': null,
                            'state': 'CURRENT'
                        },
                        'listMembers': [
                            {
                                'key': null,
                                'writeBehavior': null,
                                'readBehavior': null,
                                'userExposure': '',
                                'immutable': false,
                                'type': 'STRING',
                                'constraints': {
                                    'nullable': true,
                                    'valueRangeConstraints': null,
                                    'validContentRegex': '^[0-9]{1,5}:[0-9]{1,5}$'
                                },
                            },
                            {
                                'key': null,
                                'writeBehavior': null,
                                'readBehavior': null,
                                'userExposure': '',
                                'immutable': false,
                                'type': 'ENUM_REF',
                                'constraints': null,
                                'activeChoiceCase': null,
                                'defaultValue': null,
                                'enumeration': {
                                    'key': 'community-list',
                                    'description': 'community-list',
                                    'enumMembers': [
                                        {
                                            'key': 'no-export',
                                            'value': 0,
                                            'description': 'Do not export to next AS (well-known community)'
                                        },
                                        {
                                            'key': 'no-advertise',
                                            'value': 1,
                                            'description': 'Do not advertise to any peer (well-known community)'
                                        },
                                        {
                                            'key': 'local-as',
                                            'value': 2,
                                            'description': 'Do not send outside a confed sub-as (well-known community)'
                                        },
                                        {
                                            'key': 'internet',
                                            'value': 3,
                                            'description': 'Advertise to the community of all routers on the Internet'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            'choices': []
        },
        OSS_TOP: {
            'moType': 'SubNetwork',
            'attributes': [
                {
                    'key': 'SubNetworkId',
                    'writeBehavior': 'INHERITED',
                    'readBehavior': 'INHERITED',
                    'userExposure': 'ALWAYS',
                    'immutable': true,
                    'type': 'STRING',
                    'constraints': {
                        'nullable': false,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': 'The ID of this SubNetwork.',
                    'namespaceversions': {
                        'OSS_TOP': [
                            '3.0.0'
                        ]
                    },
                    'trafficDisturbances': ''
                }
            ],
            'choices': []
        },
        RBS: {
            'title': 'Failure: User should not see this',
            'body': 'Mock 401 Message: Unauthorized with node Id: '
        },
        unknownServerError: {
            'title': 'Unknown server error',
            'body': 'There was an unknown server error. '
        },
        getModelInfo: function(neType, extraData) {
            var data;
            switch (neType) {
            case 'EPG-OI': {
                data = JSON.parse((JSON.stringify(this.common)));
                data.attributes[0] =   JSON.parse((JSON.stringify(this['EPG-OI'])));
                break;
            }
            case 'vEPG-OI': {
                data = JSON.parse((JSON.stringify(this.common)));
                data.attributes[0] =  JSON.parse((JSON.stringify(this['vEPG-OI'])));
                break;
            }
            case 'ericsson_bits': {
                data = JSON.parse((JSON.stringify(this.common)));
                data.attributes[0] =  JSON.parse((JSON.stringify(this['ericsson-bits-single'])));
                break;
            }
            case 'RadioNode': {
                data = JSON.parse((JSON.stringify(this.defaultNode)));
                break;
            }
            case 'OSS_TOP': {
                data = JSON.parse((JSON.stringify(this.OSS_TOP)));
                break;
            }
            case 'RBS': {
                data = JSON.parse((JSON.stringify(this.RBS)));
                data.body = data.body.concat(extraData);
                break;
            }
            default: {
                data = JSON.parse((JSON.stringify(this.unknownServerError)));
                data.body = data.body.concat('No data in the mock server for neType : ' + neType);
            }
            }

            return data;
        }
    };
});
