define([
    'jscore/core',
    'networkobjectlib/AttributesRegion',
    'networkobjectlib/regions/attributes-region/AttributesRegionView',
    'networkobjectlib/regions/moTypeDetails/MoTypeDetailsWidget',
    'networkobjectlib/regions/nodeDetails/NodeDetailsWidget',
    'networkobjectlib/regions/moTypeDetails/Rest',
    'i18n!networkobjectlib/dictionary.json',
    'widgets/Loader'
], function(core,
            AttributesRegion,
            AttributesRegionView,
            MoTypeDetailsRegion,
            nodeDetailsRegion,
            Rest,
            i18n,
            Loader) {

    describe('AttributesRegion', function() {
        var sandbox,
            attributesRegionUnderTest,
            eventBusStub,
            mockContext ;


        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            attributesRegionUnderTest = new AttributesRegion();
            mockContext = new core.AppContext();
            sandbox.stub(attributesRegionUnderTest, 'getContext', function() {
                return mockContext;
            });
            eventBusStub = {
                subscribe: function() {},
                publish: function() {}
            };
            mockContext.eventBus = eventBusStub;
            sandbox.spy(eventBusStub, 'subscribe');
            sandbox.spy(eventBusStub, 'publish');

            sandbox.stub(attributesRegionUnderTest, 'getEventBus', function() {
                return eventBusStub;
            });
            attributesRegionUnderTest.view = sinon.createStubInstance(AttributesRegionView);
            attributesRegionUnderTest.loader = sinon.createStubInstance(Loader);
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();
        });

        describe('onStart', function() {
            it('Should subscribe the event on start', function() {
                expect(attributesRegionUnderTest.getEventBus().subscribe.callCount).to.equal(0);

                attributesRegionUnderTest.onStart();

                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:load')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:clear')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:show:message')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:fetch:persistent:error')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:fetch:persistent:success')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:fetch:model:success')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('attributesRegion:fetch:model:error')).to.equal(true);
                expect(attributesRegionUnderTest.getEventBus().subscribe.calledWith('topologyTree:fetch:root:error')).to.equal(true);
            });

        });

        describe('onViewReady', function() {
            it('Should prepare the view for Tab widget', function() {
                attributesRegionUnderTest.onViewReady();

                expect(attributesRegionUnderTest.view.getTabs.callCount).to.equal(1);
            });
        });

        describe('load', function() {
            it('Should load the widget', function() {
                var poid = '1234';
                sandbox.stub(attributesRegionUnderTest.moTypeDetailsRegion, 'requestMoAttributes');

                expect(attributesRegionUnderTest.moTypeDetailsRegion.requestMoAttributes.callCount).to.equal(0);
                expect(attributesRegionUnderTest.moTypeDetailsRegion.requestMoAttributes.calledWith(poid)).to.equal(false);

                attributesRegionUnderTest.load(poid);

                expect(attributesRegionUnderTest.moTypeDetailsRegion.requestMoAttributes.callCount).to.equal(1);
                expect(attributesRegionUnderTest.moTypeDetailsRegion.requestMoAttributes.calledWith(poid)).to.equal(true);
            });
        });


        describe('clear', function() {
            it('Should execute clearAttributePanel', function() {
                sandbox.stub(Rest, 'cancelRequestsByTypes');
                sandbox.stub(attributesRegionUnderTest, 'clearAttributesPanel');

                attributesRegionUnderTest.clear();

                expect(Rest.cancelRequestsByTypes.calledWith(['getAttributes', 'getModelInfo'])).to.equal(true);
                expect(attributesRegionUnderTest.clearAttributesPanel.calledOnce).to.equal(true);
            });
        });
        describe('showMessage', function() {
            it('Should show the error message', function() {
                var response = {
                    title: 'Test',
                    message: 'Test Error Message'
                };
                sandbox.spy(attributesRegionUnderTest.moTypeDetailsRegion, 'showMessage');

                expect(attributesRegionUnderTest.moTypeDetailsRegion.showMessage.callCount).to.equal(0);
                expect(attributesRegionUnderTest.moTypeDetailsRegion.showMessage.calledWith(response)).to.equal(false);

                attributesRegionUnderTest.showMessage(response);

                expect(attributesRegionUnderTest.moTypeDetailsRegion.showMessage.callCount).to.equal(1);
                expect(attributesRegionUnderTest.moTypeDetailsRegion.showMessage.calledWith(response)).to.equal(true);
            });
        });

        describe('clearAttributesPanel', function() {
            it('Should clear Attributes Panel', function() {
                //ASSEMBLE
                sandbox.stub(attributesRegionUnderTest.nodeDetailsRegion, 'showError');
                sandbox.stub(attributesRegionUnderTest.moTypeDetailsRegion, 'clearAttributesPanel');

                //ACT
                attributesRegionUnderTest.clearAttributesPanel();

                //ASSERT
                expect(attributesRegionUnderTest.view.updateFDN.calledWith('')).to.equal(true);
                expect(attributesRegionUnderTest.view.updateSelectedName.calledWith('')).to.equal(true);
                expect(attributesRegionUnderTest.view.updateSelectedType.calledWith('')).to.equal(true);
                expect(attributesRegionUnderTest.view.showSelectedHolder.calledWith(false)).to.equal(true);

                expect(attributesRegionUnderTest.moTypeDetailsRegion.clearAttributesPanel.calledOnce).to.equal(true);
                expect(attributesRegionUnderTest.nodeDetailsRegion.showError.calledWith(i18n.defaultNetworkMessageTitle,
                i18n.defaultNetworkMessageText)).to.equal(true);
            });
        });

        describe('hideLoader', function() {
            it('Should hide the loader', function() {
                attributesRegionUnderTest.hideLoader();

                expect(attributesRegionUnderTest.loader.destroy.calledOnce).to.equal(true);
            });
        });
    });
});
