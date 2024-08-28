if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return {
        'name': 'Stockholm_01_ENodeB',
        'type': 'ENodeBFunction',
        'poId': '123',
        'fdn': 'MeContext=Test_ERBS_003_Test,ManagedElement=Test_ManagedElement_003_Test,ENodeBFunction=Stockholm_01_ENodeB',
        'attributes': [
            {
                'key': 'dnsLookupOnTai',
                'value': '1'
            },
            {
                'key': 'dnsLookupTimer',
                'value': '0'
            },
            {
                'key': 'sctpRef',
                'value': 'SubNetwork=ONRM_ROOT_MO_R,MeContext=ILL00001,ManagedElement=1,vsDataTransportNetwork=1,vsDataSctp=1'
            },
            {
                'key': 'upIpAccessHostRef',
                'value': 'SubNetwork=ONRM_ROOT_MO_R,MeContext=ILL00001,ManagedElement=1,vsDataIpSystem=1,vsDataIpAccessHostEt=1'
            },
            {
                'key': 'dscpLabel',
                'value': '32'
            },
            {
                'key': 'eNodeBPlmnId',
                'value': '--'
            },
            {
                'key': 'licCapDistrMethod',
                'value': '0'
            },
            {
                'key': 'nnsfMode',
                'value': '1'
            },
            {
                'key': 'ZnodePCIProfileID',
                'value': 'Not Defined'
            },
            {
                'key': 'rrcConnReestActive',
                'value': 'true'
            } ,
            {
                'key': 's1HODirDataPathAvail',
                'value': 'false'
            },
            {
                'key': 's1RetryTimer',
                'value': '30'
            }
        ]
    }
       ;
}
 );
