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
                        },
                        {
                            key: 'ptm',
                            value: 1,
                            description: 'Packet Transfer Mode'
                        },
                        {
                            key: 'mvl',
                            value: 2,
                            description: 'Multiple Virtual Lines DSL'
                        },
                        {
                            key: 'dtm',
                            value: 3,
                            description: 'Dynamic synchronous Transfer Mode'
                        }
                    ]
                }
            },
            {
                type: 'BOOLEAN',
                defaultValue: null
            }
        ],
        key: 'tag',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: true
    };
});
