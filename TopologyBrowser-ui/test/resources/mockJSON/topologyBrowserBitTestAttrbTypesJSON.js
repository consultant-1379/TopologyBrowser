define([], function() {
    return {
        moAttributesResponse: {

            'name': '1',
            'type': 'ENodeBFunction',
            'poId': 844424930295326,
            'id': '844424930295326',
            'fdn': 'MeContext=ERBS000,ManagedElement=1,ENodeBFunction=1',
            'attributes': [
                {
                    'key': 'x2WhiteList',
                    'value': [[
                        {
                            key: 'enbId',
                            value: 1
                        },
                        {
                            key: 'mcc',
                            value: 1
                        },
                        {
                            key: 'mnc',
                            value: 1
                        },
                        {
                            key: 'mncLength',
                            value: 2
                        }
                    ]]
                },
                {
                    'key': 'tempShortType',
                    'value': 1
                },
                {
                    'key': 'biasThpWifiMobility',
                    'value': 11
                },
                {
                    'key': 'nnsfMode',
                    'value': 'RPLMN_IF_SAME_AS_SPLMN'
                },
                {
                    'key': 'sctpRef',
                    'value': 'test'
                },

                {
                    'key': 'tHODataFwdReordering',
                    'value': 50
                },



                {
                    'key': 'zzzTemporary9',
                    'value': -2000000000
                },
                {
                    'key': 'pmZtemporary34',
                    'value': null
                },
                {
                    'key': 'ENodeBFunctionId',
                    'value': '1'
                },
                {
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 357
                        },
                        {
                            'key': 'mnc',
                            'value': 32
                        },
                        {
                            'key': 'mncLength',
                            value: 3
                        }
                    ]
                },
                {
                    'key': 'zzzTemporary7',
                    'value': ''
                },
                {
                    'key': 'pmZtemporary35',
                    'value': 15
                },
                {
                    'key': 'zzzTemporary8',
                    'value': ''
                },
                {
                    'key': 'dscpLabel',
                    'value': 25
                },
                {
                    'key': 'userLabel',
                    'value': 'teamMavericks'
                },
                {
                    'key': 'rrcConnReestActive',
                    'value': false
                },
                {
                    'key': 'dnsLookupOnTai',
                    'value': 'ON'
                },
                {
                    'key': 'x2retryTimerStart',
                    'value': 1000
                },
                {
                    'key': 'upIpAccessHostRef',
                    'value': null
                },
                {
                    'key': 'ulTransNwBandwidth',
                    'value': 1000
                },
                {
                    'key': 'ulAccGbrAdmThresh',
                    'value': 1000
                },
                {
                    'key': 'dlTransNwBandwidth',
                    'value': 1000
                },
                {
                    'key': 'timeAndPhaseSynchCritical',
                    'value': false
                },
                {
                    'key': 'schedulingStrategy',
                    'value': 'ROUND_ROBIN'
                },
                {
                    'key': 'ulSchedulerDynamicBWAllocationEnabled',
                    'value': true
                },
                {
                    'key': 'oaMLinkSuperVisionActive',
                    'value': false
                },
                {
                    'key': 'zzzTemporary2',
                    'value': ''
                },
                {
                    'key': 'zzzTemporary1',
                    'value': ''
                },
                {
                    'key': 'dnsLookupTimer',
                    'value': 108
                },
                {
                    'key': 'pmPdcpPktDiscDlEth',
                    'value': null
                },
                {
                    'key': 'zzzTemporary4',
                    'value': ''
                },
                {
                    'key': 'zzzTemporary3',
                    'value': 'aa'
                },
                {
                    'key': 'collectLogsStatus',
                    'value': 'NOT_STARTED'
                },
                {
                    'key': 'zzzTemporary6',
                    'value': ''
                },
                {
                    'key': 'zzzTemporary10',
                    'value': -2000000000
                },
                {
                    'key': 's1RetryTimer',
                    'value': 30
                },
                {

                    'key': 'x2BlackList',
                    'value': [
                        [
                            {
                                'key': 'mnc',
                                'value': 1
                            },
                            {
                                'key': 'mcc',
                                'value': 1
                            },
                            {
                                'key': 'mncLength',
                                'value': 2
                            },
                            {
                                'key': 'enbId',
                                'value': 0
                            }
                        ],
                        [
                            {
                                'key': 'mnc',
                                'value': 1
                            },
                            {
                                'key': 'mcc',
                                'value': 1
                            },
                            {
                                'key': 'mncLength',
                                'value': 2
                            },
                            {
                                'key': 'enbId',
                                'value': 0
                            }
                        ]
                    ]

                },
                {
                    'key': 'zzzTemporary5',
                    'value': ''
                },
                {
                    'key': 'zzzTemporary11',
                    'value': -2000000000
                },
                {
                    'key': 'zzzTemporary12',
                    'value': -2000000000
                },
                {
                    'key': 'collectTraceStatus',
                    'value': null
                },
                {
                    'key': 'x2IpAddrViaS1Active',
                    'value': true,
                },
                {
                    'key': 'dlAccGbrAdmThresh',
                    'value': 1000
                },
                {
                    'key': 'x2retryTimerMaxAuto',
                    'value': 1440
                },
                {
                    'key': 'eNBId',
                    'value': 8
                }
            ],
            'childrens': null

        },


        moNonPersistAttributesResponse:
        {

            'moType': 'ENodeBFunction',
            'writeBehavior': 'NOT_ALLOWED',
            'attributes': [
                {
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 100
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 2,
                    'description': 'Temporary Short Type.',
                    'immutable': false,
                    'key': 'tempShortType',
                    'namespaceversions': {},
                    'readBehavior': null,
                    'type': 'SHORT',
                    'writeBehavior': null
                },
                {
                    'constraints': {
                        nullable: true,
                        valueRangeConstraints: [
                            {
                                minValue: 0,
                                maxValue: 64
                            }
                        ],
                        ordered: null,
                        uniqueMembers: null
                    },
                    'defaultValue': null,
                    'description': 'The list of whitelisted RBS IDs. Automated Neighbor Relations (ANR) is not allowed to disconnect X2 for any neighbor RBS in the whitelist.',
                    'immutable': false,
                    'key': 'x2WhiteList',
                    'listReference': {
                        'complexRef': {
                            'attributes': [
                                {
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 2,
                                                'maxValue': 3
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 2,
                                    'description': 'This parameter defines the number of digits for the Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.??The PLMN identity combines the following two parts:?1. MobileCountryCode, MCC, 3 digits?2. MobileNetworkCode, MNC, 2 or 3 digits??Example: If MCC=125 and MNC=46, then plmnId=12546.',
                                    'immutable': false,
                                    'key': 'mncLength',
                                    'namespaceversions': {},
                                    'readBehavior': null,
                                    'type': 'INTEGER',
                                    'writeBehavior': null
                                },
                                {
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 0,
                                                'maxValue': 999
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 1,
                                    'description': 'Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.',
                                    'immutable': false,
                                    'key': 'mnc',
                                    'namespaceversions': {},
                                    'readBehavior': null,
                                    'type': 'INTEGER',
                                    'writeBehavior': null
                                },
                                {
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 0,
                                                'maxValue': 1048575
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 0,
                                    'description': 'ENodeB Id',
                                    'immutable': false,
                                    'key': 'enbId',
                                    'namespaceversions': {},
                                    'readBehavior': null,
                                    'type': 'INTEGER',
                                    'writeBehavior': null
                                },
                                {
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 0,
                                                'maxValue': 999
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 1,
                                    'description': 'Mobile Country Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.',
                                    'immutable': false,
                                    'key': 'mcc',
                                    'namespaceversions': {},
                                    'readBehavior': null,
                                    'type': 'INTEGER',
                                    'writeBehavior': null
                                }
                            ],
                            'description': 'GlobalEnbId',
                            'key': 'GlobalEnbId'
                        },
                        'constraints': null,
                        'defaultValue': null,
                        'description': null,
                        'immutable': false,
                        'key': null,
                        'namespaceversions': {},
                        'readBehavior': null,
                        'type': 'COMPLEX_REF',
                        'writeBehavior': null
                    },
                    'namespaceversions': {
                        ERBS_NODE_MODEL: ['7.1.220']
                    },
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LIST',
                    'writeBehavior': 'PERSIST_AND_DELEGATE'
                },
                {
                    'constraints': {
                        nullable: true,
                        valueRangeConstraints: [
                            {
                                minValue: 1,
                                maxValue: 100
                            }
                        ],
                        valueResolution: null
                    },
                    'defaultValue': 10,
                    'description': 'In order to send a UE to WiFi, a throughput comparison is made between WiFi and LTE. ?For comparisons made in eNodeB, a UE is admitted to WiFi if, WiFi throughput > biasThpWifiMobility * LTE throughput.',
                    'immutable': false,
                    'key': 'biasThpWifiMobility',
                    'namespaceversions': {
                        ERBS_NODE_MODEL: ['7.1.220']
                    },
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'INTEGER',
                    'writeBehavior': 'PERSIST_AND_DELEGATE'
                },
                {
                    'key': 'ENodeBFunctionId',
                    'immutable': true,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': null,
                    'description': 'The value component of the RDN.'
                },
                {
                    'key': 'collectLogsStatus',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'defaultValue': null,
                    'description': 'Status of logs collection, initiated with operation collectAutIntLogs.',
                    'enumeration': {
                        'key': 'CollectLogsStatus',
                        'description': 'CollectLogsStatus',
                        'enumMembers': [
                            {
                                'key': 'NOT_STARTED',
                                'value': 0,
                                'description': 'Initial value.'
                            },
                            {
                                'key': 'COLLECTING',
                                'value': 1,
                                'description': 'Logs collection ongoing.'
                            },
                            {
                                'key': 'FINISHED',
                                'value': 2,
                                'description': 'Logs collection has finished OK.'
                            },
                            {
                                'key': 'FAILED',
                                'value': 3,
                                'description': 'Log collection failed.'
                            }
                        ]
                    }
                },
                {
                    'key': 'collectTraceStatus',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'defaultValue': null,
                    'description': 'Status of trace collection, initiated with operation collectTraces.',
                    'enumeration': {
                        'key': 'NodeBFunction_CollectTraceStatus',
                        'description': 'NodeBFunction_CollectTraceStatus',
                        'enumMembers': [
                            {
                                'key': 'NOT_STARTED',
                                'value': 0,
                                'description': 'Initial value.'
                            },
                            {
                                'key': 'COLLECTING',
                                'value': 1,
                                'description': 'Trace collection ongoing.'
                            },
                            {
                                'key': 'FINISHED',
                                'value': 2,
                                'description': 'Trace collection has finished OK.'
                            },
                            {
                                'key': 'FAILED',
                                'value': 3,
                                'description': 'Trace collection failed.'
                            }
                        ]
                    }
                },
                {
                    'key': 'dlAccGbrAdmThresh',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 1000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 1000,
                    'description': 'Deprecated: Since L11B. Replaced by AdmissionControl::dlGbrAdmThresh. \nAdmission threshold on accumulated Guaranteed Bit Rate (GBR) in the downlink, expressed as a fraction of the downlink transport network bandwidth for LTE.\n\nUnit: 0.001\nResolution: 1\nDependencies: The downlink transport network bandwidth for LTE needs to be configured into attribute ENodeBFunction::dlTransNwBandwidth.\nTakes effect: Immediately'
                },
                {
                    'key': 'dlTransNwBandwidth',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 1000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 1000,
                    'description': 'Deprecated: Replaced by AdmissionControl::dlTransNwBandwidth. Since L11B.\nDownlink transport network bandwidth for LTE.\n\nUnit: Mbps\nResolution: 1\nTakes effect: Immediately'
                },
                {
                    'key': 'dnsLookupOnTai',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'defaultValue': 'ON',
                    'description': 'Controls if the Tracking Area Identity (TAI) is used to get IP addresses of MME nodes from the Domain Name System (DNS).\n\nThe RBS uses TAI to automatically obtain all MME IP addresses from the DNS when dnsLookupOnTai is switched on, or at RBS start or restart.\n\nThe MME IP address list is refreshed periodically and MME connections released and setup according to the new list. The MME IP address list can also be refreshed from OSS-RC.\n\nTakes effect: Immediately.',
                    'enumeration': {
                        'key': 'DnsLookup',
                        'description': 'DnsLookup',
                        'enumMembers': [
                            {
                                'key': 'OFF',
                                'value': 0,
                                'description': 'OFF'
                            },
                            {
                                'key': 'ON',
                                'value': 1,
                                'description': 'ON'
                            }
                        ]
                    }
                },
                {
                    'key': 'dnsLookupTimer',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 1000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 0,
                    'description': 'The interval to perform DNS Lookup to get potential new IP addresses of MME nodes. DNS lookup is performed for the TAI domain name. If the value is set to zero, then no periodic DNS Lookup is done.\n\nUnit: 1 Hour.\nResolution: 1\nTakes effect: Immediately.'
                },
                {
                    'key': 'dscpLabel',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 63
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 24,
                    'description': 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).\n\nResolution: 1\nDependencies: Will only be used then dscpUsage is active.\nTakes effect: Node restart'
                },
                {
                    'key': 'eNBId',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': -1,
                                'maxValue': 1048575
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': -1,
                    'description': 'The ENodeB ID that forms part of the Cell Global Identity, and is also used to identify the node over the S1 interface.\n\nTakes effect: At node restart'
                },
                {
                    'key': 'eNodeBPlmnId',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'COMPLEX_REF',
                    'constraints': null,
                    'defaultValue': null,
                    'description': 'The ENodeB Public Land Mobile Network (PLMN) ID that forms part of the ENodeB Global ID used to identify the node over the S1 interface.\n\nTakes effect: At node restart',
                    'complexRef': {
                        'key': 'PlmnIdentity',
                        'description': 'Describes a PLMN id.',
                        'attributes': [
                            {
                                'key': 'mncLength',
                                'immutable': false,
                                'writeBehavior': null,
                                'type': 'INTEGER',
                                'constraints': {
                                    'nullable': true,
                                    'valueRangeConstraints': [
                                        {
                                            'minValue': 2,
                                            'maxValue': 3
                                        }
                                    ],
                                    'valueResolution': null
                                },
                                'defaultValue': 2,
                                'description': 'The length of the MNC part of a PLMN identity used in the radio network.'
                            },
                            {
                                'key': 'mnc',
                                'immutable': false,
                                'writeBehavior': null,
                                'type': 'INTEGER',
                                'constraints': {
                                    'nullable': true,
                                    'valueRangeConstraints': [
                                        {
                                            'minValue': 0,
                                            'maxValue': 999
                                        }
                                    ],
                                    'valueResolution': null
                                },
                                'defaultValue': 1,
                                'description': 'The MNC part of a PLMN identity used in the radio network.'
                            },
                            {
                                'key': 'mcc',
                                'immutable': false,
                                'writeBehavior': null,
                                'type': 'INTEGER',
                                'constraints': {
                                    'nullable': true,
                                    'valueRangeConstraints': [
                                        {
                                            'minValue': 0,
                                            'maxValue': 999
                                        }
                                    ],
                                    'valueResolution': null
                                },
                                'defaultValue': 1,
                                'description': 'The MCC part of a PLMN identity used in the radio network.'
                            }
                        ]
                    }
                },
                {
                    'key': 'nnsfMode',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'defaultValue': 'RPLMN_IF_SAME_AS_SPLMN',
                    'description': 'The mode used by the RBS for the non-access stratum node selection.\n\nRegardless of the mode used, the function attempts to:\n\n- Reconnect every UE to its registered MME in any of the tracking areas of the cell. \n\n- Distribute the UEs that are not reconnected among MMEs that serve the Public Land Mobile Network selected by each UE.\n\nTakes effect: New connection',
                    'enumeration': {
                        'key': 'NnsfModeVals',
                        'description': 'NnsfModeVals',
                        'enumMembers': [
                            {
                                'key': 'SPLMN',
                                'value': 0,
                                'description': 'The function distributes all UEs which are not registered in any of the tracking areas of the cell (tries to reconnect if UE provides S-TMSI, thus registered in one of the tracking areas of the cell).'
                            },
                            {
                                'key': 'RPLMN_IF_SAME_AS_SPLMN',
                                'value': 1,
                                'description': 'The function distributes all UEs which are not registered in the PLMN they select (tries to reconnect if UE provides S-TMSI or if otherwise registered in the PLMN that it selects).'
                            },
                            {
                                'key': 'RPLMN_IF_MME_SERVES_SPLMN',
                                'value': 2,
                                'description': 'The function distributes all UEs which are registered in some PLMN which is not served by any MME which is connected to eNB (tries to reconnect if UE provides S-TMSI or is otherwise registered in an MME which serves the PLMN that it selects).'
                            }
                        ]
                    }
                },
                {
                    'key': 'oaMLinkSuperVisionActive',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'defaultValue': true,
                    'description': 'Controls enabling and disabling the supervision function that restarts the RBS when the O&M link is disabled.\n\nTakes effect: Immediately.'
                },
                {
                    'key': 'pmPdcpPktDiscDlEth',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': null,
                    'description': 'Total number of downlink DRB packets (PDCP SDUs) discarded in the Ethernet part of the eNB.\n\nUnit: -\nCondition: Discarded PDCP SDUs in the Ethernet part between GTP-u and PDCP layer.\nCounter type: ACC\nSampling rate: -\nScanner: Primary\nCounter is reset after measurement period: Yes'
                },
                {
                    'key': 'pmZtemporary34',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': null,
                    'description': 'Normally this counter is not used, it can however sometimes be temporarily used for very late additions in a release. If so, for description see Network Impact Report in the CPI.\n\nUnit: -\nCondition: -\nCounter type: ACC\nSampling rate: -\nScanner: Not included in any predefined scanner \nCounter is reset after measurement period: Yes'
                },
                {
                    'key': 'pmZtemporary35',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': null,
                    'description': 'Normally this counter is not used, it can however sometimes be temporarily used for very late additions in a release. If so, for description see Network Impact Report in the CPI.\n\nUnit: -\nCondition: -\nCounter type: ACC\nSampling rate: -\nScanner: Not included in any predefined scanner \nCounter is reset after measurement period: Yes'
                },
                {
                    'key': 'rrcConnReestActive',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'defaultValue': false,
                    'description': 'Indicates if the feature RRC Connection Reestablishment is ACTIVATED or DEACTIVATED.\n\nTakes effect: Immediately'
                },
                {
                    'key': 's1RetryTimer',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 1,
                                'maxValue': 300
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 30,
                    'description': 'Defines the frequency to perform re-establishment of SCTP and S1-AP connection,\nwhen the connection to a MME is lost.\n\nUnit: 1s\nResolution: 1\nTakes effect: Immediately.'
                },
                {
                    'key': 'schedulingStrategy',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'defaultValue': 'ROUND_ROBIN',
                    'description': 'Deprecated: Since L12A. Planned to be removed.\nThe scheduling strategy that is used in the RBS.\n\nTakes effect: Immediately',
                    'enumeration': {
                        'key': 'SchedulingStrategy',
                        'description': 'Deprecated: Since L12A.',
                        'enumMembers': [
                            {
                                'key': 'STRICT_PRIORITY',
                                'value': 0,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'ROUND_ROBIN',
                                'value': 1,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'RESOURCE_FAIR',
                                'value': 3,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'PROPORTIONAL_FAIR_MEDIUM',
                                'value': 4,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'PROPORTIONAL_FAIR_LOW',
                                'value': 5,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'PROPORTIONAL_FAIR_HIGH',
                                'value': 6,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'MAXIMUM_CQI',
                                'value': 7,
                                'description': 'Deprecated: Since L12A.'
                            },
                            {
                                'key': 'EQUAL_RATE',
                                'value': 8,
                                'description': 'Deprecated: Since L12A.'
                            }
                        ]
                    }
                },
                {
                    'key': 'sctpRef',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'MO_REF',
                    'constraints': null,
                    'defaultValue': null,
                    'description': 'Refers to the SCTP instance that is used to configure the SCTP host for S1 and X2 connections.\n\nTakes effect: At node restart'
                },
                {
                    'key': 'tHODataFwdReordering',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 1,
                                'maxValue': 3000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 50,
                    'description': 'Target eNodeB supervision of the DL data forwarding activity.\nThe timer is started when DL data on S1-U is received. At expiry the tunnel end-point for DL forwarding is locally released.\n\nUnit: ms\nResolution: 1\nTakes effect: Immediately'
                },
                {
                    'key': 'timeAndPhaseSynchCritical',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'defaultValue': false,
                    'description': 'Indicates if the cell can operate as an asynchronous cell under error conditions.\n\nDependencies: The parameter is relevant when parameters featureStateTimeAndPhaseSynchWithGPS and licenseStateTimeAndPhaseSynchWithGPS in MO class TimeAndPhaseSynchWithGPS are ACTIVATED and ENABLED\nTakes effect: Immediately'
                },
                {
                    'key': 'ulAccGbrAdmThresh',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 1000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 1000,
                    'description': 'Deprecated: Replaced by AdmissionControl::ulGbrAdmThresh. Since L11B.\nAdmission threshold on accumulated Guaranteed Bit Rate (GBR) in the uplink, expressed as a fraction of the uplink transport network bandwidth for LTE.\n\nUnit: 0.001\nResolution: 1\nDependencies: The uplink transport network bandwidth for LTE needs to be configured into attribute ENodeBFunction::ulTransNwBandwidth.\nTakes effect: Immediately'
                },
                {
                    'key': 'ulSchedulerDynamicBWAllocationEnabled',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'defaultValue': true,
                    'description': 'Specifies if the advanced UL scheduler is enabled\n\nTakes effect: Immediately'
                },
                {
                    'key': 'ulTransNwBandwidth',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 1000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 1000,
                    'description': 'Deprecated: Replaced by AdmissionControl::ulTransNwBandwidth. Since L11B.\nUplink transport network bandwidth for LTE.\n\nUnit: Mbps\nResolution: 1\nTakes effect: Immediately'
                },
                {
                    'key': 'upIpAccessHostRef',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'MO_REF',
                    'constraints': null,
                    'defaultValue': null,
                    'description': 'Refers to the IpAccessHostEt instance to use for configuring the IP access host for S1 and X2 user plane connections. This attribute must contain a valid MO reference if the IPsec function is used.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'userLabel',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 128
                            }
                        ],
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Label for free use.'
                },
                {

                    'key': 'x2BlackList',
                    'writeBehavior': 'PERSIST_AND_DELEGATE',
                    'readBehavior': 'FROM_DELEGATE',
                    'immutable': false,
                    'type': 'LIST',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 64
                            }
                        ],
                        'ordered': null,
                        'uniqueMembers': false
                    },
                    'defaultValue': null,
                    'description': 'A list of blacklisted RBS IDs. X2 may not be set up to any neighbor RBS in the blacklist.',
                    'listReference': {
                        'key': null,
                        'writeBehavior': null,
                        'immutable': false,
                        'type': 'COMPLEX_REF',
                        'constraints': null,
                        'defaultValue': null,
                        'description': null,
                        'complexRef': {
                            'key': 'GlobalEnbId',
                            'description': 'GlobalEnbId',
                            'attributes': [
                                {
                                    'key': 'mncLength',
                                    'writeBehavior': null,
                                    'immutable': false,
                                    'type': 'INTEGER',
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 2,
                                                'maxValue': 3
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 2,
                                    'description': 'This parameter defines the number of digits for the Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.\n\n\n\nThe PLMN identity combines the following two parts:\n\n1. MobileCountryCode, MCC, 3 digits\n\n2. MobileNetworkCode, MNC, 2 or 3 digits\n\n\n\nExample: If MCC=125 and MNC=46, then plmnId=12546.'
                                },
                                {
                                    'key': 'mcc',
                                    'writeBehavior': null,
                                    'immutable': false,
                                    'type': 'INTEGER',
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 0,
                                                'maxValue': 999
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 1,
                                    'description': 'Mobile Country Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.'
                                },
                                {
                                    'key': 'enbId',
                                    'writeBehavior': null,
                                    'immutable': false,
                                    'type': 'INTEGER',
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 0,
                                                'maxValue': 1048575
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 0,
                                    'description': 'ENodeB Id'
                                },
                                {
                                    'key': 'mnc',
                                    'writeBehavior': null,
                                    'immutable': false,
                                    'type': 'INTEGER',
                                    'constraints': {
                                        'nullable': true,
                                        'valueRangeConstraints': [
                                            {
                                                'minValue': 0,
                                                'maxValue': 999
                                            }
                                        ],
                                        'valueResolution': null
                                    },
                                    'defaultValue': 1,
                                    'description': 'Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.'
                                }
                            ]
                        }
                    }

                },
                {
                    'key': 'x2IpAddrViaS1Active',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'defaultValue': true,
                    'description': 'Indicates if the function X2 IP addresses over S1 is active in the RBS.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'x2retryTimerMaxAuto',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 60000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 1440,
                    'description': 'See attribute x2RetryTimerStart.\n\nUnit: 1 minute\nResolution: -\nTakes effect: Immediately.'
                },
                {
                    'key': 'x2retryTimerStart',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': [
                            {
                                'minValue': 0,
                                'maxValue': 1000
                            }
                        ],
                        'valueResolution': null
                    },
                    'defaultValue': 30,
                    'description': 'After failed X2 setup and after X2 link break the x2RetryTimer is used to control the time till next retry. x2RetryTimer is used for DNS, SCTP and X2AP retries.\n\nAfter first failed setup or missing IP address from DNS, x2RetryTimer = max(x2RetryTimerStart,W), where W is the timeToWait received in x2SetupFail. If W is not received, W=0.\n\nAfter link break, x2RetryTimer = random(0,x2RetryTimerStart). If the first setup after link break fails, the timer values according to the above and below paragraphs shall apply as for failed inital setup.\n\nAfter 2nd and following fails, if the X2 connection is not being setup by ANR in the S-RBS, x2RetryTimer = max(x2RetryTimerStart,W).\n\nAfter 2nd and following fails, if the X2 connection is being setup by ANR in the S-RBS, x2RetryTimer = max(min[2^(n-2)*x2RetryTimerStart, x2retryTimerMaxAuto], W), where n is failure number.\n\nEach W is only used in the first retry after it is received.\n\nUnit: 1 s\nResolution: 1\nTakes effect: Immediately.'
                },
                {
                    'key': 'zzzTemporary1',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary10',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': -2000000000,
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary11',
                    'immutable': false,
                    'writeBehavior': 'NOT_ALLOWED',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': -2000000000,
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary12',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': -2000000000,
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary2',
                    'immutable': false,
                    'writeBehavior': 'INHERITED',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary3',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary4',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary5',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary6',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary7',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary8',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_PERSISTENCE',
                    'type': 'STRING',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'validContentRegex': null
                    },
                    'defaultValue': '',
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                },
                {
                    'key': 'zzzTemporary9',
                    'immutable': false,
                    'writeBehavior': 'PERSIST',
                    'readBehavior': 'FROM_DELEGATE',
                    'type': 'LONG',
                    'constraints': {
                        'nullable': true,
                        'valueRangeConstraints': null,
                        'valueResolution': null
                    },
                    'defaultValue': -2000000000,
                    'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                }
            ]

        }
    };


});
