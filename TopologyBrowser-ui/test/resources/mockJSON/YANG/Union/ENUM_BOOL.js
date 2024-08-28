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
