if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return {
        'treeNodes': [
            {
                'moName': 'Stockholm_01_Root',
                'moType': 'MeContext',
                'poId': '1',
                'fdn': null,
                'items': null,
                'childrens': [  {
                    'moName': 'Stockholm_01_ME',
                    'moType': 'ManagedElement',
                    'poId': '12',
                    'fdn': null,
                    'items': null
                }]
            }
        ]};
})
;

