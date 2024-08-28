define([
    'jscore/core',
    'jscore/ext/net',
    'webpush/main',
    'topologybrowser/regions/main/Main',
    'topologybrowser/utils/Utils'
], function(core, net, WebPush, Main, Utils) {
    'use strict';

    describe('Main', function() {

        var main,
            mockContext,
            sandbox,
            eventBusStub;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            main = new Main();

            // WebPush stub
            sinon.stub(WebPush, 'subscribe').yields({collectionId: '1234', collectionName: 'public', userName: 'testuser'});

            // Mocked context
            mockContext = new core.AppContext();
            sandbox.stub(main, 'getContext', function() {
                return mockContext;
            });

            // Mocked event bus
            eventBusStub = {
                publish: function() {},
                subscribe: function() {}
            };
            mockContext.eventBus = eventBusStub;
            sandbox.spy(eventBusStub, 'publish');
            sandbox.spy(eventBusStub, 'subscribe');

            sandbox.stub(main, 'getEventBus', function() {
                return eventBusStub;
            });

            main.topologyVisualisation.options.context = mockContext;
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('onStart()',function() {
            it('should subscribe to web push channel', function() {
                // Setup
                var getCurrentUserSpy = sandbox.spy(Utils, 'getCurrentUser');

                // Run
                main.onStart();

                // Assert
                expect(WebPush.subscribe.callCount).to.eql(1);
                expect(eventBusStub.publish.callCount).to.eql(1);
                expect(getCurrentUserSpy.callCount).to.eql(1);
            });
        });
    });
});
