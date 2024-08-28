define([
    'jscore/core',
    'networkobjectlib/widgets/FormWidgets/YANG/YANGChoiceWidget/YANGChoiceWidget',
    'networkobjectlib/widgets/FormWidgets/LabelWidget/LabelWidget',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer'
], function(core, YANGChoiceWidget, LabelWidget, WidgetsProducer) {
    'use strict';

    describe('YANGChoiceWidget', function() {
        var sandbox,
            widget,
            optionsStub,
            viewStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            var createMockDiv = function() {
                var elem = new core.Element('div');
                elem.setAttribute('class', 'fakeClass');
                return elem;
            };

            var getAccordionContainer = createMockDiv(),
                getCaseNameLabel = createMockDiv(),
                getCaseNameTitle = createMockDiv(),
                getChoiceProperyListContainer = createMockDiv(),
                getOuterWrapper = createMockDiv(),
                getKeyValue = createMockDiv();

            optionsStub = {
                cases: [
                    {
                        attributes: [],
                        name: 'bgp-converge-delay'
                    },
                    {
                        attributes: [],
                        name: 'on-startup'
                    },
                    {
                        attributes: [
                            {
                                activeChoiceCase: {
                                    caseName: 'strict-bgp-tracking',
                                    choiceName: 'stub-router-opt'
                                },
                                constraints: {
                                    nullable: true
                                },
                                defaultValue: null,
                                description: 'type empty',
                                isNonPersistent: false,
                                key: 'strict-bgp-tracking',
                                readOnly: false,
                                type: 'BOOLEAN',
                                value: true
                            }
                        ],
                        name: 'strict-bgp-tracking'
                    }
                ],
                defaultValue: null,
                expanded: true,
                innerOnChangeCallback: function() {},
                innerOnInvalidCallback: function() {},
                isArray: true,
                key: 'stub-router-opt',
                mandatory: false,
                onChangeCallback: function() {},
                onInvalidCallback: function() {},
                selectedIndex: 2,
                type: 'CHOICE',
                value: 'strict-bgp-tracking',
                widgetsProducer: new WidgetsProducer()
            };

            viewStub = {
                getAccordionContainer: function() { return getAccordionContainer; },
                getCaseNameLabel: function() { return getCaseNameLabel; },
                getCaseNameTitle: function() { return getCaseNameTitle; },
                getChoiceProperyListContainer: function() { return getChoiceProperyListContainer; },
                getOuterWrapper: function() { return getOuterWrapper; },
                getKeyValue: function() { return getKeyValue; }
            };

            sandbox.spy(optionsStub, 'onChangeCallback');
            sandbox.spy(optionsStub, 'onInvalidCallback');
            sandbox.spy(viewStub, 'getAccordionContainer');
            sandbox.spy(viewStub, 'getCaseNameLabel');
            sandbox.spy(viewStub, 'getCaseNameTitle');
            sandbox.spy(viewStub, 'getChoiceProperyListContainer');
            sandbox.spy(viewStub, 'getOuterWrapper');
            sandbox.spy(viewStub, 'getKeyValue');

            widget = new YANGChoiceWidget(optionsStub);
            widget.view = viewStub;
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onViewReady', function() {
            it('Should handle readonly', function() {
                optionsStub.readOnly = true;

                sandbox.stub(widget, 'setKeyValue');
                sandbox.spy(optionsStub.widgetsProducer, 'createWidget');

                widget.onViewReady();

                expect(widget.setKeyValue.callCount).to.equal(1);
                expect(widget.view.getChoiceProperyListContainer.callCount).to.equal(4);
                expect(optionsStub.widgetsProducer.createWidget.callCount).to.equal(1);
            });

            it('Should handle editable', function() {
                sandbox.stub(widget, 'setKeyValue');
                sandbox.spy(widget, 'createChoiceCases');
                sandbox.spy(widget, 'createAccordion');
                sandbox.spy(widget.view.getChoiceProperyListContainer(), 'setModifier');
                sandbox.spy(widget.view.getCaseNameLabel(), 'setModifier');
                sandbox.spy(widget.view.getCaseNameTitle(), 'setModifier');

                widget.onViewReady();

                expect(widget.setKeyValue.callCount).to.equal(1);
                expect(widget.view.getChoiceProperyListContainer().setModifier.calledWith('hidden')).to.equal(true);
                expect(widget.createChoiceCases.callCount).to.equal(1);
                expect(widget.createAccordion.callCount).to.equal(1);

            });
        });
    });
});
