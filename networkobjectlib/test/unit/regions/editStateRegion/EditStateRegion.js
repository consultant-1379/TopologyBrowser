define([
    'jscore/core',
    'networkobjectlib/EditStateRegion',
    'networkobjectlib/regions/editStateRegion/EditStateRegionView'
], function(core, EditStateRegion, EditStateRegionView) {

    describe('EditStateRegion', function() {

        var sandbox, editStateRegionUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            editStateRegionUnderTest = new EditStateRegion({
                data: [1,2]
            });

            editStateRegionUnderTest.view = sandbox.stub(new EditStateRegionView);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onViewReady', function() {
            it('Creation of Management State Radios are called', function() {
                sandbox.stub(editStateRegionUnderTest, 'includeManagementStateRadio');
                editStateRegionUnderTest.onViewReady();
                expect(editStateRegionUnderTest.includeManagementStateRadio.callCount).to.equal(1);
            });
        });

        describe('getManagementStateRadio', function() {
            it('Management State Radio selection should be called', function() {
                sandbox.stub(editStateRegionUnderTest.editManagementState, 'getRadioSelection');
                editStateRegionUnderTest.getManagementStateRadio();
                expect(editStateRegionUnderTest.editManagementState.getRadioSelection.callCount).to.equal(1);

            });
        });

        describe('includeManagementStateRadio', function() {
            it('Management State Radio selection should be called', function() {
                editStateRegionUnderTest.includeManagementStateRadio();
                expect(editStateRegionUnderTest.view.getDetailsHolder.callCount).to.equal(1);
            });
        });
    });
});
