/* global bitbox */
define([
    'jscore/core',
    'test/resources/BitUtils',
    'networkobjectlib/TopologyVisualisation',
], function(core, BitUtils, TopologyVisualisation) {
    'use strict';

    describe('Topology Visualisation', function() {
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
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);

            // create region
            classUnderTest = new TopologyVisualisation({
                context: app.getContext(),
                showFDN: true
            });
            classUnderTest.start(content);
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });


        it('Should change tree when change fdn', function(done) {
            var MockObjects = [
                {
                    id: '1',
                    parent: null,
                    type: 'MeContext',
                    label: 'Parent',
                    children: 1
                },
                {
                    id: '2',
                    parent: '1',
                    type: 'MeContext',
                    label: 'Child',
                    children: 1
                },
                {
                    id: '3',
                    parent: '2',
                    type: 'MeContext',
                    label: 'Grandchild',
                    children: 0
                }
            ];
            classUnderTest.topologyTree.memory.addObject(MockObjects[0].id, MockObjects[0], MockObjects[0].parent);
            classUnderTest.topologyTree.memory.addObject(MockObjects[1].id, MockObjects[1], MockObjects[1].parent);
            classUnderTest.topologyTree.memory.addObject(MockObjects[2].id, MockObjects[2], MockObjects[2].parent);

            var fdn2 = 'MeContext=Parent,MeContext=Child';
            var fdn3 = 'MeContext=Parent,MeContext=Child,MeContext=Grandchild';
            sandbox.server.respondWith('GET', '/persistentObject/fdn/' + fdn2, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                'name': 'Child',
                'type': 'MeContext',
                'poId': 2,
                'id': '2',
                'fdn': 'MeContext=Parent,MeContext=Child',
                'namespace': 'OSS_TOP',
                'namespaceVersion': '3.0.0'
            })]);
            sandbox.server.respondWith('GET', '/persistentObject/fdn/' + fdn3, [200, {'Content-Type': 'application/json'}, JSON.stringify({
                'name': 'Child',
                'type': 'MeContext',
                'poId': 3,
                'id': '3',
                'fdn': 'MeContext=Parent,MeContext=Child,MeContext=Grandchild',
                'namespace': 'OSS_TOP',
                'namespaceVersion': '3.0.0'
            })]);

            classUnderTest.topologyTree.changeView('tree', 1);

            BitUtils.runTestSteps([
                function() {
                    app.getEventBus().publish('topologyTree:load', '3');
                },
                BitUtils.skipFrames,
                function() {
                    var DOMSelected = document.querySelectorAll('.elDataviz-Item_selected');
                    expect(DOMSelected[0].querySelector('.elNetworkObjectLib-NodeItem-label').textContent).to.equal('Grandchild');
                    expect(DOMSelected[0].querySelector('.elNetworkObjectLib-NodeItem-type').textContent).to.equal('MeContext');
                    classUnderTest.topologyFDN.pathWidget.setText(fdn2);
                    classUnderTest.topologyFDN.pathWidget.trigger('FDNTokenClicked', {fdn: fdn2});
                },
                BitUtils.skipFrames,
                function() {
                    var DOMSelected = document.querySelectorAll('.elDataviz-Item_selected');
                    expect(DOMSelected[0].querySelector('.elNetworkObjectLib-NodeItem-label').textContent).to.equal('Child');
                    expect(DOMSelected[0].querySelector('.elNetworkObjectLib-NodeItem-type').textContent).to.equal('MeContext');
                }
            ], done);
        });
    });
});
