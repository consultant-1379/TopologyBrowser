define([
    'topologybrowser/TopologyBrowserView',
    'jscore/core'
], function(TopologyBrowserView) {

    describe('TopologyBrowserView', function() {

        describe('getTopologyTreeContainer()', function() {
            //variables
            var sandbox, topologyBrowserViewProto;

            beforeEach(function() {
                //Setup to prepare fake stuffs
                sandbox = sinon.sandbox.create();
                topologyBrowserViewProto = new TopologyBrowserView();
                sandbox.stub(topologyBrowserViewProto,'getElementFromCSSClassName');
            });

            afterEach(function() {
                sandbox.restore();
            });

            it('Should call getElementFromCSSClassName ',function() {
                //check  before test
                expect(topologyBrowserViewProto.getElementFromCSSClassName.callCount).to.equal(0);
                //test execution
                topologyBrowserViewProto.getTopologyTreeContainer();
                //Assertion
                expect(topologyBrowserViewProto.getElementFromCSSClassName.callCount).to.equal(1);
            });
        });

        describe('getNavigation()', function() {
            //variables
            var sandbox, topologyBrowserViewProto;

            beforeEach(function() {
                //Setup to prepare fake stuffs
                sandbox = sinon.sandbox.create();
                topologyBrowserViewProto = new TopologyBrowserView();
                sandbox.stub(topologyBrowserViewProto,'getElementFromCSSClassName');
            });

            afterEach(function() {
                sandbox.restore();
            });

            it('Should call getElementFromCSSClassName ',function() {
                //check  before test
                expect(topologyBrowserViewProto.getElementFromCSSClassName.callCount).to.equal(0);
                //test execution
                topologyBrowserViewProto.getNavigation();
                //Assertion
                expect(topologyBrowserViewProto.getElementFromCSSClassName.callCount).to.equal(1);
            });
        });

        describe('getBreadCrumb()', function() {
            //variables
            var sandbox, topologyBrowserViewProto;

            beforeEach(function() {
                //Setup to prepare fake stuffs
                sandbox = sinon.sandbox.create();
                topologyBrowserViewProto = new TopologyBrowserView();
                sandbox.stub(topologyBrowserViewProto, 'getElementFromCSSClassName');
            });

            afterEach(function() {
                sandbox.restore();
            });

            it('Should call getElementFromCSSClassName ',function() {
                //check  before test
                expect(topologyBrowserViewProto.getElementFromCSSClassName.callCount).to.equal(0);
                //test execution
                topologyBrowserViewProto.getBreadCrumb();
                //Assertion
                expect(topologyBrowserViewProto.getElementFromCSSClassName.callCount).to.equal(1);
            });
        });
    });
});
