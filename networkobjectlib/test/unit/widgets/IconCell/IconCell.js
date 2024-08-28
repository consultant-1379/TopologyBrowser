define([
    'jscore/core',
    'networkobjectlib/widgets/IconCell/IconCell',
    'networkobjectlib/widgets/IconCell/IconCellView'
], function(core, IconCell, IconCellView) {
    'use strict';

    describe('widgets/IconCell', function() {
        var sandbox,
            objectUnderTest;

        before(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('setValue()', function() {
            it('Should set caption and icon to the expected values in the widget', function() {
                objectUnderTest = new IconCell();
                objectUnderTest.view = sinon.createStubInstance(IconCellView);
                objectUnderTest.options = {
                    row: {
                        getData: function() {
                            return [];
                        }
                    },
                    column: {
                        attribute: 'result'
                    }
                };
                var expectedCaption = 'caption-test';
                var expectedIconClass = 'ebIcon_test';

                objectUnderTest.setValue({
                    'caption': expectedCaption,
                    'ebIconClass': expectedIconClass
                });

                expect(objectUnderTest.view.setCaption.calledWith(expectedCaption)).to.equal(true);
                expect(objectUnderTest.view.setIcon.calledWith(expectedIconClass)).to.equal(true);
            });
        });
    });
});
