if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return   {

        'attributes': [
            {
                'key': 'nnsfMode',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            },
            {
                'key': 'sctpRef',
                'readOnly': false,
                'type': 'MO_REF',
                'constraints': null
            },
            {
                'key': 'x2WhiteList',
                'readOnly': false,
                'type': 'LIST',
                'constraints': null
            },
            {
                'key': 'tHODataFwdReordering',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'pmHwUtilDl',
                'readOnly': false,
                'type': 'LIST',
                'constraints': null
            },
            {
                'key': 'zzzTemporary9',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'pmZtemporary34',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'pmZtemporary35',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'ENodeBFunctionId',
                'readOnly': true,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'eNodeBPlmnId',
                'readOnly': false,
                'type': 'COMPLEX_REF',
                'constraints': null
            },
            {
                'key': 'zzzTemporary7',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'zzzTemporary8',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'dscpLabel',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'userLabel',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'pmHwUtilUl',
                'readOnly': false,
                'type': 'LIST',
                'constraints': null
            },
            {
                'key': 'rrcConnReestActive',
                'readOnly': false,
                'type': 'BOOLEAN',
                'constraints': null
            },
            {
                'key': 'dnsLookupOnTai',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            },
            {
                'key': 'x2retryTimerStart',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'upIpAccessHostRef',
                'readOnly': false,
                'type': 'MO_REF',
                'constraints': null
            },
            {
                'key': 'ulTransNwBandwidth',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'ulAccGbrAdmThresh',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'dlTransNwBandwidth',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'timeAndPhaseSynchCritical',
                'readOnly': false,
                'type': 'BOOLEAN',
                'constraints': null
            },
            {
                'key': 'schedulingStrategy',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            },
            {
                'key': 'oaMLinkSuperVisionActive',
                'readOnly': false,
                'type': 'BOOLEAN',
                'constraints': null
            },
            {
                'key': 'ulSchedulerDynamicBWAllocationEnabled',
                'readOnly': false,
                'type': 'BOOLEAN',
                'constraints': null
            },
            {
                'key': 'zzzTemporary2',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'zzzTemporary1',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'zzzTemporary4',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'pmPdcpPktDiscDlEth',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'dnsLookupTimer',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'zzzTemporary3',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'collectLogsStatus',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            },
            {
                'key': 'zzzTemporary10',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'zzzTemporary6',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'zzzTemporary11',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 's1RetryTimer',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'zzzTemporary5',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'x2BlackList',
                'readOnly': false,
                'type': 'LIST',
                'constraints': null
            },
            {
                'key': 'zzzTemporary12',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'collectTraceStatus',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            },
            {
                'key': 'x2IpAddrViaS1Active',
                'readOnly': false,
                'type': 'BOOLEAN',
                'constraints': null
            },
            {
                'key': 'dlAccGbrAdmThresh',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'x2retryTimerMaxAuto',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            },
            {
                'key': 'eNBId',
                'readOnly': false,
                'type': 'LONG',
                'constraints': {
                    'nullable': false,
                    'minValue': -34,
                    'maxValue': 29
                }
            }
        ]

    };





});
