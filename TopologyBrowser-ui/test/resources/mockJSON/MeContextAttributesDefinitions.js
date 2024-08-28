if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {

        'attributes': [
            {
                'key': 'availabilityStatus',
                'writeBehavior': 'NOT_ALLOWED',
                'readBehavior': 'FROM_DELEGATE',
                'userExposure': 'ALWAYS',
                'immutable': false,
                'type': 'LIST',
                'constraints': {
                    'nullable': true,
                    'valueRangeConstraints': [
                        {
                            'minValue': 0,
                            'maxValue': null
                        }
                    ],
                    'ordered': null,
                    'uniqueMembers': false
                },
                'activeChoiceCase': null,
                'defaultValue': null,
                'description': 'The availability status. It contains details about operationalState.',
                'namespaceversions': {
                    'ReqFieldReplaceableUnit': [
                        '4.7.0'
                    ]
                },
                'listReference': {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': null,
                    'immutable': false,
                    'type': 'ENUM_REF',
                    'constraints': null,
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': null,
                    'namespaceversions': {},
                    'enumeration': {
                        'key': 'AvailStatus',
                        'description': 'The availability status is used to qualify the operational state.\r\n It indicates why the operational state has changed its value.',
                        'enumMembers': [
                            {
                                'key': 'IN_TEST',
                                'value': 0,
                                'description': 'The resource is undergoing a test procedure. \r\nIf the administrative state is locked or  shutting down, normal users are prevented from using the resource.'
                            },
                            {
                                'key': 'FAILED',
                                'value': 1,
                                'description': 'The resource has an internal fault that prevents it from operating.'
                            },
                            {
                                'key': 'POWER_OFF',
                                'value': 2,
                                'description': 'The resource requires power to be applied and is not powered on.'
                            },
                            {
                                'key': 'OFF_LINE',
                                'value': 3,
                                'description': 'The resource requires a routine operation to be performed.\r\nThis routine operation is to place the resource online and make it available for use. The operation may be manual or automatic, or both. The operational state is disabled.'
                            },
                            {
                                'key': 'OFF_DUTY',
                                'value': 4,
                                'description': 'The resource has been made inactive by an internal control process.'
                            },
                            {
                                'key': 'DEPENDENCY',
                                'value': 5,
                                'description': 'The resource cannot operate because some other resource on which it depends is unavailable.'
                            },
                            {
                                'key': 'DEGRADED',
                                'value': 6,
                                'description': 'The service available from the resource is degraded in some respect.'
                            },
                            {
                                'key': 'NOT_INSTALLED',
                                'value': 7,
                                'description': 'The resource represented by the managed object is not present, or is incomplete.'
                            },
                            {
                                'key': 'LOG_FULL',
                                'value': 8,
                                'description': 'Indicates a log full condition.\r\nThe semantics are defined in CCITT Rec. X.735 | ISO/IEC 10164-6.'
                            },
                            {
                                'key': 'DEPENDENCY_LOCKED',
                                'value': 9,
                                'description': 'The administrative state of a resource that this resource depends on is locked.\r\n or the availability status of the other resource is dependency locked.'
                            },
                            {
                                'key': 'DEPENDENCY_FAILED',
                                'value': 10,
                                'description': 'The availability status of a resource that this resource depends on is failed or dependency failed.'
                            },
                            {
                                'key': 'DEPENDENCY_SHUTTINGDOWN',
                                'value': 11,
                                'description': 'The administrative state of a resource that this resource depends on is shutting down.\r\n or the availability status of the other resource is dependency shutting down.'
                            }
                        ]
                    }
                }
            },
            {
                'key': 'MeContextId',
                'readOnly': true,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'lostSynchronization',
                'readOnly': false,
                'type': 'STRING',
                'constraints': {
                    'nullable': false,
                    'maxLength': 1028,
                    'validContentRegex': null
                }
            },
            {
                'key': 'neType',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            },
            {
                'key': 'generationCounter',
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
                'key': 'mirrorSynchronizationStatus',
                'readOnly': false,
                'type': 'ENUM_REF',
                'constraints': null
            }
        ]

    };


});
