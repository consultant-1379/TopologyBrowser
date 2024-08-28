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
                    key: 'acl-ipv4-protocol-keywords',
                    description: 'acl-ipv4-protocol-keywords',
                    enumMembers: [
                        {
                            key: 'ahp',
                            value: 0,
                            description: 'Authentication Header Protocol'
                        }
                    ]
                }
            },
            {
                type: 'SHORT',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: [
                        {
                            minValue: 0,
                            maxValue: 255
                        }
                    ],
                    valueResolution: null
                },
                defaultValue: null
            }
        ],
        key: 'acl-protocol',
        constraints: null,
        type: 'UNION',
        defaultValue: 'ip',
        value: 'igmp'
    };
});
