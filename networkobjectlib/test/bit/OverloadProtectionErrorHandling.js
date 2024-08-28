/* global bitbox */
define([
    'jscore/core',
    'test/resources/BitUtils',
    'test/resources/PersistentObjectRestMock',
    'i18n!networkobjectlib/dictionary.json',
    'networkobjectlib/regions/topologyTree/TopologyTree',
    'networkobjectlib/regions/topologyFDN/TopologyFDN',
    'networkobjectlib/regions/moTypeDetails/MoTypeDetails'
], function(core, BitUtils, PersistentObjectRestMock, i18n, TopologyTree, TopologyFDN, MoTypeDetails) {

    describe('Overload Protection Error Handling', function() {
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
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });

        function createTopologyTree() {
            // create TopologyTree region
            classUnderTest = new TopologyTree({
                context: app.getContext(),
                multiselect: true
            });
            classUnderTest.start(content);
        }

        function createTopologyFDN() {
            // create TopologyFDN region
            classUnderTest = new TopologyFDN({
                context: app.getContext(),
                multiselect: true
            });
            classUnderTest.start(content);
        }

        function createMoTypeDetails() {
            // create MoTypeDetails region
            classUnderTest = new MoTypeDetails({
                context: app.getContext()
            });
            classUnderTest.start(content);
        }

        var unableToRetrieveDataTitle = 'Unable to Retrieve Data';
        var unableToLocateObjectTitle = 'Unable to Locate Object';
        var noCapacityAvailableMessageBody = 'There is currently no capacity to process the request due to a large amount of activity on the server. Please try again later.';
        var errorCode = 10106;

        describe('Should display correct error when: ', function() {
            it('No capacity available when loading topology tree.', function(done) {
                createTopologyTree();

                PersistentObjectRestMock.respondSubNetworks(sandbox.server, 429, {
                    title: unableToRetrieveDataTitle,
                    body: noCapacityAvailableMessageBody,
                    errorCode: errorCode
                });
                PersistentObjectRestMock.respondAllOtherNodes(sandbox.server, 429,{
                    title: unableToRetrieveDataTitle,
                    body: noCapacityAvailableMessageBody,
                    errorCode: errorCode
                });

                BitUtils.runTestSteps([
                    function() {
                        classUnderTest.load();
                    },
                    BitUtils.skipFrames,
                    function() {
                        var DOMAllItems = document.querySelectorAll('.elNetworkObjectLib-rTopologyTree-messageArea');
                        expect(DOMAllItems[0].querySelector('.ebInlineMessage-header').textContent).to.equal(unableToRetrieveDataTitle);
                        expect(DOMAllItems[0].querySelector('.ebInlineMessage-description').textContent).to.equal(noCapacityAvailableMessageBody);
                    }
                ], done);
            });

            it('No capacity available when loading topology subtree.', function(done) {
                createTopologyTree();
                var id = '123';

                sandbox.stub(classUnderTest.memory, 'hasChildren').returns(true);
                sandbox.stub(classUnderTest.memory, 'getChildren').returns([{}]);
                PersistentObjectRestMock.respondSubtree(sandbox.server, 429, {
                    title: unableToRetrieveDataTitle,
                    body: noCapacityAvailableMessageBody,
                    errorCode: errorCode
                }, id);

                BitUtils.runTestSteps([
                    function() {
                        classUnderTest.load(id);
                    },
                    BitUtils.skipFrames,
                    function() {
                        expect(document.querySelectorAll('.ebDialogBox-primaryText')[0].textContent).to.equal(unableToRetrieveDataTitle);
                        expect(document.querySelectorAll('.ebDialogBox-secondaryText')[0].textContent).to.equal(noCapacityAvailableMessageBody);
                    }
                ], done);
            });

            it('No capacity available when getting by FDN.', function(done) {
                createTopologyFDN();
                var fdn = 'x=y';
                PersistentObjectRestMock.respondFDN(sandbox.server, 429, {
                    title: unableToLocateObjectTitle,
                    body: noCapacityAvailableMessageBody,
                    errorCode: errorCode
                }, fdn);

                BitUtils.runTestSteps([
                    function() {
                        classUnderTest.pathWidget.trigger('FDNTokenClicked', {fdn: fdn});
                    },
                    BitUtils.skipFrames,
                    function() {
                        expect(document.querySelectorAll('.ebDialogBox-primaryText')[0].textContent).to.equal(unableToLocateObjectTitle);
                        expect(document.querySelectorAll('.ebDialogBox-secondaryText')[0].textContent).to.equal(noCapacityAvailableMessageBody);
                    }
                ], done);
            });

            it('No capacity available when updating by MoType attributes', function(done) {
                createMoTypeDetails();
                var id = 123;
                PersistentObjectRestMock.respondSaveAttributes(sandbox.server, 429, {
                    title: unableToRetrieveDataTitle,
                    body: noCapacityAvailableMessageBody,
                    errorCode: errorCode
                }, id);

                BitUtils.runTestSteps([
                    function() {
                        classUnderTest.putRequest({poId: id});
                    },
                    BitUtils.skipFrames,
                    function() {
                        expect(document.querySelectorAll('.ebDialogBox-primaryText')[0].textContent).to.equal(unableToRetrieveDataTitle);
                        expect(document.querySelectorAll('.ebDialogBox-secondaryText')[0].textContent).to.equal(noCapacityAvailableMessageBody);
                    }
                ], done);
            });
        });
    });
});
