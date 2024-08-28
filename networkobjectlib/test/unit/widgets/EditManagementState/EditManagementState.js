define([
    'jscore/core',
    'networkobjectlib/widgets/EditManagementState/EditManagementState'
], function(core, EditManagementState) {
    'use strict';

    describe('widgets/EditManagementState', function() {
        var sandbox,
            objectUnderTest;

        before(function() {
            sandbox = sinon.sandbox.create();
            objectUnderTest = new EditManagementState({
                data: []
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getRadioSelection()', function() {
            it('Normal should not be selected by default', function() {
                expect(objectUnderTest.getRadioSelection()).to.not.equal('NORMAL');
                expect(objectUnderTest.view.isNormalChecked()).to.equal(false);
            });

            it('In Maintenance should not be selected by default', function() {
                expect(objectUnderTest.getRadioSelection()).to.not.equal('MAINTENANCE');
                expect(objectUnderTest.view.isMaintenanceChecked()).to.equal(false);
            });

            it('Return Normal if isNormalChecked', function() {
                sandbox.stub(objectUnderTest.view, 'isNormalChecked', function() {
                    return true;
                });
                expect(objectUnderTest.getRadioSelection()).to.be.equal('NORMAL');
            });

            it('Return Maintenance if isMaintenanceChecked', function() {
                sandbox.stub(objectUnderTest.view, 'isMaintenanceChecked', function() {
                    return true;
                });
                objectUnderTest.view.enableEditStateReviewChangeButton();
                expect(objectUnderTest.getRadioSelection()).to.be.equal('MAINTENANCE');
            });
        });
    });
});
