define([
    'networkobjectlib/widgets/FormWidgets/ListFormContainerWidget/ListFormContainerWidget',
    'networkobjectlib/widgets/FormWidgets/FormContainerWidget/FormContainerWidget',
    'jscore/core',
    'widgets/Accordion'
], function(ListFormContainer, FormContainerWidget, core, Accordion) {
    'use strict';

    describe('List Form Container Widget', function() {
        var sandbox,
            viewStub,
            listFormContainer,
            elem,
            optionsStub;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            elem = [{
                'datatype': 'INTEGER',
                'inputTitle': 'Type: undefined, ReadOnly: True',
                'itemsNew': {
                    'description': undefined,
                    'key': 'enbId',
                    'value': '123'
                },
                'key': 'enbId',
                'readOnly': true,
                'value': 123
            },
            {
                'datatype': 'INTEGER',
                'inputTitle': 'Type: undefined, ReadOnly: True',
                'itemsNew': {
                    'description': undefined,
                    'key': 'mcc',
                    'value': '44'
                },
                'key': 'mcc',
                'readOnly': true,
                'value': 44
            },
            {
                'datatype': 'INTEGER',
                'inputTitle': 'Type: undefined, ReadOnly: True',
                'itemsNew': {
                    'description': undefined,
                    'key': 'mnc',
                    'value': '66'
                },
                'key': 'mnc',
                'readOnly': true,
                'value': 66
            },
            {
                'datatype': 'INTEGER',
                'inputTitle': 'Type: undefined, ReadOnly: True',
                'itemsNew': {
                    'description': undefined,
                    'key': 'mncLength',
                    'value': '2'
                },
                'key': 'mncLength',
                'readOnly': true,
                'value': 2
            }];

            optionsStub = {
                'attributeType': 'x2BlackList',
                'values': [elem,
                    [{
                        'datatype': 'INTEGER',
                        'key': 'enbId',
                        'readOnly': true,
                        'value': 1234
                    },
                    {
                        'datatype': 'INTEGER',
                        'key': 'mcc',
                        'readOnly': true,
                        'value': 55
                    },
                    {
                        'datatype': 'INTEGER',
                        'key': 'mnc',
                        'readOnly': true,
                        'value': 77
                    },
                    {
                        'datatype': 'INTEGER',
                        'key': 'mncLength',
                        'readOnly': true,
                        'value': 3
                    }]
                ]
            };
            listFormContainer = new ListFormContainer(optionsStub);
            viewStub = {
                getFormContainer: function() {
                    return new core.Element('div');
                }
            };
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('buildContainer', function() {

            it('Should call container widget', function() {

                sandbox.stub(Accordion.prototype, 'init');
                sandbox.stub(Accordion.prototype, 'attachTo');
                sandbox.spy(viewStub, 'getFormContainer');
                listFormContainer.view = viewStub;

                listFormContainer.buildContainer();

                expect(Accordion.prototype.init.callCount).to.equal(2);
                expect(Accordion.prototype.attachTo.getCall(0).calledWith(viewStub.getFormContainer())).to.equal(true);
            });
        });
    });
});
