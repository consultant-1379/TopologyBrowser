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
                    validContentRegex: '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])/(([0-9])|([1-2][0-9])|(3[0-2]))',
                    stringConstraint: true
                },
                defaultValue: null
            },
            {
                type: 'STRING',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: null,
                    validContentRegex: '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\s+(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])',
                    stringConstraint: true
                },
                defaultValue: null
            }
        ],
        key: 'addr',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: '1.1.1.1/32'
    };
});
