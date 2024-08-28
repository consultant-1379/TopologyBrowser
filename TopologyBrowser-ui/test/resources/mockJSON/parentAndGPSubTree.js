//Returns Grandparent of Stockholm 2

if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return {
        'treeNodes': [
            {
                'moName': 'Stockholm_05',
                'moType': null,
                'poId': '444445354635735',
                'fdn': null,
                'items': null,
                'childrens': [
                    {
                        'moName': 'Stockholm_03',
                        'moType': null,
                        'poId': '8444249301369249',
                        'fdn': null,
                        'items': null
                    }]
            },
            {
                'moName': 'Stockholm_06',
                'moType': null,
                'poId': '63463463463465',
                'fdn': null,
                'items': null,
                'childrens': [
                    {
                        'moName': 'Stockholm_05',
                        'moType': null,
                        'poId': '444445354635735',
                        'fdn': null,
                        'items': null
                    }]
            },

        ]
    };
})
;

