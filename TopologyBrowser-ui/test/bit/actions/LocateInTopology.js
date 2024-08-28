/* global bitbox */
define([
    'jscore/core',
    'actionlibrary/ActionLibrary',
    'layouts/TopSection',
    'topologybrowser/actions/LocateInTopology',
    'container/api'
], function(core, ActionLibrary, TopSection, LocateInTopology, Container) {

    describe('LocateInTopology.js', function() {

        var currentApp, sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.stub(Container, 'loadAppModule', function(path, callback) {
                callback(LocateInTopology);
            });
            // app with top section to mimic Network Explorer's action bar
            var AppWithTopSection = core.App.extend({
                View: core.View.extend({
                    getTemplate: function() {
                        return '<div></div>';
                    }
                }),
                onStart: function() {
                    this.topsection = new TopSection({
                        context: this.getContext(),
                        title: 'Contextual Actions Test'
                    });
                    this.topsection.attachTo(this.getElement());
                }
            });
            currentApp = new AppWithTopSection();
            currentApp.start(core.Element.wrap(bitbox.getBody()));
        });

        afterEach(function() {
            currentApp.stop();
            sandbox.restore();
        });

        describe('When an object is in context', function() {
            it('should provide remote action to \'Locate In Topology\' and open in new window', function(done) {
                sandbox.stub(core.Window, 'open');
                var locateInTopologyAction = {
                    defaultLabel: 'Locate In Topology',
                    plugin: 'topologybrowser/actions/LocateInTopology'
                };
                var objects = [{
                    moType: 'MeContext',
                    neType: 'ERBS',
                    id: '2811111111111111'
                }];
                var transformedActions = [{
                    type: 'button',
                    name: locateInTopologyAction.defaultLabel,
                    action: function() {
                        ActionLibrary.executeAction(locateInTopologyAction, objects, {
                            onComplete: function() {},
                            onFail: function() {}
                        });
                    }
                }];
                currentApp.getEventBus().publish('topsection:contextactions', transformedActions);
                var locateInTopologyActionButton = document.getElementsByClassName('ebBtn  elLayouts-ActionBarButton')[0];
                expect(locateInTopologyActionButton.textContent).to.equal(locateInTopologyAction.defaultLabel);
                locateInTopologyActionButton.click();
                requestAnimationFrame(function() {
                    setTimeout(function() {
                        expect(core.Window.open.callCount).to.equal(1);
                        expect(core.Window.open.getCall(0).calledWith('#topologybrowser?poid=2811111111111111', '_blank'))
                            .to.equal(true);
                        done();
                    }, 200);
                });
            });
        });
    });
});
