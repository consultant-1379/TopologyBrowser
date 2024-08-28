define([], function() {
    'use strict';

    return {
        onChangeCallback: function() {},
        onInvalidCallback: function() {},
        innerOnChangeCallback: function() {},
        innerOnInvalidCallback: function() {},
        memberTypes: [
            {
                type: 'STRING',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: null,
                    validContentRegex: '\\*',
                    stringConstraint: true
                },
                defaultValue: null
            },
            {
                type: 'BITS',
                constraints: null,
                defaultValue: null,
                bitsMembers: [
                    {
                        key: 'create',
                        value: 0
                    },
                    {
                        key: 'read',
                        value: 1
                    },
                    {
                        key: 'update',
                        value: 2
                    },
                    {
                        key: 'delete',
                        value: 3
                    },
                    {
                        key: 'exec',
                        value: 4
                    }
                ]
            }
        ],
        key: 'access-operations',
        constraints: null,
        type: 'UNION',
        defaultValue: '*',
        value: 'read'
    };
});
