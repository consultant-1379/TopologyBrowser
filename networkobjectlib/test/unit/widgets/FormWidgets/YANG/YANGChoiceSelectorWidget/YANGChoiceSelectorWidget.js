define([
    'networkobjectlib/widgets/FormWidgets/YANG/YANGChoiceSelectorWidget/YANGChoiceSelectorWidget',
], function(ChoiceSelector) {
    'use strict';

    describe('Choice Selector Widget', function() {
        var sandbox, onChangeHandler,
            choiceSelectorWidget,
            optionsStub;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            optionsStub = {
                description: 'strict-bgp-tracking',
                key: 'case',
                value: 'strict-bgp-tracking',
                values: [{
                    description: 'Active on startup until timer expires or BGP converges ',
                    hasPrimaryType: true,
                    key: 'bgp-converge-delay'
                },
                {
                    description: 'Active on startup until timer expires ',
                    hasPrimaryType: true,
                    key: 'on-startup'
                },
                {
                    description: 'strict-bgp-tracking',
                    hasPrimaryType: false,
                    key: 'strict-bgp-tracking'
                }]
            };

            choiceSelectorWidget = new ChoiceSelector(optionsStub, onChangeHandler);

        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('createSelectBox', function() {
            it('Should draw the enum values in select box', function() {


                var selectBoxElement = choiceSelectorWidget.createSelectBox();
                expect(selectBoxElement.options.value.value).to.equal('strict-bgp-tracking');
                expect(choiceSelectorWidget.selectBoxItems.length).to.equal(4);

            });
        });

        describe('handleChangedValue', function() {
            var sandbox, choiceSelectorWidget,
                optionsStub;

            beforeEach(function() {

                sandbox = sinon.sandbox.create();
                onChangeHandler = function() {

                };

                optionsStub = {
                    description: 'strict-bgp-tracking',
                    key: 'case',
                    value: 'strict-bgp-tracking',
                    values: [{
                        description: 'Active on startup until timer expires or BGP converges ',
                        hasPrimaryType: true,
                        key: 'bgp-converge-delay'
                    },
                    {
                        description: 'Active on startup until timer expires ',
                        hasPrimaryType: true,
                        key: 'on-startup'
                    },
                    {
                        description: 'strict-bgp-tracking',
                        hasPrimaryType: false,
                        key: 'strict-bgp-tracking'
                    }],
                    onChangeHandler: onChangeHandler,
                };
                sandbox.spy(optionsStub, 'onChangeHandler') ;
                choiceSelectorWidget = new ChoiceSelector(optionsStub, optionsStub.onChangeHandler);

            });

            afterEach(function() {
                //CLEANUP
                sandbox.restore();
            });

            it('Should call valid()', function() {

                choiceSelectorWidget.invalidValues = [];
                choiceSelectorWidget.valuesToBeSaved = [];

                choiceSelectorWidget.handleChangedValue('strict-bgp-tracking');

                expect(choiceSelectorWidget.onChangeHandler.callCount).to.equal(1);
                expect(choiceSelectorWidget.onChangeHandler.getCall(0).args[0]).to.equal('strict-bgp-tracking');
            });
        });
    });
});
