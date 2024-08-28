define([
    'networkobjectlib/widgets/FormWidgets/ReadOnlyWrapperWidget/ReadOnlyWrapperWidget',
    'networkobjectlib/widgets/FormWidgets/ListWidgetContainer/ListWidgetContainer',
    'jscore/core',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'widgets/Accordion'
], function(ReadOnlyWrapper, ListWidgetContainer, core, WidgetsProducer, Accordion) {
    'use strict';

    describe('Read-Only Accordion Wrapper Widget', function() {
        var sandbox,
            viewStub,
            readOnlyWrapperUnderTest,
            optionsStub, viewContainerDiv,
            accordionUnderTest;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            optionsStub = {
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

            };
            var formContainer = new ListWidgetContainer(optionsStub);

            accordionUnderTest =  new Accordion({
                title: optionsStub.key,
                expanded: false,
                content: formContainer
            });
            readOnlyWrapperUnderTest = new ReadOnlyWrapper(optionsStub, accordionUnderTest);
            viewContainerDiv = new core.Element('div');
            viewStub = {
                getAccordionContainer: function() {
                    return viewContainerDiv;
                },
                getModelInfoButton: function() {
                    return new core.Element('div');
                }
            };
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onViewReady', function() {
            it('Should prepare the view for the wrapper widget', function() {

                readOnlyWrapperUnderTest.view = viewStub;

                sandbox.stub(Accordion.prototype, 'attachTo');
                sandbox.spy(viewStub, 'getAccordionContainer', function() { return viewContainerDiv; });
                sandbox.spy(viewStub, 'getModelInfoButton', function()  { return viewContainerDiv; });
                readOnlyWrapperUnderTest.view = viewStub;

                readOnlyWrapperUnderTest.onViewReady();

                expect(viewStub.getAccordionContainer.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.callCount).to.equal(1);
                expect(Accordion.prototype.attachTo.getCall(0).calledWith(viewContainerDiv)).to.equal(true);
            });
        });
        describe('addEventHandler', function() {
            it('Should attach the event to the accordion containing the list of the wrapper widget', function() {
                var funct = new function() {};
                readOnlyWrapperUnderTest.view = viewStub;
                readOnlyWrapperUnderTest.onViewReady();
                sandbox.stub(readOnlyWrapperUnderTest.accordion, 'addEventHandler');

                readOnlyWrapperUnderTest.addEventHandler('expand', funct);

                expect(readOnlyWrapperUnderTest.accordion.addEventHandler.callCount).to.equal(1);
                expect(readOnlyWrapperUnderTest.accordion.addEventHandler.getCall(0).calledWith('expand',{})).to.equals(true);
            });
        });
    });
});
