if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return function() {
        var original = {
            281475029105735: {
                'name': 'ieatnetsimv6035-12_RNC01RBS03',
                'type': 'MeContext',
                'poId': 281475029105735,
                'id': '281475029105735',
                'fdn': 'SubNetwork=RNC01,MeContext=ieatnetsimv6035-12_RNC01RBS03',
                'namespace': 'ComTop',
                'namespaceVersion': '10.20.0',
                'neType': 'RBS',
                'attributes': {},
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'UNSYNCHRONIZED'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '10.234.120.188'
                    },
                    {
                        'key': 'managementState',
                        'value': 'MAINTENANCE'
                    }
                ]
            },
            281475029105738: {
                'name': 'ieatnetsimv6035-12_M01',
                'type': 'MeContext',
                'poId': 281475029105738,
                'id': '281475029105738',
                'fdn': 'MeContext=ieatnetsimv6035-12_M01',
                'namespace': 'ComTop',
                'namespaceVersion': '10.20.0',
                'neType': 'RBS',
                'attributes': {},
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'NOT_SUPPORTED'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '10.234.126.188'
                    },
                    {
                        'key': 'managementState',
                        'value': 'NORMAL'
                    }
                ]
            },
            281475029131897: {
                'name': 'ieatnetsimv6035-12_RNC01RBS13',
                'type': 'MeContext',
                'poId': 281475029131897,
                'id': '281475029131897',
                'fdn': 'SubNetwork=RNC01,MeContext=ieatnetsimv6035-12_RNC01RBS13',
                'namespace': 'ComTop',
                'namespaceVersion': '10.20.0',
                'neType': 'RBS',
                'attributes': {},
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'TOPOLOGY'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '10.234.120.189'
                    },
                    {
                        'key': 'managementState',
                        'value': 'NORMAL'
                    }
                ]
            },
            281475075346449: {
                'name': 'RNC01MSRBS-V2259',
                'type': 'ManagedElement',
                'poId': 281475075346449,
                'id': '281475075346449',
                'fdn': 'SubNetwork=RNC01,ManagedElement=RNC01MSRBS-V2259',
                'namespace': 'ComTop',
                'namespaceVersion': '10.20.0',
                'neType': 'RadioNode',
                'attributes': {
                    'managedElementId': {
                        'key': 'managedElementId',
                        'value': 'RNC01MSRBS-V2259',
                        'datatype': null
                    },
                    'platformType': {
                        'key': 'platformType',
                        'value': null,
                        'datatype': null
                    },
                    'dnPrefix': {
                        'key': 'dnPrefix',
                        'value': 'SubNetwork=RNC01',
                        'datatype': null
                    },
                    'mockLongAttribute': {
                        'key': 'mockLongAttribute',
                        'value': null,
                        'datatype': null
                    },
                    'mockObsoleteAttribute': {
                        'key': 'mockObsoleteAttribute',
                        'value': null,
                        'datatype': null
                    },
                    'dateTimeOffset': {
                        'key': 'dateTimeOffset',
                        'value': '+01:00',
                        'datatype': null
                    },
                    'networkManagedElementId': {
                        'key': 'networkManagedElementId',
                        'value': null,
                        'datatype': null
                    },
                    'licConnectedUsersPercentileConf': {
                        'key': 'licConnectedUsersPercentileConf',
                        'value': 5,
                        'datatype': null
                    },
                    'neType': {
                        'key': 'neType',
                        'value': 'RadioNode',
                        'datatype': null
                    },
                    'timeZone': {
                        'key': 'timeZone',
                        'value': null,
                        'datatype': null
                    },
                    'siteLocation': {
                        'key': 'siteLocation',
                        'value': null,
                        'datatype': null
                    },
                    'managedElementType': {
                        'key': 'managedElementType',
                        'value': 'RadioNode',
                        'datatype': null
                    },
                    'release': {
                        'key': 'release',
                        'value': '16B',
                        'datatype': null
                    },
                    'administrativeState': {
                        'key': 'administrativeState',
                        'value': 'UNLOCKED',
                        'datatype': null
                    },
                    'userLabel': {
                        'key': 'userLabel',
                        'value': 'RadioNode_UserLabel_72222',
                        'datatype': null
                    },
                    'community-list': {
                        'key': 'community-list',
                        'value': [
                            'local-as'
                        ],
                        'datatype': null
                    },
                    'localDateTime': {
                        'key': 'localDateTime',
                        'value': null,
                        'datatype': null
                    }
                },
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'SYNCHRONIZED'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '10.234.120.187'
                    }
                ]
            },
            281475029085392: {
                'name': 'RNC01',
                'type': 'SubNetwork',
                'poId': 281475029085392,
                'id': '281475029085392',
                'fdn': 'SubNetwork=RNC01',
                'namespace': 'OSS_TOP',
                'namespaceVersion': '3.0.0',
                'neType': 'OSS_TOP',
                'attributes': {
                    'SubNetworkId': {
                        'key': 'SubNetworkId',
                        'value': 'RNC01',
                        'datatype': null
                    }
                },
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': ''
                    },
                    {
                        'key': 'ipAddress',
                        'value': ''
                    }
                ]
            },
            281475029085364: {
                'name': 'RNC02',
                'type': 'SubNetwork',
                'poId': 281475029085364,
                'id': '281475029085364',
                'fdn': 'SubNetwork=RNC02',
                'namespace': 'OSS_TOP',
                'namespaceVersion': '3.0.0',
                'neType': null,
                'attributes': {
                    'SubNetworkId': {
                        'key': 'SubNetworkId',
                        'value': 'RNC02',
                        'datatype': null
                    }
                },
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': ''
                    },
                    {
                        'key': 'ipAddress',
                        'value': ''
                    }
                ]
            },
            281475059730205: {
                'name': 'ericsson-swim-1',
                'type': 'rule',
                'poId': 281475059730205,
                'id': '281475059730205',
                'fdn': 'MeContext=CORE60EPGOI001,ManagedElement=CORE60EPGOI001,nacm=1,rule-list=ericsson-swim-1-system-read-only,rule=ericsson-swim-1',
                'namespace': 'urn:ietf:params:xml:ns:yang:ietf-netconf-acm',
                'namespaceVersion': '2012.2.22',
                'neType': 'vEPG-OI',
                'attributes': {
                    'path': {
                        'key': 'path',
                        'value': null,
                        'datatype': null
                    },
                    'notification-name': {
                        'key': 'notification-name',
                        'value': null,
                        'datatype': null
                    },
                    'name': {
                        'key': 'name',
                        'value': 'ericsson-swim-1',
                        'datatype': null
                    },
                    'access-operations': {
                        'key': 'access-operations',
                        'value': 'read',
                        'datatype': null
                    },
                    'action': {
                        'key': 'action',
                        'value': 'permit',
                        'datatype': null
                    },
                    'module-name': {
                        'key': 'module-name',
                        'value': 'ericsson-swim',
                        'datatype': null
                    },
                    'comment': {
                        'key': 'comment',
                        'value': null,
                        'datatype': null
                    },
                    'rpc-name': {
                        'key': 'rpc-name',
                        'value': null,
                        'datatype': null
                    }
                },
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'SYNCHRONIZED'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '192.168.100.90'
                    },
                    {
                        'key': 'managementState',
                        'value': 'NORMAL'
                    }
                ]
            },
            281475059730206: {
                'name': 'ericsson-swm-2',
                'type': 'rule',
                'poId': 281475059730206,
                'id': '281475059730206',
                'fdn': 'MeContext=CORE59EPGOI001,ManagedElement=CORE59EPGOI001,nacm=1,rule-list=ericsson-swm-2-system-read-only,rule=ericsson-swm-2',
                'namespace': 'urn:ietf:params:xml:ns:yang:ietf-netconf-acm',
                'namespaceVersion': '2012.2.22',
                'neType': 'EPG-OI',
                'attributes': {
                    'path': {
                        'key': 'path',
                        'value': null,
                        'datatype': null
                    },
                    'notification-name': {
                        'key': 'notification-name',
                        'value': null,
                        'datatype': null
                    },
                    'access-operations': {
                        'key': 'access-operations',
                        'value': null,
                        'datatype': null
                    },
                    'name': {
                        'key': 'name',
                        'value': 'ericsson-swm-2',
                        'datatype': null
                    },
                    'module-name': {
                        'key': 'module-name',
                        'value': 'ericsson-swm',
                        'datatype': null
                    },
                    'action': {
                        'key': 'action',
                        'value': 'permit',
                        'datatype': null
                    },
                    'comment': {
                        'key': 'comment',
                        'value': null,
                        'datatype': null
                    },
                    'rpc-name': {
                        'key': 'rpc-name',
                        'value': null,
                        'datatype': null
                    }
                },
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'SYNCHRONIZED'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '192.168.100.37'
                    },
                    {
                        'key': 'managementState',
                        'value': 'NORMAL'
                    }
                ]
            },
            281475059730210: {
                'name': 'ericsson_bits',
                'type': 'rule',
                'poId': 281475059730210,
                'id': '281475059730210',
                'fdn': 'MeContext=CORE60EPGOI001,ManagedElement=CORE60EPGOI001,nacm=1,rule-list=ericsson-swim-1-system-read-only,rule=ericsson-swim-1',
                'namespace': 'urn:ietf:params:xml:ns:yang:ietf-netconf-acm',
                'namespaceVersion': '2012.2.22',
                'neType': 'ericsson_bits',
                'attributes': {
                    'path': {
                        'key': 'path',
                        'value': null,
                        'datatype': null
                    },
                    'notification-name': {
                        'key': 'notification-name',
                        'value': null,
                        'datatype': null
                    },
                    'name': {
                        'key': 'name',
                        'value': 'ericsson-swim-1',
                        'datatype': null
                    },
                    'a-bits': {
                        'key': 'a-bits',
                        'value': null,
                        'datatype': null
                    },
                    'action': {
                        'key': 'action',
                        'value': 'permit',
                        'datatype': null
                    },
                    'module-name': {
                        'key': 'module-name',
                        'value': 'ericsson-swim',
                        'datatype': null
                    },
                    'comment': {
                        'key': 'comment',
                        'value': null,
                        'datatype': null
                    },
                    'rpc-name': {
                        'key': 'rpc-name',
                        'value': null,
                        'datatype': null
                    }
                },
                'networkDetails': [
                    {
                        'key': 'syncStatus',
                        'value': 'SYNCHRONIZED'
                    },
                    {
                        'key': 'ipAddress',
                        'value': '192.168.100.90'
                    },
                    {
                        'key': 'managementState',
                        'value': 'NORMAL'
                    }
                ]
            }
        };
        var persistentObject = JSON.parse(JSON.stringify(original));

        return {
            getObject: function(poid) {
                var data = persistentObject[poid] || persistentObject['281475075346449'];
                data = JSON.parse(JSON.stringify(data));
                data.attributes = Object.keys(data.attributes).map(function(key) {
                    return  data.attributes[key];
                });
                return data;
            },

            updateObject: function(poid, attributes) {
                var poidToGet = persistentObject[poid] ? poid : '281475075346449';

                attributes.forEach(function(attribute) {
                    if (attribute === null) {
                        attribute = '<null>';
                    }
                    persistentObject[poidToGet].attributes[attribute.key] = attribute;
                });

                return poid;
            },

            reset: function() {
                persistentObject = JSON.parse(JSON.stringify(original));
            }
        };
    };
});
