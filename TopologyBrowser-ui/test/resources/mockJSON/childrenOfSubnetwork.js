//Returns Grandparent of Stockholm 2

if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return {
        'treeNodes': [{
            'id': '123321',
            'moName': 'ERBS_Subnetwork',
            'moType': 'SubNetwork',
            'syncStatus': '',
            'neType': null,
            'poId': 123321,
            'noOfChildrens': 1,
            'childrens': [{
                'id': '123323',
                'moName': 'LTE02ERBS00001',
                'moType': 'MeContext',
                'syncStatus': 'SYNCHRONIZED',
                'neType': 'ERBS',
                'poId': 123323,
                'noOfChildrens': 1,
                'childrens': null
            }]
        }]
    };
})
;

