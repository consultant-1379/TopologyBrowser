if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    var uncleArray = new Array();
    uncleArray.push({
        'moName': 'Stockholm_02 Stockholm_02 Stockholm_02 Stockholm_02 Stockholm_02',
        'moType': null,
        'poId': '8444249301369264',
        'fdn': null,
        'items': null
    });

    for (var a=0;a<200;a++) {
        uncleArray.push({
            'moName': 'Uncle_'+a+'Uncle_'+a+'Uncle_'+a+'Uncle_'+a+'Uncle_'+a+'Uncle_'+a,
            'moType': null,
            'poId': a+15000,
            'fdn': null,
            'items': null
        });
    }


    var siblingArray = new Array();
    siblingArray.push({
        'moName': 'Stockholm_01 Stockholm_01 Stockholm_01 Stockholm_01 Stockholm_01',
        'moType': null,
        'poId': '8444249301369273',
        'fdn': null,
        'items': null
    });

    for (var b=0;b<50;b++) {
        siblingArray.push({
            'moName': 'Sibling_'+b+'Sibling_'+b+'Sibling_'+b+'Sibling_'+b+'Sibling_'+b+'Sibling_'+b,
            'moType': null,
            'poId': b+5000,
            'fdn': null,
            'items': null
        });
    }



    var childrenArray = new Array();
    childrenArray.push({
        'moName': 'Stockholm_04 Stockholm_04 Stockholm_04 Stockholm_04 Stockholm_04',
        'moType': null,
        'poId': '12345678',
        'fdn': null,
        'items': null
    });

    for (var i=0;i<100;i++) {
        childrenArray.push({
            'moName': 'Generated_'+i+'Generated_'+i+'Generated_'+i+'Generated_'+i+'Generated_'+i+'Generated_'+i,
            'moType': null,
            'poId': i,
            'fdn': null,
            'items': null
        });
    }


    return {
        'treeNodes': [
            {
                'moName': 'Stockholm_01 Stockholm_01 Stockholm_01 Stockholm_01 Stockholm_01',
                'moType': null,
                'poId': '8444249301369273',
                'fdn': null,
                'items': null,
                'childrens': childrenArray
            },
            {
                'moName': 'Stockholm_02 Stockholm_02 Stockholm_02 Stockholm_02 Stockholm_02',
                'moType': null,
                'poId': '8444249301369264',
                'fdn': null,
                'items': null,
                'childrens': siblingArray
            },
            {
                'moName': 'Stockholm_03 Stockholm_03 Stockholm_03 Stockholm_03 Stockholm_03',
                'moType': null,
                'poId': '8444249301369249',
                'fdn': null,
                'items': null,
                'childrens': uncleArray
            }
        ]

    };
})
;

