define([], function() {
    'use strict';

    return {
        onChangeCallback: function() {},
        onInvalidCallback: function() {},
        innerOnChangeCallback: function() {},
        innerOnInvalidCallback: function() {},
        memberTypes: [
            {
                type: 'SHORT',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: [
                        {
                            minValue: 0,
                            maxValue: 1
                        }
                    ]
                },
                defaultValue: null
            },
            {
                type: 'LONG',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: [
                        {
                            minValue: 2,
                            maxValue: 100
                        }
                    ]
                },
                defaultValue: null
            },
            {
                type: 'DOUBLE',
                constraints: {
                    nullable: true,
                    valueRangeConstraints: [
                        {
                            minValue: 100.1,
                            maxValue: 1000
                        }
                    ]
                },
                defaultValue: null
            }
        ],
        key: 'chargingCharacteristicsTriggerValue',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: 5
    };
});
