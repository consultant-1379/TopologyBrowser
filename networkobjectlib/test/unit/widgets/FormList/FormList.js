define([
    'jscore/core',
    'networkobjectlib/widgets/FormList/FormList'
], function(core, FormList) {

    describe('FormList', function() {
        var sandbox, classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            classUnderTest = new FormList();
            classUnderTest.view = sinon.createStubInstance(core.View);
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('compareValues', function() {
            it('Return equal for Equal Boolean Values', function() {
                expect(classUnderTest.compareValues(true, true)).to.equal(true);
                expect(classUnderTest.compareValues(false, false)).to.equal(true);
                expect(classUnderTest.compareValues('true', true)).to.equal(true);
                expect(classUnderTest.compareValues('false', false)).to.equal(true);
                expect(classUnderTest.compareValues(true, false)).to.equal(false);
                expect(classUnderTest.compareValues(true, 'false')).to.equal(false);
            });

            //Handles sequence case
            it('Return equal for Equal Array Values', function() {
                expect(classUnderTest.compareValues([1,2,3], [1,2,3])).to.equal(true);
                expect(classUnderTest.compareValues([1,2,3], [1,2,4])).to.equal(false);
                expect(classUnderTest.compareValues([1,2,3], [1,2])).to.equal(false);
                expect(classUnderTest.compareValues([1,2,3], [1,2, 3, 4])).to.equal(false);
                expect(classUnderTest.compareValues([5, 6, 7], [1,2, 3, 4])).to.equal(false);
                expect(classUnderTest.compareValues([5, 6, 7], '567')).to.equal(false);
            });

            //Handles sequence case
            it('Return equal for Equal Array of Key Value Pairs\' Values', function() {
                expect(classUnderTest.compareValues([{'key': 'a', value: 1}, {'key': 'b', value: 2}], [{'key': 'a', value: 1}, {key: 'b', value: 2}])).to.equal(true);
                expect(classUnderTest.compareValues([{'key': 'a', value: 1}, {'key': 'b', value: 2}], [1,2])).to.equal(false);
                expect(classUnderTest.compareValues([{'key': 'a', value: 1}, {'key': 'b', value: 2}], ['a', 'b'])).to.equal(false);
                expect(classUnderTest.compareValues([{'key': 'a', value: 1}, {'key': 'b', value: 2}], [{'key': 'a', value: 1}, {key: 'b', value: 2},  {'key': 'c', value: 3}])).to.equal(false);
                expect(classUnderTest.compareValues([{'key': 'a', value: 1}, {'key': 'b', value: 2},  {'key': 'c', value: 3}], [{'key': 'a', value: 1}, {key: 'b', value: 2}])).to.equal(false);
            });
        });
    });
});
