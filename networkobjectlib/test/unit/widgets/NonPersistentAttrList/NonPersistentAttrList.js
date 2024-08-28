define([
    'networkobjectlib/widgets/NonPersistentAttrList/NonPersistentAttrList',
    'widgets/Accordion',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'jscore/core',
    'i18n/AdvancedDateTime'
], function(NonPersistentAttrList, Accordion, WidgetsProducer, core, AdvancedDateTime) {
    'use strict';

    describe('NonPersistentAttrList', function() {
        var sandbox,
            nonPersistentAttrList,
            formatDate = 1455099723418,
            expansionList=[],
            nodeProducer=new WidgetsProducer();

        //Type ENUM, STRING, LONG, BOOLEAN, ReadOnly, Complex_Ref
        var nodeAttributeValuesAndDefinitions = {
            'nonPersistentAttributes': [
                {
                    'key': 'userLabel',
                    'value': undefined,
                    'readOnly': false,
                    'constraints': {
                        'nullable': false,
                        'maxLength': 1028,
                        'validContentRegex': null
                    },
                    'type': 'STRING'
                },
                {
                    'key': 'collectLogsStatus',
                    'value': 'Enabled',
                    'readOnly': false,
                    'constraints': null,
                    'type': 'BOOLEAN'
                },
                {
                    'key': 'collectTraceStatus',
                    'value': null,
                    'readOnly': true,
                    'constraints': null,
                    'type': 'STRING'
                },
                {
                    'key': 'dlAccGbrAdmThresh',
                    'value': 1000,
                    'readOnly': false,
                    'constraints': {
                        'nullable': false,
                        'minValue': -34,
                        'maxValue': 29
                    },
                    'type': 'LONG'
                },
                {
                    'key': 'lastUpdatedTimeStamp',
                    'value': formatDate,
                    'readOnly': false,
                    'isNonPersistent': false,
                    'defaultValue': null,
                    'description': 'Time in Date format which represents last updated time',
                    'constraints': {
                        'nullable': false
                    },
                    'type': 'TIMESTAMP'
                },
                {
                    'key': 'lastUpdated',
                    'value': '1455099723418',
                    'readOnly': false,
                    'isNonPersistent': false,
                    'defaultValue': '0',
                    'description': 'Time in string format which represents last updated time',
                    'constraints': {
                        'nullable': false,
                        'minValue': -34,
                        'maxValue': 29
                    },
                    'type': 'STRING'
                },
                {
                    key: 'dnsLookupOnTai',
                    'readOnly': false,
                    'type': 'ENUM_REF',
                    'value': 'ON',
                    'defaultValue': 'ON',
                    'description': 'Controls if the Trackin...es effect: Immediately.',
                    'enumeration': {
                        'key': 'DnsLookup',
                        'description': 'DnsLookup',
                        'enumMembers': [
                            {
                                'key': 'OFF',
                                'value': 0,
                                'description': 'OFF'
                            },
                            {
                                'key': 'ON',
                                'value': 1,
                                'description': 'ON'
                            }
                        ]
                    }

                },
                {
                    'key': 'eNodeBPlmnId',
                    'value': [
                        {
                            'key': 'mcc',
                            'value': 3
                        },
                        {
                            'key': 'mnc',
                            'value': true
                        },
                        {
                            'key': 'mncLength',
                            value: 'hello'
                        }
                    ],
                    'readOnly': false,	//could be true?
                    'type': 'COMPLEX_REF',
                    'constraints': null, //
                    'defaultValue': null, //would be a complex ref
                    'description': 'Status of logs collection, initiated with operation collectAutIntLogs.',
                    'complexRef': {
                        'key': 'PlmnIdentity',
                        'description': 'CollectLogsStatus',
                        attributes: [
                            {
                                'key': 'mcc',
                                'value': 3,
                                'readOnly': false,
                                'type': 'LONG',
                                'constraints': {
                                    'nullable': false,
                                    'minValue': -34,
                                    'maxValue': 29
                                },
                                'defaultValue': 24,
                                'description': 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).\n\nResolution: 1\nDependencies: Will only be used then dscpUsage is active.\nTakes effect: Node restart'
                            },
                            {
                                'key': 'mnc',
                                'value': true,
                                'readOnly': false,
                                'type': 'BOOLEAN',
                                'defaultValue': true,
                                'description': 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).\n\nResolution: 1\nDependencies: Will only be used then dscpUsage is active.\nTakes effect: Node restart'
                            },
                            {
                                'key': 'mncLength',
                                value: 'hello',
                                'readOnly': false,
                                'type': 'STRING',
                                'constraints': {
                                    'nullable': false,
                                    'maxLength': 1028,
                                    'validContentRegex': null
                                },
                                'defaultValue': '',
                                'description': 'Temporary attributes are intended for temporary solutions, and their usage may vary depending on the installed software. It is strongly recommended to only set the attributes that correspond to a desired functionality and leave all other temporary attributes set to default value. Information in the descriptions about what attributes are in use may be overridden by the information in CPI Info documents. Note that a later release may use another attribute to control the functionality previously provided by a temporary attribute, or may remove the functionality altogether. In these cases, the change is documented in the NIR.\n\nTakes effect: Immediately'
                            }
                        ]
                    }

                }
            ]
        };


        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            nonPersistentAttrList = new NonPersistentAttrList(nodeAttributeValuesAndDefinitions, 'string', null, expansionList, nodeProducer);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onViewReady()', function() {

            var viewStub,testDiv;

            beforeEach(function() {
                testDiv = new core.Element('testDiv');
                viewStub = {
                    showNonPersistentAttrbsNotFoundMsg: function() {
                        return testDiv;
                    }
                };
                sandbox.spy(viewStub, 'showNonPersistentAttrbsNotFoundMsg');
                nonPersistentAttrList.view = viewStub;


                sandbox.stub(nonPersistentAttrList, 'populateAttributeContainer');
            });

            it('Should populate attribute container for each attribute',function() {
                nonPersistentAttrList.onViewReady();

                //ASSERT
                expect(nonPersistentAttrList.populateAttributeContainer.callCount).to.equal(8);
            });

            it('Should show non-persistent not found msg when no non-persistent attributes exist',function() {
                nonPersistentAttrList.options.nonPersistentAttributes = [];
                nonPersistentAttrList.filterText = '';

                nonPersistentAttrList.onViewReady();

                //ASSERT
                expect(viewStub.showNonPersistentAttrbsNotFoundMsg.callCount).to.equal(1);
            });
        });

        describe('formatDateAttributes()', function() {

            var date = new Date(formatDate);
            var dateTime  = AdvancedDateTime(date).format('DTS');

            it('Should format date correctly for valid value', function() {
                expect(nonPersistentAttrList.formatDateAttributes(formatDate)).to.equal(dateTime);
            });
        });

    });
});
