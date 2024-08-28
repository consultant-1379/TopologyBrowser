if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}
define(function() {

    return function(objectCount) {
        objectCount = objectCount || 10; // default number of objects is 10
        return {
            'objects': Array.apply(null, {length: objectCount}).map(function(_, i) {
                return {
                    id: i+'',
                    type: 'MeContext'
                };
            }),
            'attributes': ['neType'],
            'attributeMappings': [{
                'moType': 'MeContext',
                'attributeNames': ['neType']
            }],
            'metadata': {
                'SORTABLE': true,
                'RESULT_SET_TOTAL_SIZE': objectCount,
                'MAX_UI_CACHE_SIZE': 100000,
                'INFO_MESSAGE': 0
            }
        };
    };
});
