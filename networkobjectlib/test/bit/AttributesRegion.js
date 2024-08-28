/* global bitbox */
define([
    'jscore/core',
    'test/resources/BitUtils',
    'test/resources/PersistentObjectRestMock',
    'test/resources/ModelServiceRestMock',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/regions/attributes-region/AttributesRegion',
    'test/resources/responses/attributes',
    'test/resources/responses/modelInfoService'
], function(core, BitUtils, PersistentObjectRestMock, ModelServiceRestMock, i18n, AttributesRegion, attributesMockResponse, modelMockResponse) {

    describe('AttributesRegion', function() {
        var sandbox, app, content, classUnderTest;

        beforeEach(function() {
            // create sandbox with fake server and auto respond to requests
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            // create app
            app = new core.App();
            app.start(core.Element.wrap(bitbox.getBody()));

            // create div to hold the region
            content = new core.Element();
            content.setStyle({height: 420});
            app.getElement().append(content);

            // create region
            classUnderTest = new AttributesRegion({
                context: app.getContext()
            });
            classUnderTest.start(content);
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });

        describe('load', function() {
            describe('node level', function() {
                it('should show sync status on node details tab when its not a subnetwork', function(done) {
                    PersistentObjectRestMock.respondAttributes(sandbox.server, 200, attributesMockResponse['1234'], attributesMockResponse['1234'].id, false);
                    ModelServiceRestMock.respondModel(sandbox.server, 200, modelMockResponse['1234'], attributesMockResponse['1234'].namespace, attributesMockResponse['1234'].type, attributesMockResponse['1234'].namespaceVersion);

                    BitUtils.runTestSteps([
                        function() {
                            classUnderTest.getEventBus().publish('attributesRegion:load', attributesMockResponse['1234'].id);
                        },
                        BitUtils.skipFrames.bind(null, 6),
                        function() {
                            var nodeDetailsTab = core.Element.wrap(document.querySelectorAll('.elNetworkObjectLib-attributesRegion-tabs .ebTabs-tabItemWrapper')[1]);
                            nodeDetailsTab.trigger('click');
                        },
                        BitUtils.skipFrames,
                        function() {
                            expect(document.querySelector('.elNetworkObjectLib-attributesRegion-tabs .elNetworkObjectLib-readOnly-value').textContent).to.equal(attributesMockResponse['1234'].networkDetails[0].value);
                        }
                    ], done);
                });
            });

            describe('subnetwork', function() {
                it('should not show tab because its a subnetwork' , function(done) {
                    PersistentObjectRestMock.respondAttributes(sandbox.server, 200, attributesMockResponse['123'], attributesMockResponse['123'].id, false);
                    ModelServiceRestMock.respondModel(sandbox.server, 200, modelMockResponse['123'], attributesMockResponse['123'].namespace, attributesMockResponse['123'].type, attributesMockResponse['123'].namespaceVersion);

                    BitUtils.runTestSteps([
                        function() {
                            classUnderTest.getEventBus().publish('attributesRegion:load', attributesMockResponse['123'].id);
                        },
                        BitUtils.skipFrames.bind(null, 6),
                        function() {
                            expect(document.querySelector('.elNetworkObjectLib-attributesRegion-tabs .ebTabs')).to.be.null;
                        }
                    ], done);
                });
            });
        });
    });
});
