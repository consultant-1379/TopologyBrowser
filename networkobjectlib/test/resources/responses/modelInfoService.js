define([], function() {
    'use strict';

    return {
        '123': {
            moType: 'SubNetwork',
            attributes: [{
                description: 'My Subnetwork',
                key: 'SubNetworkId',
                type: 'STRING'
            }]
        },
        '1234': {
            moType: 'ENodeBFunction',
            attributes: [{
                description: 'My boolean',
                key: 'booleanKey',
                type: 'BOOLEAN'
            }]
        }
    };
});
