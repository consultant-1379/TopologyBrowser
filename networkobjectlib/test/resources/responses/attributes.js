define([], function() {
    'use strict';

    return {
        '123': {
            attributes: [{
                key: 'SubNetworkId',
                value: 'LTE01dg2ERBS00001',
                datatype: null
            }],
            fdn: 'SubNetwork=LTE01dg2ERBS00001',
            iconType: '',
            id: '123',
            name: 'LTE01dg2ERBS00001',
            namespace: 'OSS_TOP',
            namespaceVersion: '3.0.0',
            neType: null,
            networkDetails: [{key: 'syncStatus', value: ''}],
            poId: 123,
            type: 'SubNetwork'
        },
        '1234': {
            attributes: [{
                key: 'booleanKey',
                value: true,
                datatype: null
            }],
            fdn: 'SubNetwork=LTE01dg2ERBS00001,ManagedElement=LTE01dg2ERBS00001,ENodeBFunction=1',
            iconType: 'ENodeBFunction',
            id: '1234',
            name: '1',
            namespace: 'Lrat',
            namespaceVersion: '1.8040.0',
            neType: null,
            networkDetails: [{key: 'syncStatus', value: 'SYNCHRONIZED'}],
            poId: 1234,
            type: 'ENodeBFunction'
        }
    };
});
