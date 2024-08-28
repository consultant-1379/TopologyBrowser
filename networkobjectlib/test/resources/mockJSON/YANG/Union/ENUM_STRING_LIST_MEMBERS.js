define([], function() {
    'use strict';

    return {
        onChangeCallback: function() {},
        onInvalidCallback: function() {},
        innerOnChangeCallback: function() {},
        innerOnInvalidCallback: function() {},
        listMembers: [
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
                type: 'STRING',
                constraints: {
                    valueRangeConstraints: null,
                    validContentRegex: '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(%[\p{N}\p{L}]+)?',
                    stringConstraint: true
                },
                defaultValue: null
            }
        ],
        key: 'addr-primary-key',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: 'ahp'
    };
});
