define([
    'networkobjectlib/widgets/FormWidgets/ListWidget/ListWidget',
    'jscore/core',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'widgets/Accordion'
], function(ListWidget, core, WidgetsProducer, Accordion) {
    'use strict';

    describe('List Form Widget', function() {
        var sandbox,
            viewStub,
            listWidgetUnderTest,
            listWidgetReadOnlyUnderTest,
            optionsStub, viewContainerDiv,
            accordionUnderTest,accordionReadOnlyUnderTest;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            optionsStub = [{
                'key': 'additionalPlmnAlarmSupprList',
                'writeBehavior': 'PERSIST_AND_DELEGATE',
                'readBehavior': 'FROM_PERSISTENCE',
                'userExposure': 'ALWAYS',
                'immutable': false,
                'type': 'LIST',
                'constraints': {
                    'nullable': true,
                    'valueRangeConstraints': [
                        {
                            'minValue': 0,
                            'maxValue': 5
                        }
                    ],
                    'ordered': null,
                    'uniqueMembers': false
                },
                'activeChoiceCase': null,
                'defaultValue': [
                    false,
                    false,
                    false,
                    false,
                    false
                ],
                'description': 'The list of PLMN IDs in the cell indicates if they are suppressed for alarms PLMN Service Degraded and PLMN Service Unavailable when PLMN  is not available in the cell.\n\nThe PLMN ID appearing in additionalPlmnList[x] is suppressed when additionalPlmnAlarmSupprList[x] is true.\n\nIf the configured PLMN ID is not a served PLMN ID, then the alarm is suppressed independent of the configured settings.',
                'namespaceversions': {
                    'Lrat': [
                        '1.7126.0'
                    ]
                },
                'listReference': {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': null,
                    'immutable': false,
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': null,
                    'namespaceversions': {}
                },
                'value': [
                    false,
                    false,
                    false,
                    false,
                    false
                ],

            },
            {
                'key': 'additionalPlmnAlarmSupprListReadOnly',
                'writeBehavior': 'NOT_ALLOWED',
                'readBehavior': 'FROM_PERSISTENCE',
                'userExposure': 'ALWAYS',
                'immutable': true,
                'type': 'LIST',
                'constraints': {
                    'nullable': true,
                    'valueRangeConstraints': [
                        {
                            'minValue': 0,
                            'maxValue': 5
                        }
                    ],
                    'ordered': null,
                    'uniqueMembers': false
                },
                'activeChoiceCase': null,
                'defaultValue': [
                    false,
                    false,
                    false,
                    false,
                    false
                ],
                'description': 'The list of PLMN IDs in the cell indicates if they are suppressed for alarms PLMN Service Degraded and PLMN Service Unavailable when PLMN  is not available in the cell.\n\nThe PLMN ID appearing in additionalPlmnList[x] is suppressed when additionalPlmnAlarmSupprList[x] is true.\n\nIf the configured PLMN ID is not a served PLMN ID, then the alarm is suppressed independent of the configured settings.',
                'namespaceversions': {
                    'Lrat': [
                        '1.7126.0'
                    ]
                },
                'listReference': {
                    'key': null,
                    'writeBehavior': null,
                    'readBehavior': null,
                    'userExposure': null,
                    'immutable': false,
                    'type': 'BOOLEAN',
                    'constraints': {
                        'nullable': true
                    },
                    'activeChoiceCase': null,
                    'defaultValue': null,
                    'description': null,
                    'namespaceversions': {}
                },
                'value': [
                    false,
                    false,
                    false,
                    false,
                    false
                ],
            }];

            listWidgetUnderTest = new ListWidget(optionsStub[0]);
            listWidgetReadOnlyUnderTest = new ListWidget(optionsStub[1]);
            viewContainerDiv = new core.Element('div');
            viewStub = {
                getAccordionContainer: function() {
                    return viewContainerDiv;
                },
                getModelInfoButton: function() {
                    return new core.Element('div');
                }
            };
            
            accordionUnderTest = new Accordion({
                title: optionsStub[0].key,
                expanded: false,
                content: null
            });
            accordionReadOnlyUnderTest = new Accordion({
                title: optionsStub[1].key,
                expanded: false,
                content: null
            });
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onViewReady', function() {
            it('Should prepare the view for the editable widget', function() {

                listWidgetUnderTest.view = viewStub;

                sandbox.stub(Accordion.prototype, 'attachTo');
                sandbox.spy(viewStub, 'getAccordionContainer', function() { return viewContainerDiv; });
                sandbox.stub(listWidgetUnderTest, 'createAccordion', function()  { return accordionUnderTest; });
                sandbox.spy(viewStub, 'getModelInfoButton', function()  { return viewContainerDiv; });
                listWidgetUnderTest.view = viewStub;

                listWidgetUnderTest.onViewReady();

                expect(listWidgetUnderTest.createAccordion.callCount).to.equal(1);
                expect(viewStub.getAccordionContainer.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.getCall(0).calledWith(viewContainerDiv)).to.equal(true);
            });
            it('Should prepare the view for the readonly widget', function() {

                listWidgetReadOnlyUnderTest.view = viewStub;

                sandbox.stub(Accordion.prototype, 'attachTo');
                sandbox.spy(viewStub, 'getAccordionContainer', function() { return viewContainerDiv; });
                sandbox.stub(listWidgetReadOnlyUnderTest, 'createAccordion', function()  { return accordionReadOnlyUnderTest; });
                listWidgetReadOnlyUnderTest.view = viewStub;

                listWidgetReadOnlyUnderTest.onViewReady();

                expect(listWidgetReadOnlyUnderTest.createAccordion.callCount).to.equal(1);
                expect(viewStub.getAccordionContainer.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.getCall(0).calledWith(viewContainerDiv)).to.equal(true);
            });
        });
        describe('createAccordion', function() {
            it('Should create the accordion for the editable widget', function() {

                sandbox.stub(Accordion.prototype, 'init');
                listWidgetUnderTest.view = viewStub;

                var elem = listWidgetUnderTest.createAccordion();

                expect(Accordion.prototype.init.callCount).to.equal(1);
                expect(elem).not.to.equal(null);
            });
            it('Should create the accordion for the readonly widget', function() {

                sandbox.stub(Accordion.prototype, 'init');
                listWidgetReadOnlyUnderTest.view = viewStub;

                var elem = listWidgetReadOnlyUnderTest.createAccordion();

                expect(Accordion.prototype.init.callCount).to.equal(1);
                expect(elem).not.to.equal(null);
            });
        });
        describe('addEventHandler', function() {
            it('Should attach the event to the accordion containing the list of the editable widget', function() {
                var funct = new function() {};
                listWidgetUnderTest.view = viewStub;
                listWidgetUnderTest.onViewReady();
                sandbox.stub(listWidgetUnderTest.accordion, 'addEventHandler');

                listWidgetUnderTest.addEventHandler('expand', funct);

                expect(listWidgetUnderTest.accordion.addEventHandler.callCount).to.equal(1);
                expect(listWidgetUnderTest.accordion.addEventHandler.getCall(0).calledWith('expand',{})).to.equals(true);
            });
            it('Should attach the event to the accordion containing the list of the readonly widget', function() {
                var funct = new function() {};
                listWidgetReadOnlyUnderTest.view = viewStub;
                listWidgetReadOnlyUnderTest.onViewReady();
                sandbox.stub(listWidgetReadOnlyUnderTest.accordion, 'addEventHandler');

                listWidgetReadOnlyUnderTest.addEventHandler('expand', funct);

                expect(listWidgetReadOnlyUnderTest.accordion.addEventHandler.callCount).to.equal(1);
                expect(listWidgetReadOnlyUnderTest.accordion.addEventHandler.getCall(0).calledWith('expand',{})).to.equals(true);
            });
        });
    });
});
