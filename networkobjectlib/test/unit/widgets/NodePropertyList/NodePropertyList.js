define([
    'networkobjectlib/widgets/NodePropertyList/NodePropertyList',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'widgets/Accordion',
    'jscore/core',
    'i18n/AdvancedDateTime'
], function(NodePropertyList, WidgetsProducer, Accordion, core, AdvancedDateTime) {
    'use strict';

    describe('NodePropertyList', function() {
        var sandbox,
            nodePropertyList,
            formatDate = 1455099723418,
            nodeProducerMock = new WidgetsProducer(),
            expansionListMock = {};

        //Type ENUM, STRING, LONG, BOOLEAN, ReadOnly, Complex_Ref
        var nodeAttributeValuesAndDefinitions = {
            'attributes': [
                {
                    'key': 'userLabel',
                    'value': 'OriginalValue',
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
            nodePropertyList = new NodePropertyList(nodeAttributeValuesAndDefinitions, true, function() {}, '', expansionListMock, nodeProducerMock);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('formatDateAttributes()', function() {
            var date = new Date(formatDate);
            var dateTime  = AdvancedDateTime(date).format('DTS');

            it('Should format date correctly for valid value', function() {
                expect(nodePropertyList.formatDateAttributes(formatDate)).to.equal(dateTime);
            });
        });

        describe('createNonPersistentAccordion()', function() {

            var viewStub,accordionNonPersistentContainerStub;

            beforeEach(function() {
                accordionNonPersistentContainerStub = new core.Element('mockDiv');
                sandbox.stub(Accordion.prototype, 'init');
                sandbox.stub(Accordion.prototype, 'attachTo');
                viewStub = {
                    getAccordionNonPersistentContainer: function() {
                        return accordionNonPersistentContainerStub;
                    }
                };
                sandbox.spy(viewStub, 'getAccordionNonPersistentContainer');
                nodePropertyList.view = viewStub;
            });

            it('Should create accordion for non persistent attributes',function() {
                nodePropertyList.createNonPersistentAccordion();

                //ASSERT
                expect(Accordion.prototype.init.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.getCall(0).calledWith(viewStub.getAccordionNonPersistentContainer())).to.equal(true);
            });
        });

        describe('setNonPersistentContent()', function() {

            var content;

            beforeEach(function() {
                content = [];
                nodePropertyList.accordionNonPersistent = {
                    setContent: function() {}
                };
                sandbox.stub(nodePropertyList.accordionNonPersistent, 'setContent');
            });

            it('Should set content for non persistent',function() {
                nodePropertyList.setNonPersistentContent(content);

                //ASSERT
                expect(nodePropertyList.accordionNonPersistent.setContent.callCount).to.equal(1);
                expect(nodePropertyList.accordionNonPersistent.setContent.getCall(0).calledWith()).to.equal(true);
            });
        });

        describe('addEventHandlers()', function() {

            var content;

            beforeEach(function() {
                content = [];
                nodePropertyList.accordionNonPersistent = {
                    addEventHandler: function() {}
                };
                sandbox.stub(nodePropertyList.accordionNonPersistent, 'addEventHandler');
            });

            it('Should add event handler to the non-persistent accordion',function() {
                nodePropertyList.addEventHandlers(content);

                //ASSERT
                expect(nodePropertyList.accordionNonPersistent.addEventHandler.callCount).to.equal(1);
            });
        });

    });
});
