if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {
        'name': 'EARTH',
        'type': 'MeContext',
        'poId': '281474976751626',
        'fdn': 'MeContext=EARTH',
        'attributes': [
            {
                'key': 'availabilityStatus',
                'value': null,
                'datatype': null
            },
            {
                'key': 'MeContextId',
                'value': 'EARTH'
            }, {
                'key': 'neType',
                'value': 'ENODEB'
            }, {
                'key': 'generationCounter',
                'value': 6
            }, {
                'key': 'lostSynchronization',
                'value': 'SYNC_ON_DEMAND'
            }, {
                'key': 'userLabel',
                'value': null
            }, {
                'key': 'mirrorSynchronizationStatus',
                'value': 'SYNCING'
            }
        ],
        'childrens': null
    };
});
