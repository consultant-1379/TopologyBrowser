define([
    'networkobjectlib/widgets/FormWidgets/ReadOnly/ReadOnly',
    'jscore/core'
], function(ReadOnly) {
    'use strict';

    describe('ReadOnly', function() {
        var sandbox,
            classUnderTest,
            optionsStub;


        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('OnViewReady', function() {
            [
                {
                    'key': 'managementState',
                    'value': 'NOT_SUPPORTED',
                    'collections': null,
                    'readOnly': false,
                    'type': 'LONG',
                    'defaultValue': null,
                    'description': 'Normally this counter',
                    'isMultiEdit': true,
                    'validateOnStart': true,
                    onChangeCallback: sinon.stub(),
                    onInvalidCallback: sinon.stub()
                },
                {
                    'key': 'managementState',
                    'value': 'UNSYNCHRONIZED',
                    'collections': null,
                    'readOnly': false,
                    'type': 'LONG',
                    'defaultValue': null,
                    'description': 'Normally this counter',
                    'isMultiEdit': true,
                    'validateOnStart': true,
                    onChangeCallback: sinon.stub(),
                    onInvalidCallback: sinon.stub()
                },
                {
                    'key': 'Collection',
                    'value': null,
                    'collections': ['CollectionA'],
                    'readOnly': false,
                    'type': 'LONG',
                    'defaultValue': null,
                    'description': 'Normally this counter',
                    'isMultiEdit': true,
                    'validateOnStart': true,
                    onChangeCallback: sinon.stub(),
                    onInvalidCallback: sinon.stub()
                },
                {
                    'key': 'managementState',
                    'value': 'MAINTENANCE',
                    'readOnly': false,
                    'type': 'LONG',
                    'defaultValue': null,
                    'description': 'Normally this counter',
                    'isMultiEdit': true,
                    'validateOnStart': true,
                    onChangeCallback: sinon.stub(),
                    onInvalidCallback: sinon.stub()
                },
                {
                    'key': 'managementState',
                    'value': 'ATTRIBUTE',
                    'readOnly': false,
                    'type': 'LONG',
                    'defaultValue': null,
                    'description': 'Normally this counter',
                    'isMultiEdit': true,
                    'validateOnStart': true,
                    onChangeCallback: sinon.stub(),
                    onInvalidCallback: sinon.stub()
                }
            ].forEach(function(testData) {
                it('should return the correct sync icon for ' + testData.value, function() {
                    classUnderTest = new ReadOnly(testData);
                    sandbox.spy(classUnderTest, 'onViewReady');
                    classUnderTest.onViewReady();
                    expect(classUnderTest.onViewReady.callCount).to.equal(1);
                });
            });
        });
    });
});
