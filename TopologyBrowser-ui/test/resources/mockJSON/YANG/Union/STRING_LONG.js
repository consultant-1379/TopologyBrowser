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
                    validContentRegex: '(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(%[\\p{N}\\p{L}]+)?'
                },
                defaultValue: null
            },
            {
                type: 'LONG',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: [
                        {
                            minValue: 1,
                            maxValue: 4294967295
                        }
                    ],
                    valueResolution: null
                },
                defaultValue: null
            }
        ],
        key: 'condition',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: 999999
    };
});
