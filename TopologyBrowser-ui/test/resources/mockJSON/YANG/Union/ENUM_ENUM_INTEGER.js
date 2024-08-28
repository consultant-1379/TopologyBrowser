define([], function() {
    'use strict';

    return {
        onChangeCallback: function() {},
        onInvalidCallback: function() {},
        innerOnChangeCallback: function() {},
        innerOnInvalidCallback: function() {},
        memberTypes: [
            {
                type: 'ENUM_REF',
                constraints: null,
                defaultValue: null,
                enumeration: {
                    key: 'tcp-port-name',
                    description: 'tcp-port-name',
                    enumMembers: [
                        {
                            key: 'bgp',
                            value: 0,
                            description: 'Border Gateway Protocol (179)'
                        }
                    ]
                }
            },
            {
                type: 'ENUM_REF',
                constraints: null,
                defaultValue: null,
                enumeration: {
                    key: 'udp-port-name',
                    description: 'udp-port-name',
                    enumMembers: [
                        {
                            key: 'biff',
                            value: 0,
                            description: 'Biff (mail notification, comsat, 512)'
                        }
                    ]
                }
            },
            {
                type: 'INTEGER',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: [
                        {
                            minValue: 1,
                            maxValue: 65535
                        }
                    ],
                    valueResolution: null
                },
                defaultValue: null,
            }
        ],
        key: 'eq',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: null
    };
});
