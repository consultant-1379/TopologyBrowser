define([
    'jscore/core',
    'networkobjectlib/widgets/WidgetsCore/WidgetsProducer',
    'networkobjectlib/widgets/FormWidgets/ReadOnlyFormWidget/ReadOnlyFormWidget',
    'networkobjectlib/widgets/FormWidgets/StringInputFormWidget/StringInputFormWidget',
    'networkobjectlib/widgets/FormWidgets/NumberInputFormWidget/NumberInputFormWidget',
    'networkobjectlib/widgets/FormWidgets/OnOffSwitch/OnOffSwitch',
    'networkobjectlib/widgets/FormWidgets/EnumDropdownWidget/EnumDropdownWidget',
    'networkobjectlib/widgets/FormWidgets/YANG/YANGChoiceWidget/YANGChoiceWidget',
    'networkobjectlib/widgets/FormWidgets/ComplexRefWidget/ComplexRefWidget',
    'networkobjectlib/widgets/FormWidgets/ListWidget/ListWidget'
], function(core, WidgetsProducer, ReadOnly, StringInput, NumberInput, OnOff, EnumDropdown, Choice, Complex, ListWidget) {
    'use strict';

    describe('WidgetsProducer', function() {
        var sandbox,
            producer;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            producer = new WidgetsProducer();

            sandbox.spy(producer, 'createWidget');
            sandbox.spy(producer, 'attachWidget');
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('createWidget', function() {
            it('Should create widget for type TIMESTAMP', function() {
                StringInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    disableInput: function() {},
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    },
                    setTextAreaHeightDynamically: function() {}
                };
                sandbox.stub(StringInput.prototype, 'init');
                sandbox.spy(StringInput.prototype.view, 'getTextInput');
                sandbox.stub(StringInput.prototype.view, 'disableInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');
                var widget = producer.createWidget({
                    type: 'TIMESTAMP',
                    value: 1497262359000
                });

                expect(widget).to.be.an.instanceof(StringInput);
                expect(widget.options.formattedTimestamp).not.to.be.equal(undefined);
            });

            it('Should create widget for type STRING', function() {
                StringInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    },
                    setTextAreaHeightDynamically: function() {}
                };
                sandbox.stub(StringInput.prototype, 'init');
                sandbox.spy(StringInput.prototype.view, 'getTextInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');

                var widget = producer.createWidget({
                    type: 'STRING',
                    value: 'test'
                });

                expect(widget).to.be.an.instanceof(StringInput);
            });

            it('Should create widget for type IP_ADDRESS', function() {
                StringInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    },
                    setTextAreaHeightDynamically: function() {}
                };
                sandbox.stub(StringInput.prototype, 'init');
                sandbox.spy(StringInput.prototype.view, 'getTextInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');

                var widget = producer.createWidget({
                    type: 'IP_ADDRESS',
                    value: '100.0.0.1'
                });

                expect(widget).to.be.an.instanceof(StringInput);
            });


            it('Should create widget for type BOOLEAN', function() {
                var widget = producer.createWidget({
                    type: 'BOOLEAN',
                    value: true
                });

                expect(widget).to.be.an.instanceof(OnOff);
            });

            it('Should create ENUM widget for type BOOLEAN if it is Multi-Edit flow ', function() {
                var widget = producer.createWidget({
                    type: 'BOOLEAN',
                    value: true,
                    isMultiEdit: true
                });

                expect(widget).to.be.an.instanceof(EnumDropdown);
            });

            it('Should create widget for type INTEGER', function() {
                NumberInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    }
                };
                sandbox.stub(NumberInput.prototype, 'init');
                sandbox.spy(NumberInput.prototype.view, 'getTextInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');

                var widget = producer.createWidget({
                    type: 'INTEGER',
                    value: 1,
                    constraints: {}
                });

                expect(widget).to.be.an.instanceof(NumberInput);
            });

            it('Should create widget for type BYTE', function() {
                NumberInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    }
                };
                sandbox.stub(NumberInput.prototype, 'init');
                sandbox.spy(NumberInput.prototype.view, 'getTextInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');

                var widget = producer.createWidget({
                    type: 'BYTE',
                    value: 1,
                    constraints: {}
                });

                expect(widget).to.be.an.instanceof(NumberInput);
            });

            it('Should create widget for type SHORT', function() {
                NumberInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    }
                };
                sandbox.stub(NumberInput.prototype, 'init');
                sandbox.spy(NumberInput.prototype.view, 'getTextInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');

                var widget = producer.createWidget({
                    type: 'SHORT',
                    value: 1,
                    constraints: {}
                });

                expect(widget).to.be.an.instanceof(NumberInput);
            });

            it('Should create widget for type LONG', function() {
                NumberInput.prototype.view = {
                    getTextInput: function() {
                        return new core.Element('div');
                    },
                    getModelInfoButton: function() {
                        return new core.Element('div');
                    }
                };
                sandbox.stub(NumberInput.prototype, 'init');
                sandbox.spy(NumberInput.prototype.view, 'getTextInput');
                sandbox.spy(StringInput.prototype.view, 'getModelInfoButton');

                var widget = producer.createWidget({
                    type: 'LONG',
                    value: 1,
                    constraints: {}
                });

                expect(widget).to.be.an.instanceof(NumberInput);
            });

            it('Should create widget for type ENUM_REF', function() {
                sandbox.spy(EnumDropdown.prototype, 'init');

                var widget = producer.createWidget({
                    type: 'ENUM_REF',
                    value: '1',
                    items: [],
                    enumeration: { enumMembers: [ ] }
                });

                expect(widget).to.be.an.instanceof(EnumDropdown);
            });

            it('Should create widget for type CHOICE', function() {
                sandbox.spy(Choice.prototype, 'init');

                var widget = producer.createWidget({
                    type: 'CHOICE',
                    value: '1',
                    cases: [
                        {
                            'name': 'dst-addr',
                            'attributes': [],
                            'hasPrimaryType': true,
                            'description': 'dst-addr'
                        },
                        {
                            'name': 'dst-any',
                            'attributes': [
                                {
                                    'activeChoiceCase': {
                                        'caseName': 'dst-any',
                                        'choiceName': 'seq-opt2'
                                    },
                                    'key': 'dst-any',
                                    'type': 'BOOLEAN',
                                    'value': true
                                }
                            ],
                            'hasPrimaryType': false,
                            'description': 'dst-any'
                        },
                        {
                            'name': 'dst-host',
                            'attributes': [
                                {
                                    'activeChoiceCase': {
                                        'caseName': 'dst-host',
                                        'choiceName': 'seq-opt2'
                                    },
                                    'key': 'dst-host',
                                    'type': 'STRING',
                                    'value': null
                                }
                            ],
                            'hasPrimaryType': false,
                            'description': 'dst-host'
                        }
                    ]
                }, {
                    onCollapseEventHandler: function() {}
                });

                expect(widget).to.be.an.instanceof(Choice);
            });

            it('Should create widget for type COMPLEX_REF', function() {
                sandbox.spy(Complex.prototype, 'init');

                var widget = producer.createWidget({
                    type: 'COMPLEX_REF',
                    value: '1',
                    complexRef: { attributes: [ ] }
                }, {
                    onCollapseEventHandler: function() {}
                });

                expect(widget).to.be.an.instanceof(Complex);
            });

            it('Should create widget for type LIST', function() {
                sandbox.spy(ListWidget.prototype, 'init');

                var widget = producer.createWidget({
                    type: 'LIST',
                    value: [],
                    constraints: {}
                }, {
                    onCollapseEventHandler: function() {}
                });

                expect(widget).to.be.an.instanceof(ListWidget);
            });
        });

        describe('attachWidget', function() {
            it('Should create widget for type TIMESTAMP', function() {
                producer.createWidget({
                    type: 'LIST',
                    value: [],
                    constraints: {}
                }, {
                    onCollapseEventHandler: function() {}
                }, [], new core.Element('div'));

                expect(producer.createWidget.callCount).to.be.equal(1);
            });
        });
    });
});
