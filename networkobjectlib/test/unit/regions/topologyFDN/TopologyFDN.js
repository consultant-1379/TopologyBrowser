define([
    'jscore/core',
    'networkobjectlib/regions/topologyTree/Rest',
    'networkobjectlib/regions/topologyFDN/TopologyFDN',
], function(core, Rest, TopologyFDN) {
    'use strict';

    describe('regions/TopologyFDN', function() {
        var sandbox, app, content, classUnderTest;

        beforeEach(function() {
            // create sandbox with fake server and auto respond to requests
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            // create app
            app = new core.App();
            app.start(new core.Element());

            // create div to hold the region
            content = new core.Element();
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);

            // create region
            classUnderTest = new TopologyFDN({
                context: app.getContext(),
                showTopology: true
            });

            // create stub for eventbus
            var eventBusSpy = {subscribe: function() {}, publish: function() {}};
            sandbox.spy(eventBusSpy, 'subscribe');
            sandbox.spy(eventBusSpy, 'publish');
            classUnderTest.getEventBus = function() { return eventBusSpy; };
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });

        describe('init()', function() {
            it('Should initiate FDN Path', function() {
                classUnderTest.init();
                expect(classUnderTest.pathWidget).not.to.be.undefined;
            });
        });

        describe('onStart()', function() {
            it('Should initiate Topology FDN', function() {
                //ACT
                classUnderTest.start(content);

                //Assert
                expect(classUnderTest.getEventBus().subscribe.callCount).to.equal(2);
                expect(classUnderTest.getEventBus().subscribe.firstCall.args[0]).to.equal('updateFDNPath');
            });
        });

        describe('updateFDN()', function() {
            it('Should call the FDN', function() {
                //ASSEMBLE
                sandbox.spy(classUnderTest.pathWidget, 'callFDN');
                classUnderTest.start(content);

                //ACT
                classUnderTest.updateFDN();

                //Assert
                expect(classUnderTest.pathWidget.callFDN.callCount).to.equal(1);
            });
        });

        describe('onFDNChange()', function() {
            it('Should call the FDN change', function() {
                //ASSEMBLE
                classUnderTest.start(content);
                sandbox.spy(Rest, 'getByFdn');

                classUnderTest.pathWidget.text = 'MeContext=LTE02ERBS00011';
                classUnderTest.pathWidget.view.getInput().setValue('MeContext=LTE02ERBS00010');

                //ACT
                classUnderTest.updateFDN();

                //ASSERT
                expect(classUnderTest.getEventBus().publish.callCount).to.equal(1);
                expect(classUnderTest.getEventBus().publish.args[0][0]).to.equal('topologyTree:loader:show');

                expect(Rest.getByFdn.callCount).to.equal(1);
                expect(Rest.getByFdn.args[0][0]).to.equal('MeContext=LTE02ERBS00010');
            });
        });
    });
});
