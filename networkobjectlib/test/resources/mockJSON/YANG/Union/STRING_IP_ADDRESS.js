define([], function() {
    'use strict';

    return {
        onChangeCallback: function() {},
        onInvalidCallback: function() {},
        innerOnChangeCallback: function() {},
        innerOnInvalidCallback: function() {},
        memberTypes: [
            {
                type: 'IP_ADDRESS',
                constraints: null,
                defaultValue: null,
                immutable: false
            },
            {
                type: 'IP_ADDRESS',
                constraints: null,
                defaultValue: null,
                immutable: false
            }
        ],
        key: 'slave-instance-choice1',
        constraints: null,
        type: 'UNION',
        defaultValue: null,
        value: '1.1.1.1'
    };
});
