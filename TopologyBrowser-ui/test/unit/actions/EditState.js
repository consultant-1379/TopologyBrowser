define([
    'jscore/core',
    'container/api',
    'actionlibrary/ActionLibrary',
    'jscore/ext/net',
    'widgets/Dialog',
    'topologybrowser/actions/EditState',
    'networkobjectlib/utils/ErrorHandler',
], function(core, Container, ActionLibrary, net, Dialog, EditState, ErrorHandler) {
    describe('EditState', function() {
        var sandbox, objectUnderTest, callbackObject, containerEventBus;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });
        afterEach(function() {
            sandbox.restore();
        });
        describe('run()', function() {
            beforeEach(function() {
                // ARRANGE
                containerEventBus = sinon.createStubInstance(core.EventBus);
                sandbox.stub(Container, 'getEventBus', function() { return containerEventBus; });

                callbackObject = {
                    onReady: sandbox.stub(),
                    onFail: sandbox.stub(),
                    onComplete: sandbox.stub()
                };
                objectUnderTest = new EditState();
            });
            describe('successful when', function() {
                [{
                    summary: 'singular',
                    nodes: [{id: '234'}]
                }, {
                    summary: 'multiple',
                    nodes: [{id: '234'}, {id: '456'}]
                }].forEach(function(data) {
                    it(data.summary + ' data is by returning an ActionLifeCycle object and calling onComplete to signify the action is successful', function(done) {
                        // ARRANGE
                        sandbox.stub(Dialog.prototype, 'show', function() {
                        });
                        var response;
                        sandbox.stub(net, 'ajax', function(options) {
                            response = options;
                            options.success({});
                        });

                        callbackObject.onComplete = function(result) {
                            expect(result).to.be.an.instanceof(ActionLibrary.ActionResult);
                            expect(result.success).to.equal(true);
                            expect(JSON.parse(response.data).poList).to.deep.equal(data.nodes.map(function(data) {
                                return data.id;
                            }));
                            done();
                        };
                        // ACT
                        var lifecycle = objectUnderTest.run(callbackObject, data.nodes);
                        // ASSERT
                        expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                    });
                });
            });
            describe('failure when', function() {
                it('request returns a failure by returning an ActionLifeCycle object and calling onFailure to signify the action has failed', function(done) {
                    // ARRANGE
                    sandbox.stub(Dialog.prototype, 'show', function() {
                    });
                    sandbox.stub(ErrorHandler, 'getErrorFromResponse', function() {
                        return {title: 'title', body: 'body'};
                    });
                    var response;
                    sandbox.stub(net, 'ajax', function(options) {
                        response = options;
                        options.error({}, {});
                    });

                    callbackObject.onFail = function(result) {
                        expect(result).to.be.an.instanceof(ActionLibrary.ActionResult);
                        expect(result.success).to.equal(false);
                        expect(JSON.parse(response.data).poList[0]).to.deep.equal('234');
                        done();
                    };
                    // ACT
                    var lifecycle = objectUnderTest.run(callbackObject, [{id: '234'}]);
                    // ASSERT
                    expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                });
                [{
                    summary: 'empty',
                    nodes: []
                }, {
                    summary: 'null',
                    nodes: null
                }, {
                    summary: 'undefined',
                    nodes: undefined
                }, {
                    summary: 'incorrect',
                    nodes: [{foo: 'bar'}]
                }].forEach(function(data) {
                    it('data is ' + data.summary + ' by returning an ActionLifeCycle object and calling onFailure to signify the action has failed', function(done) {
                        // ARRANGE
                        sandbox.stub(Dialog.prototype, 'show', function() {
                        });
                        sandbox.stub(ErrorHandler, 'getErrorFromResponse', function() {
                            return {title: 'title', body: 'body'};
                        });
                        sandbox.stub(net, 'ajax', function() {
                        });

                        callbackObject.onFail = function(result) {
                            expect(result).to.be.an.instanceof(ActionLibrary.ActionResult);
                            expect(result.success).to.equal(false);
                            done();
                        };
                        // ACT
                        var lifecycle = objectUnderTest.run(callbackObject, data.nodes);
                        // ASSERT
                        expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                    });

                });
            });
        });
    });
});
