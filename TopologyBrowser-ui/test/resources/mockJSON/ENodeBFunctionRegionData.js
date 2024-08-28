define(function() {
    return [
        {
            activeChoiceCase: null,
            key: 'alignTtiBundWUlTrigSinr',
            readOnly: false,
            constraints: null,
            type: 'ENUM_REF',
            defaultValue: 'OFF',
            description: 'Configures UL quality measure type utilized for decisions on when to configure and de-configure TTI Bundling. If setting is \'ULTRIG\' uplink SINR value from \'Uplink-Triggered Inter-Frequency Mobility\' is used for TTI Bundling.',
            isNonPersistent: false,
            enumeration: {
                key: 'TtiBundTriggerAlignment',
                description: 'TtiBundTriggerAlignment',
                enumMembers: [
                    {
                        key: 'OFF',
                        value: 'OFF',
                        description: 'No trigger alignment with other features.'
                    },
                    {
                        key: 'ULTRIG',
                        value: 'ULTRIG',
                        description: 'Uplink quality measurements aligned with feature Uplink-Triggerd Inter-Frequency Mobility.'
                    }
                ]
            },
            value: 'ULTRIG',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'bbVlanPortRef',
            readOnly: false,
            constraints: null,
            type: 'MO_REF',
            defaultValue: null,
            description: 'Refers to the VlanPort instance to use for configuring the EthernetPort VLAN for a set of BB links.',
            isNonPersistent: false,
            value: null,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'biasThpWifiMobility',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 10,
            description: 'In order to send a UE to WiFi, a throughput comparison is made between WiFi and LTE.\nFor comparisons made in eNodeB, a UE is admitted to WiFi if, WiFi throughput > biasThpWifiMobility * LTE throughput.',
            isNonPersistent: false,
            value: 10,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'caAwareMfbiIntraCellHo',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Activation/deactivation of feature Intra-Cell Handover to Additional Band.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'checkEmergencySoftLock',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Used to turn on and off the function for checking existence of emergency calls.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'combCellSectorSelectThreshRx',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 1800
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 300,
            description: 'Used for PUSCH sector selection in combined Cell. For each Ue, all sectors received power are compared against the primary sector. Only the primary and the best sector that is below the threshold will be selected.',
            isNonPersistent: false,
            value: 300,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'combCellSectorSelectThreshTx',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 1800
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 300,
            description: 'Used for PDSCH and PHICH sector selection in combined Cell. For each Ue, all sectors received power are compared against the primary sector. Sectors that are below the threshold will be selected.',
            isNonPersistent: false,
            value: 300,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'csfbMeasFromIdleMode',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: true,
            description: 'When CS Fallback is requested for a UE in idle mode this parameter controls if measurements for release with redirect and handover must be performed. If the parameter is set to false a blind release with redirect is done.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'dlMaxWaitingTimeGlobal',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 500
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: null,
            description: 'The targeted maximum allowed time between scheduling occasions of a DL bearer. A bearer that is not scheduled within the specified time is given higher priority. Value 0 means that the higher priority is never applied. It is recommended to set the value =< than the PDB. A value that is set too low can affect other services with higher priority.',
            isNonPersistent: false,
            value: 0,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'dnsLookupOnTai',
            readOnly: false,
            constraints: null,
            type: 'ENUM_REF',
            defaultValue: 'ON',
            description: 'Controls if the Tracking Area Identity (TAI) is used to get IP addresses of MME nodes from the Domain Name System (DNS).\n\nThe RBS uses TAI to automatically obtain all MME IP addresses from the DNS when dnsLookupOnTai is switched on, or at RBS start or restart.\n\nThe MME IP address list is refreshed periodically and MME connections released and setup according to the new list. The MME IP address list can also be refreshed from OSS-RC.',
            isNonPersistent: false,
            enumeration: {
                key: 'DnsLookup',
                description: 'DnsLookup',
                enumMembers: [
                    {
                        key: 'OFF',
                        value: 'OFF',
                        description: 'OFF'
                    },
                    {
                        key: 'ON',
                        value: 'ON',
                        description: 'ON'
                    }
                ]
            },
            value: 'ON',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'dnsLookupTimer',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 1000
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: null,
            description: 'The interval to perform DNS Lookup to get potential new IP addresses of MME nodes. DNS lookup is performed for the TAI domain name. If the value is set to zero, then no periodic DNS Lookup is done.',
            isNonPersistent: false,
            value: 0,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'dnsSelectionS1X2Ref',
            readOnly: false,
            constraints: null,
            type: 'MO_REF',
            defaultValue: null,
            description: 'Controls DNS selection for S1 and X2 lookups. If not set, DNS server on OAM network is used.\n\nFor DU Radio Node it can be set to reference a DnsResolver, and DNS queries are resolved using referenced DnsResolver (typically using DNS server on transport network).\n\nFor Baseband Radio Node it can be set to reference a DnsClient, and DNS queries are resolved using referenced DnsClient (typically using DNS server on transport network).',
            isNonPersistent: false,
            value: null,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'dscpLabel',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 63
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 24,
            description: 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).',
            isNonPersistent: false,
            value: 24,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'enabledUlTrigMeas',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Enables or disables the UL SINR max measurements and event triggers for the UL quality. Only has effect if license for Uplink-Triggered Inter-Frequency Mobility is not installed.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'eNBId',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: -1,
                        maxValue: 1048575
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -1,
            description: 'The ENodeB ID that forms part of the Cell Global Identity, and is also used to identify the node over the S1 interface.',
            isNonPersistent: false,
            value: 961,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'eNodeBFunctionId',
            readOnly: true,
            constraints: {
                nullable: false,
                valueRangeConstraints: null,
                validContentRegex: '[]0-9A-Za-z\\[.!$%&\':?@^_`{|}~ /()-]*'
            },
            type: 'STRING',
            defaultValue: null,
            description: 'The value component of the RDN.\n',
            isNonPersistent: false,
            value: '1',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'eNodeBPlmnId',
            readOnly: false,
            constraints: null,
            type: 'COMPLEX_REF',
            defaultValue: null,
            description: 'The ENodeB Public Land Mobile Network (PLMN) ID that forms part of the ENodeB Global ID used to identify the node over the S1 interface.\nNote: The value (MCC=001, MNC=01) indicates that the PLMN is not initiated. The value can not be used as a valid PLMN Identity.\n',
            isNonPersistent: false,
            complexRef: {
                description: 'PlmnIdentity',
                key: 'PlmnIdentity',
                attributes: [
                    {
                        activeChoiceCase: null,
                        key: 'mcc',
                        readOnly: false,
                        constraints: {
                            nullable: true,
                            valueRangeConstraints: [
                                {
                                    minValue: 0,
                                    maxValue: 999
                                }
                            ],
                            valueResolution: null
                        },
                        type: 'INTEGER',
                        defaultValue: null,
                        description: 'The MCC part of a PLMN identity used in the radio network.',
                        isNonPersistent: false,
                        value: 353
                    },
                    {
                        activeChoiceCase: null,
                        key: 'mnc',
                        readOnly: false,
                        constraints: {
                            nullable: true,
                            valueRangeConstraints: [
                                {
                                    minValue: 0,
                                    maxValue: 999
                                }
                            ],
                            valueResolution: null
                        },
                        type: 'INTEGER',
                        defaultValue: null,
                        description: 'The MNC part of a PLMN identity used in the radio network.',
                        isNonPersistent: false,
                        value: 57
                    },
                    {
                        activeChoiceCase: null,
                        key: 'mncLength',
                        readOnly: false,
                        constraints: {
                            nullable: true,
                            valueRangeConstraints: [
                                {
                                    minValue: 2,
                                    maxValue: 3
                                }
                            ],
                            valueResolution: null
                        },
                        type: 'INTEGER',
                        defaultValue: null,
                        description: 'The length of the MNC part of a PLMN identity used in the radio network.',
                        isNonPersistent: false,
                        value: 2
                    }
                ]
            },
            value: [
                {
                    key: 'mcc',
                    value: 353,
                    datatype: null
                },
                {
                    key: 'mnc',
                    value: 57,
                    datatype: null
                },
                {
                    key: 'mncLength',
                    value: 2,
                    datatype: null
                }
            ],
            isArray: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'forcedSiTunnelingActive',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Specifies whether or not the functionality to send NACC information, regardless of UE capability, is activated, provided that the feature Redirect with System Information is active.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'initPreschedulingEnable',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: true,
            description: 'Indicates that prescheduling is enabled during connection setup phase.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'licCapDistrMethod',
            readOnly: false,
            constraints: null,
            type: 'ENUM_REF',
            defaultValue: 'SYSTEM',
            description: 'Used to set how the licensed capacity will be distributed between the baseband processing resources',
            isNonPersistent: false,
            enumeration: {
                key: 'LicCapDistrMethod',
                description: 'LicCapDistrMethod',
                enumMembers: [
                    {
                        key: 'SYSTEM',
                        value: 'SYSTEM',
                        description: 'The RBS will distribute the licensed capacity evenly over the baseband processing resources.'
                    },
                    {
                        key: 'OPERATOR',
                        value: 'OPERATOR',
                        description: 'The RBS will distribute the licensed capacity over the baseband processing resources based on the value set in licCapDistr.'
                    }
                ]
            },
            value: 'SYSTEM',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'licConnectedUsersPercentileConf',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 90,
            description: 'The percentile to use for the counter pmLicConnectedUsersActual.',
            isNonPersistent: false,
            value: 90,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'licDlBbPercentileConf',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 90,
            description: 'The percentile to use for the counter BbProcessingResource::pmLicDlCapActual.',
            isNonPersistent: false,
            value: 90,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'licDlPrbPercentileConf',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 90,
            description: 'The percentile to use for the counter BbProcessingResource::pmLicDlPrbCapActual.',
            isNonPersistent: false,
            value: 90,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'licUlBbPercentileConf',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 90,
            description: 'The percentile to use for the counter BbProcessingResource::pmLicUlCapActual.',
            isNonPersistent: false,
            value: 90,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'licUlPrbPercentileConf',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 90,
            description: 'The percentile to use for the counter BbProcessingResource::pmLicUlPrbCapActual.',
            isNonPersistent: false,
            value: 90,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'maxRandc',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 2,
                        maxValue: 255
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 255,
            description: 'Rand range datatype is the eight most significant bits (MSB) of the Rand used for authentication.\nThis attribute controls the maximum random number value that can be generated. Typically a range of random numbers is allocated to each system using this attribute.',
            isNonPersistent: false,
            value: 255,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'measuringEcgiWithAgActive',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Configures use of autonomous gap as method of CGI measurement. If enabled, capable UEs are configured to use autonomous gap for CGI measurement to target LTE or UTRAN cell.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'mfbiSupport',
            readOnly: true,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Specifies whether the feature Multiple Frequency Band Indicators is supported in the eNB.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'mfbiSupportPolicy',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'A policy parameter that sets the start value of the attribute mfbiSupport when an ExternalENodeBFunction is automatically created by the eNodeB.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'minRandc',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 254
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 1,
            description: 'Rand range datatype is the eight most significant bits (MSB) of the Rand used for authentication.\nThis attribute controls the minimum random number value that can be generated. Typically a range of random numbers is allocated to each system using this attribute.',
            isNonPersistent: false,
            value: 1,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'mtRreWithoutNeighborActive',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: true,
            description: 'Enables or disables the RRC Connection Reestablishment in source cell when there is no target neighbor cell information.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'nnsfMode',
            readOnly: false,
            constraints: null,
            type: 'ENUM_REF',
            defaultValue: 'RPLMN_IF_SAME_AS_SPLMN',
            description: 'The mode used by the RBS for the non-access stratum node selection.\n\nRegardless of the mode used, the function attempts to:\n\n- Reconnect every UE to its registered MME in any of the tracking areas of the cell.\n\n- Distribute the UEs that are not reconnected among MMEs that serve the Public Land Mobile Network selected by each UE.',
            isNonPersistent: false,
            enumeration: {
                key: 'NnsfModeVals',
                description: 'NnsfModeVals',
                enumMembers: [
                    {
                        key: 'SPLMN',
                        value: 'SPLMN',
                        description: 'The function distributes all UEs which are not registered in any of the tracking areas of the cell (tries to reconnect if UE provides S-TMSI, thus registered in one of the tracking areas of the cell).'
                    },
                    {
                        key: 'RPLMN_IF_SAME_AS_SPLMN',
                        value: 'RPLMN_IF_SAME_AS_SPLMN',
                        description: 'The function distributes all UEs which are not registered in the PLMN they select (tries to reconnect if UE provides S-TMSI or if otherwise registered in the PLMN that it selects).'
                    },
                    {
                        key: 'RPLMN_IF_MME_SERVES_SPLMN',
                        value: 'RPLMN_IF_MME_SERVES_SPLMN',
                        description: 'The function distributes all UEs which are registered in some PLMN which is not served by any MME which is connected to eNB (tries to reconnect if UE provides S-TMSI or is otherwise registered in an MME which serves the PLMN that it selects).'
                    }
                ]
            },
            value: 'RPLMN_IF_SAME_AS_SPLMN',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'prioritizeAdditionalBands',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'When enabled, additional frequency bands have higher priority than primary frequency band in secondary cell evaluation.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'pwsPersistentStorage',
            readOnly: false,
            constraints: null,
            type: 'ENUM_REF',
            defaultValue: 'OFF',
            description: 'Decides whether or not PWS data must be persistently stored.',
            isNonPersistent: false,
            enumeration: {
                key: 'PersistentStorage',
                description: 'PersistentStorage',
                enumMembers: [
                    {
                        key: 'OFF',
                        value: 'OFF',
                        description: 'Persistent storage of PWS data is turned OFF.'
                    },
                    {
                        key: 'ON',
                        value: 'ON',
                        description: 'Persistent storage of PWS data is turned ON.'
                    }
                ]
            },
            value: 'OFF',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'randUpdateInterval',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 15,
                        maxValue: 1440
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 200,
            description: 'Random number update interval\nThis attribute specifies the time interval in minutes between random number generation. When this interval expires, the eNodeB generates a new random number between MinRandc and MaxRandc.',
            isNonPersistent: false,
            value: 200,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'release',
            readOnly: true,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'The product release of the ManagedFunction.\nIt commonly contains the Managed Function release, for example  L12.0, 13A, R1A ',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'releaseInactiveUesInactTime',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 32767
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 1,
            description: 'Inactivity time value to be used to decide release of inactive UEs at handover.',
            isNonPersistent: false,
            value: 1,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'releaseInactiveUesMpLoadLevel',
            readOnly: false,
            constraints: null,
            type: 'ENUM_REF',
            defaultValue: 'VERY_HIGH_LOAD',
            description: 'Minimum MP load level at which inactive UEs are released at handover.',
            isNonPersistent: false,
            enumeration: {
                key: 'HoNotAllowedMpLoadLevel',
                description: 'HoNotAllowedMpLoadLevel',
                enumMembers: [
                    {
                        key: 'NOT_HIGH_LOAD',
                        value: 'NOT_HIGH_LOAD',
                        description: 'Release inactive UEs at handover when MP load level is at least NOT_HIGH.'
                    },
                    {
                        key: 'HIGH_LOAD',
                        value: 'HIGH_LOAD',
                        description: 'Release inactive UEs at handover when MP load level is at least HIGH.'
                    },
                    {
                        key: 'VERY_HIGH_LOAD',
                        value: 'VERY_HIGH_LOAD',
                        description: 'Release inactive UEs at handover when MP load level is at least VERY_HIGH.'
                    }
                ]
            },
            value: 'VERY_HIGH_LOAD',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'rrcConnReestActive',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'Indicates if the feature RRC Connection Reestablishment is ACTIVATED or DEACTIVATED.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 's1HODirDataPathAvail',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'S1 Handover data forwarding can be of two types, direct and indirect. Direct forwarding requires direct connectivity between source and target eNodeB. This parameter is used to indicate if such direct connectivity exist.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 's1RetryTimer',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 300
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 30,
            description: 'Defines the frequency to perform re-establishment of SCTP and S1-AP connection,\nwhen the connection to a MME is lost.\n',
            isNonPersistent: false,
            value: 30,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'sctpRef',
            readOnly: false,
            constraints: null,
            type: 'MO_REF',
            defaultValue: null,
            description: 'Refers to the SCTP instance that is used to configure the SCTP host for S1 and X2 connections.',
            isNonPersistent: false,
            value: null,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'softLockRwRWaitTimerInternal',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 20,
                        maxValue: 80
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 60,
            description: 'Length of waiting time before soft-lock of cell starts to release all ongoing calls with Release with Redirect (RwR), when eNodeB internally triggers soft-lock of cell.',
            isNonPersistent: false,
            value: 60,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'softLockRwRWaitTimerOperator',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 20,
                        maxValue: 80
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 60,
            description: 'Length of waiting time before soft-lock of cell starts to release all ongoing calls with Release with Redirect (RwR), when operator triggers soft-lock of cell.',
            isNonPersistent: false,
            value: 60,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'tddVoipDrxProfileId',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: -1,
                        maxValue: 17
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -1,
            description: 'DrxProfile ID used for TDD VOIP bearers on a mixed FDD/TDD eNodeB. The default value results in TDD using the same DrxProfile as FDD for VOIP bearers.',
            isNonPersistent: false,
            value: -1,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timeAndPhaseSynchAlignment',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'If set to true, any time and phase synchronization accuracy-dependent feature is deactivated or degraded if its time and phase synchronization accuracy is not fulfilled.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timeAndPhaseSynchCritical',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'If set to true, the cell will be disabled if the time and phase synchronization accuracy of the eNodeB is not fulfilled.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timePhaseMaxDeviation',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 9,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 100,
            description: 'Defines the maximum allowed time/phase deviation for time/phase synchronization of the eNodeB.',
            isNonPersistent: false,
            value: 100,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timePhaseMaxDeviationCdma2000',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 9,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 100,
            description: 'The maximum allowed time and phase deviation for time and phase synchronization of the eNodeB. It is the deviation that is allowed for features related to CDMA2000 fallback and handover to function. When the limit is exceeded, some of the functionality is deactivated.',
            isNonPersistent: false,
            value: 100,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timePhaseMaxDeviationMbms',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 9,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 50,
            description: 'The maximum allowed time and phase deviation for time and phase synchronization of the eNodeB. It is the deviation that is allowed for Multimedia Broadcast Multicast Service (MBMS) to function. When the limit is exceeded, the service is deactivated.',
            isNonPersistent: false,
            value: 50,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timePhaseMaxDeviationOtdoa',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 9,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 9,
            description: 'The maximum allowed time and phase deviation for time and phase synchronization of the eNodeB. It is the deviation that is allowed for Observed Time Difference of Arrival (OTDOA) Support to function. When the limit is exceeded, the service is deactivated.',
            isNonPersistent: false,
            value: 9,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timePhaseMaxDeviationSib16',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 9,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 100,
            description: 'The maximum allowed time and phase deviation for time and phase synchronization of the eNodeB. It is the deviation that is allowed for SIB16 Time Information Broadcast feature to function. When the limit is exceeded, the feature is deactivated.',
            isNonPersistent: false,
            value: 100,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'timePhaseMaxDeviationTdd',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 9,
                        maxValue: 100
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 15,
            description: 'The maximum allowed time and phase deviation for time and phase synchronization of the eNodeB for TDD cells. When the limit is exceeded, the TDD cells get disabled.',
            isNonPersistent: false,
            value: 15,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'tOutgoingHoExecCdma1xRtt',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 32000
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 5,
            description: 'Supervision timer of the outgoing LTE to CDMA 1xRtt handover execution procedure.',
            isNonPersistent: false,
            value: 5,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'tRelocOverall',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 20
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 5,
            description: 'Supervision timer of the outgoing S1/X2/intra-eNodeB handover execution procedure according to 3GPP TS 36.413 and TS 36.423.\nIf the feature Multi-Target RRC Connection Re-establishment is active this timer also supervises the Context Fetch procedure.',
            isNonPersistent: false,
            value: 5,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'tS1HoCancelTimer',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 30
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 3,
            description: 'The timeout time for receiving HANDOVER CANCEL ACKNOWLEDGE after RBS sent HO CANCEL message to MME.\nValue specifies supervision time of outgoing S1 HO Cancellation according to procedure described in 3GPP TS 36.413 section 8.4.5.',
            isNonPersistent: false,
            value: 3,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'ulMaxWaitingTimeGlobal',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 500
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: null,
            description: 'The targeted maximum allowed time between scheduling occasions of an UL bearer. A bearer that is not scheduled within the specified time is given higher priority. Value 0 means that the higher priority is never applied. It is recommended to set the value =< than the PDB. A value that is set too low can affect other services with higher priority.',
            isNonPersistent: false,
            value: 0,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'ulSchedulerDynamicBWAllocationEnabled',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: true,
            description: 'Specifies if the advanced UL scheduler is enabled\n\n',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'upIpAddressRef',
            readOnly: false,
            constraints: null,
            type: 'MO_REF',
            defaultValue: null,
            description: 'Refers to the IpAccessHostEt or AddressIPv4/AddressIPv6 instance to use for configuring the IP address for S1 and X2 user plane connections.',
            isNonPersistent: false,
            value: null,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'useBandPrioritiesInSCellEval',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: null,
            description: 'When enabled, secondary cell evaluation is done according to priorities in prioritizeAdditionalBands and EUtranCellFDD/EUtranCellTDD::prioAdditionalFreqBandList.',
            isNonPersistent: false,
            value: false,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'userLabel',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 1,
                        maxValue: 128
                    }
                ],
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Label for free use.\n',
            isNonPersistent: false,
            value: '/sims/O16/ENM/16.5/mediumDeployment/LTE/5KLTE',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'x2BlackList',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 64
                    }
                ],
                ordered: null,
                uniqueMembers: false
            },
            type: 'LIST',
            defaultValue: null,
            description: 'A list of blacklisted RBS IDs. X2 may not be set up to any neighbor RBS in the blacklist.',
            isNonPersistent: false,
            listReference: {
                key: null,
                writeBehavior: null,
                readBehavior: null,
                userExposure: null,
                immutable: false,
                type: 'COMPLEX_REF',
                constraints: null,
                activeChoiceCase: null,
                defaultValue: null,
                description: null,
                namespaceversions: {},
                complexRef: {
                    key: 'GlobalEnbId',
                    description: 'GlobalEnbId',
                    attributes: [
                        {
                            key: 'mnc',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 0,
                                        maxValue: 999
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 1,
                            description: 'Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.',
                            namespaceversions: {}
                        },
                        {
                            key: 'mncLength',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 2,
                                        maxValue: 3
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 2,
                            description: 'This parameter defines the number of digits for the Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.\n\nThe PLMN identity combines the following two parts:\n1. MobileCountryCode, MCC, 3 digits\n2. MobileNetworkCode, MNC, 2 or 3 digits\n\nExample: If MCC=125 and MNC=46, then plmnId=12546.',
                            namespaceversions: {}
                        },
                        {
                            key: 'mcc',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 0,
                                        maxValue: 999
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 1,
                            description: 'Mobile Country Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.',
                            namespaceversions: {}
                        },
                        {
                            key: 'enbId',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 0,
                                        maxValue: 1048575
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 0,
                            description: 'ENodeB Id',
                            namespaceversions: {}
                        }
                    ]
                }
            },
            value: [
                [
                    {
                        key: 'enbId',
                        value: 0,
                        datatype: 'INTEGER'
                    },
                    {
                        key: 'mcc',
                        value: 1,
                        datatype: 'INTEGER'
                    },
                    {
                        key: 'mnc',
                        value: 1,
                        datatype: 'INTEGER'
                    },
                    {
                        key: 'mncLength',
                        value: 2,
                        datatype: 'INTEGER'
                    }
                ]
            ],
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'x2IpAddrViaS1Active',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: true,
            description: 'Indicates if the function X2 IP addresses over S1 is active in the RBS.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'x2retryTimerMaxAuto',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 60000
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 1440,
            description: 'See attribute x2RetryTimerStart.',
            isNonPersistent: false,
            value: 1440,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'x2retryTimerStart',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 1000
                    }
                ],
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: 30,
            description: 'After failed X2 setup and after X2 link break the x2RetryTimer is used to control the time till next retry. x2RetryTimer is used for DNS, SCTP, X2AP retries and x2IpAddrViaS1.\n\nAfter first failed setup or missing IP address from DNS, x2RetryTimer = max(x2RetryTimerStart,W), where W is the timeToWait received in x2SetupFail. If W is not received, W=0.\n\nAfter link break, x2RetryTimer = random(0,x2RetryTimerStart). If the first setup after link break fails, the timer values according to the above and below paragraphs shall apply as for failed inital setup.\n\nAfter 2nd and following fails, if the X2 connection is not being setup by ANR in the S-RBS, x2RetryTimer = max(x2RetryTimerStart,W).\n\nAfter 2nd and following fails, if the X2 connection is being setup by ANR in the S-RBS, x2RetryTimer = max(min[2^(n-2)*x2RetryTimerStart, x2retryTimerMaxAuto], W), where n is failure number.\n\nEach W is only used in the first retry after it is received.',
            isNonPersistent: false,
            value: 30,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'x2SetupTwoWayRelations',
            readOnly: false,
            constraints: {
                nullable: true
            },
            type: 'BOOLEAN',
            defaultValue: true,
            description: 'This parameter indicates if two way relations shall be setup during X2 setup and eNB configuration. The RBS creates a two-way relation for each entry in the received neighbour information that contains a relation to a source cell. Neighbour information is sent in X2 setup and eNB configuration. Neighbour information is eUtranCellRelations per source cell from the sending node.',
            isNonPersistent: false,
            value: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'x2WhiteList',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: [
                    {
                        minValue: 0,
                        maxValue: 64
                    }
                ],
                ordered: null,
                uniqueMembers: false
            },
            type: 'LIST',
            defaultValue: null,
            description: 'The list of whitelisted RBS IDs. Automated Neighbor Relations (ANR) is not allowed to disconnect X2 for any neighbor RBS in the whitelist.',
            isNonPersistent: false,
            listReference: {
                key: null,
                writeBehavior: null,
                readBehavior: null,
                userExposure: null,
                immutable: false,
                type: 'COMPLEX_REF',
                constraints: null,
                activeChoiceCase: null,
                defaultValue: null,
                description: null,
                namespaceversions: {},
                complexRef: {
                    key: 'GlobalEnbId',
                    description: 'GlobalEnbId',
                    attributes: [
                        {
                            key: 'mnc',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 0,
                                        maxValue: 999
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 1,
                            description: 'Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.',
                            namespaceversions: {}
                        },
                        {
                            key: 'mncLength',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 2,
                                        maxValue: 3
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 2,
                            description: 'This parameter defines the number of digits for the Mobile Network Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.\n\nThe PLMN identity combines the following two parts:\n1. MobileCountryCode, MCC, 3 digits\n2. MobileNetworkCode, MNC, 2 or 3 digits\n\nExample: If MCC=125 and MNC=46, then plmnId=12546.',
                            namespaceversions: {}
                        },
                        {
                            key: 'mcc',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 0,
                                        maxValue: 999
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 1,
                            description: 'Mobile Country Code (a part of the PLMN identity) for a cell that is served by a neighbor eNB.',
                            namespaceversions: {}
                        },
                        {
                            key: 'enbId',
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'INTEGER',
                            constraints: {
                                nullable: true,
                                valueRangeConstraints: [
                                    {
                                        minValue: 0,
                                        maxValue: 1048575
                                    }
                                ],
                                valueResolution: null
                            },
                            activeChoiceCase: null,
                            defaultValue: 0,
                            description: 'ENodeB Id',
                            namespaceversions: {}
                        }
                    ]
                }
            },
            value: [
                [
                    {
                        key: 'enbId',
                        value: 0,
                        datatype: 'INTEGER'
                    },
                    {
                        key: 'mcc',
                        value: 1,
                        datatype: 'INTEGER'
                    },
                    {
                        key: 'mnc',
                        value: 1,
                        datatype: 'INTEGER'
                    },
                    {
                        key: 'mncLength',
                        value: 2,
                        datatype: 'INTEGER'
                    }
                ]
            ],
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary1',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary10',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary11',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary12',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary13',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary15',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary16',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary17',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary18',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary2',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary21',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary22',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary23',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary24',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary25',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary26',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary28',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary29',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary3',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary30',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary31',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary32',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary33',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary34',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary35',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary36',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary37',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary38',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary39',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary4',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary40',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended as temporary solutions. Their usage can vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use can be overridden by the information in CPI documents. Note that a later release can use another attribute to control functionality previously provided by a temporary attribute, or can remove functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary5',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary6',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary7',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary8',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                validContentRegex: null
            },
            type: 'STRING',
            defaultValue: null,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: '',
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'acBarringForMoData',
            readOnly: false,
            constraints: null,
            type: 'COMPLEX_REF',
            defaultValue: null,
            description: 'Access class barring parameters for mobile originating calls.\nThe information in broadcasted in SIB2.',
            isNonPersistent: false,
            complexRef: {
                description: 'AcBarringConfig',
                key: 'AcBarringConfig',
                attributes: [
                    {
                        activeChoiceCase: null,
                        key: 'acBarringFactor',
                        readOnly: false,
                        constraints: {
                            nullable: true,
                            valueRangeConstraints: [
                                {
                                    minValue: 0,
                                    maxValue: 0
                                },
                                {
                                    minValue: 5,
                                    maxValue: 5
                                },
                                {
                                    minValue: 10,
                                    maxValue: 10
                                },
                                {
                                    minValue: 15,
                                    maxValue: 15
                                },
                                {
                                    minValue: 20,
                                    maxValue: 20
                                },
                                {
                                    minValue: 25,
                                    maxValue: 25
                                },
                                {
                                    minValue: 30,
                                    maxValue: 30
                                },
                                {
                                    minValue: 40,
                                    maxValue: 40
                                },
                                {
                                    minValue: 50,
                                    maxValue: 50
                                },
                                {
                                    minValue: 60,
                                    maxValue: 60
                                },
                                {
                                    minValue: 70,
                                    maxValue: 70
                                },
                                {
                                    minValue: 75,
                                    maxValue: 75
                                },
                                {
                                    minValue: 80,
                                    maxValue: 80
                                },
                                {
                                    minValue: 85,
                                    maxValue: 85
                                },
                                {
                                    minValue: 90,
                                    maxValue: 90
                                },
                                {
                                    minValue: 95,
                                    maxValue: 95
                                }
                            ],
                            valueResolution: null
                        },
                        type: 'INTEGER',
                        defaultValue: 95,
                        description: 'If the random number drawn by the UE is lower than this value, access is allowed. Otherwise the access is barred.',
                        isNonPersistent: false,
                        value: 95
                    },
                    {
                        activeChoiceCase: null,
                        key: 'acBarringForSpecialAC',
                        readOnly: false,
                        constraints: {
                            nullable: true,
                            valueRangeConstraints: [
                                {
                                    minValue: 0,
                                    maxValue: 5
                                }
                            ],
                            ordered: null,
                            uniqueMembers: false
                        },
                        type: 'LIST',
                        defaultValue: [
                            false,
                            false,
                            false,
                            false,
                            false
                        ],
                        description: 'Access class barring for AC 11-15. The first instance in the list is for AC 11, second is for AC 12, and so on.',
                        isNonPersistent: false,
                        listReference: {
                            key: null,
                            writeBehavior: null,
                            readBehavior: null,
                            userExposure: null,
                            immutable: false,
                            type: 'BOOLEAN',
                            constraints: {
                                nullable: true
                            },
                            activeChoiceCase: null,
                            defaultValue: null,
                            description: null,
                            namespaceversions: {}
                        },
                        value: [
                            false,
                            false,
                            false,
                            false,
                            false
                        ]
                    },
                    {
                        activeChoiceCase: null,
                        key: 'acBarringTime',
                        readOnly: false,
                        constraints: {
                            nullable: true,
                            valueRangeConstraints: [
                                {
                                    minValue: 4,
                                    maxValue: 4
                                },
                                {
                                    minValue: 8,
                                    maxValue: 8
                                },
                                {
                                    minValue: 16,
                                    maxValue: 16
                                },
                                {
                                    minValue: 32,
                                    maxValue: 32
                                },
                                {
                                    minValue: 64,
                                    maxValue: 64
                                },
                                {
                                    minValue: 128,
                                    maxValue: 128
                                },
                                {
                                    minValue: 256,
                                    maxValue: 256
                                },
                                {
                                    minValue: 512,
                                    maxValue: 512
                                }
                            ],
                            valueResolution: null
                        },
                        type: 'INTEGER',
                        defaultValue: 64,
                        description: 'Mean access barring time in seconds for mobile originating signalling.',
                        isNonPersistent: false,
                        value: 64
                    }
                ]
            },
            value: [
                {
                    key: 'acBarringFactor',
                    value: 95,
                    datatype: null
                },
                {
                    key: 'acBarringForSpecialAC',
                    value: [
                        false,
                        false,
                        false,
                        false,
                        false
                    ],
                    datatype: null
                },
                {
                    key: 'acBarringTime',
                    value: 64,
                    datatype: null
                }
            ],
            isArray: true,
            widgetsProducer: {}
        },
        {
            activeChoiceCase: null,
            key: 'zzzTemporary9',
            readOnly: false,
            constraints: {
                nullable: true,
                valueRangeConstraints: null,
                valueResolution: null
            },
            type: 'INTEGER',
            defaultValue: -2000000000,
            description: 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.',
            isNonPersistent: false,
            value: -2000000000,
            widgetsProducer: {}
        }
    ];
});
