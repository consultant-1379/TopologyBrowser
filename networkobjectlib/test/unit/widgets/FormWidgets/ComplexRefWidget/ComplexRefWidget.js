
define([
    'networkobjectlib/widgets/FormWidgets/ComplexRefWidget/ComplexRefWidget'
], function(Complex) {
    'use strict';

    describe('Complex Ref Widget', function() {
        var sandbox,
            complexWidget,
            optionsStub,
            onChangeCallback,
            onInvalidCallback,
            innerOnChangeCallback,
            innerOnInvalidCallback;

        beforeEach(function() {

            sandbox = sinon.sandbox.create();
            onChangeCallback = function() {

            };
            onInvalidCallback = function() {

            };
            innerOnChangeCallback = function() {

            };
            innerOnInvalidCallback = function() {

            };

            optionsStub = {
                'key': 'eNodeBPlmnId',
                'value': [
                    {
                        'key': 'mcc',
                        'value': 3,
                        'sensitive': false
                    },
                    {
                        'key': 'mnc',
                        'value': true,
                        'sensitive': false
                    },
                    {
                        'key': 'mncLength',
                        value: 'hello',
                        'sensitive': false
                    }
                ],
                'readOnly': false,
                'type': 'COMPLEX_REF',
                'constraints': null,
                'defaultValue': null,
                'description': 'Status of logs collection, initiated with operation collectAutIntLogs.',
                'sensitive': false,
                'complexRef': {
                    'key': 'PlmnIdentity',
                    'description': 'CollectLogsStatus',
                    attributes: [
                        {
                            'key': 'mcc',
                            'value': 3,
                            'readOnly': false,
                            'sensitive': false,
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
                            'sensitive': false,
                            'type': 'BOOLEAN',
                            'defaultValue': true,
                            'description': 'Static mapping of DiffServ label for control messages, Performance Management (PM), and Non-Access Stratum (NAS).\n\nResolution: 1\nDependencies: Will only be used then dscpUsage is active.\nTakes effect: Node restart'
                        },
                        {
                            'key': 'mncLength',
                            value: 'hello',
                            'readOnly': false,
                            'sensitive': false,
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
                },
                onChangeCallback: onChangeCallback,
                onInvalidCallback: onInvalidCallback,
                innerOnChangeCallback: innerOnChangeCallback,
                innerOnInvalidCallback: innerOnInvalidCallback
            };
            sandbox.spy(optionsStub, 'onChangeCallback') ;
            sandbox.spy(optionsStub, 'onInvalidCallback') ;

            complexWidget = new Complex(optionsStub);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        it('Should call Invalid() if there are invalid Values', function() {

            complexWidget.invalidValues = [];

            complexWidget.invalidValues.push({
                'key': 'eNodeBPlmnId',
                'value': [
                    {
                        'key': 'mcc',
                        'value': 'abc',
                        'sensitive': false
                    },
                    {
                        'key': 'mnc',
                        'value': false,
                        'sensitive': false
                    },
                    {
                        'key': 'mncLength',
                        value: 'hello',
                        'sensitive': false
                    }
                ]
            });

            complexWidget.handleChangedValue();

            expect(optionsStub.onChangeCallback.callCount).to.equal(0);
            expect(optionsStub.onInvalidCallback.callCount).to.equal(1);
            expect(optionsStub.onInvalidCallback.getCall(0).args[0].value).to.deep.equal([
                {
                    'datatype': 'LONG',
                    'key': 'mcc',
                    'value': 3,
                    'sensitive': false
                },
                {
                    'datatype': 'BOOLEAN',
                    'key': 'mnc',
                    'value': true,
                    'sensitive': false
                },
                {
                    'datatype': 'STRING',
                    'key': 'mncLength',
                    value: 'hello',
                    'sensitive': false
                }]);
            expect(optionsStub.onInvalidCallback.getCall(0).args[0].key).to.equal('eNodeBPlmnId');
            expect(optionsStub.onInvalidCallback.getCall(0).args[0].datatype).to.equal('COMPLEX_REF');
        });

        it('Should call Valid() if the values are unchanged', function() {

            complexWidget.invalidValues = [];
            complexWidget.valuesToBeSaved = [];

            complexWidget.handleChangedValue();

            expect(optionsStub.onChangeCallback.callCount).to.equal(1);
            expect(optionsStub.onInvalidCallback.callCount).to.equal(0);
            expect(optionsStub.onChangeCallback.getCall(0).args[0].value).to.deep.equal([
                {
                    'datatype': 'LONG',
                    'key': 'mcc',
                    'value': 3,
                    'sensitive': false
                },
                {
                    'datatype': 'BOOLEAN',
                    'key': 'mnc',
                    'value': true,
                    'sensitive': false
                },
                {
                    'datatype': 'STRING',
                    'key': 'mncLength',
                    value: 'hello',
                    'sensitive': false
                }]);
            expect(optionsStub.onChangeCallback.getCall(0).args[0].key).to.equal('eNodeBPlmnId');
            expect(optionsStub.onChangeCallback.getCall(0).args[0].datatype).to.equal('COMPLEX_REF');
        });

        it('Should call Valid() if the values are changed and Valid', function() {

            complexWidget.invalidValues = [];
            complexWidget.valuesToBeSaved = [];

            complexWidget.valuesToBeSaved.push({
                'key': 'eNodeBPlmnId',
                'value': [
                    {
                        'key': 'mcc',
                        'value': 2,
                        'sensitive': false
                    },
                    {
                        'key': 'mnc',
                        'value': false,
                        'sensitive': false
                    },
                    {
                        'key': 'mncLength',
                        value: 'hello',
                        'sensitive': false
                    }
                ]
            });

            complexWidget.handleChangedValue();

            expect(optionsStub.onChangeCallback.callCount).to.equal(1);
            expect(optionsStub.onInvalidCallback.callCount).to.equal(0);
            expect(optionsStub.onChangeCallback.getCall(0).args[0].value).to.deep.equal([
                {
                    'datatype': 'LONG',
                    'key': 'mcc',
                    'value': 3,
                    'sensitive': false
                },
                {
                    'datatype': 'BOOLEAN',
                    'key': 'mnc',
                    'value': true,
                    'sensitive': false
                },
                {
                    'datatype': 'STRING',
                    'key': 'mncLength',
                    value: 'hello',
                    'sensitive': false
                }]);
            expect(optionsStub.onChangeCallback.getCall(0).args[0].key).to.equal('eNodeBPlmnId');
            expect(optionsStub.onChangeCallback.getCall(0).args[0].datatype).to.equal('COMPLEX_REF');
        });

    });
});
