define([
    'jscore/core',
    'networkobjectlib/widgets/CounterBox/CounterBox',
    'networkobjectlib/widgets/CounterBox/CounterBoxView'
], function(core, CounterBox, CounterBoxView) {
    'use strict';

    describe('widgets/CounterBox', function() {
        var sandbox,
            objectUnderTest;

        before(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('init()', function() {
            it('Should initialize the widget', function() {
                var expectedLabel = 'test-label';
                objectUnderTest = new CounterBox({
                    'label': expectedLabel
                });
                expect(objectUnderTest.view.getTitle().getText()).to.equal(expectedLabel);
            });
        });

        describe('updateCounter()', function() {
            it('Should update value in the widgets view', function() {
                objectUnderTest = new CounterBox();
                objectUnderTest.view = sinon.createStubInstance(CounterBoxView);

                var expectedValue = '456';
                objectUnderTest.updateCounter(expectedValue);

                expect(objectUnderTest.view.setValue.callCount).to.equal(1);
                expect(objectUnderTest.view.setValue.calledWith('456')).to.equal(true);
            });
        });
    });
});
