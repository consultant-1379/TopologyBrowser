define([
    'jscore/core',
    'actionlibrary/ActionLibrary',
    'topologybrowser/actions/LocateInTopology',
    'i18n!topologybrowser/actions.json'
], function(core, ActionLibrary, LocateInTopology, _strings) {
    describe('LocateInTopology', function() {
        var sandbox, objectUnderTest, callbackObject;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });
        afterEach(function() {
            sandbox.restore();
        });
        describe('run()', function() {
            beforeEach(function() {
                // ARRANGE
                callbackObject = {
                    onReady: sandbox.stub(),
                    onFail: sandbox.stub(),
                    onComplete: sandbox.stub()
                };
                objectUnderTest = new LocateInTopology();
            });
            describe('always honors the Action contract, even when', function() {
                [undefined,null,0,false,'',{},[]].forEach(function(data) {
                    describe('data = ' + JSON.stringify(data), function() {
                        it('by returning an ActionLifeCycle object and calling onReady to signify the action is initialized', function(done) {
                            // ARRANGE
                            var readyNotification;
                            callbackObject.onReady = function(object) {
                                if (object) {
                                    readyNotification = object;
                                }
                            };
                            sandbox.stub(core.Window, 'open', function() {
                                expect(readyNotification.message).to.equal(_strings.launchingApp);
                                done();
                            });
                            // ACT
                            var lifecycle = objectUnderTest.run(callbackObject, data);
                            // ASSERT
                            expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                        });
                    });
                });
            });
            describe('calls onComplete and opens view with parameter poid = 1 when', function() {
                [[{id: 1}],[{poid: 1}],[{poId: 1}]].forEach(function(data) {
                    it('data = ' + JSON.stringify(data), function(done) {
                        // ARRANGE
                        callbackObject.onComplete = function(result) {
                            // ASSERT
                            expect(result).to.be.an.instanceof(ActionLibrary.ActionResult);
                            expect(result.success).to.equal(true);
                        };
                        sandbox.stub(core.Window, 'open', function(href) {
                            expect(href).to.equal('#topologybrowser?poid=1');
                            done();
                        });
                        // ACT
                        var lifecycle = objectUnderTest.run(callbackObject, data);
                        // ASSERT
                        expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                    });
                });
            });
            describe('calls onComplete and opens default view when', function() {
                [undefined,null,0,false,'',{},[]].forEach(function(data) {
                    it('data = ' + JSON.stringify(data), function(done) {
                        // ARRANGE
                        callbackObject.onComplete = function(result) {
                            // ASSERT
                            expect(result).to.be.an.instanceof(ActionLibrary.ActionResult);
                            expect(result.success).to.equal(true);
                        };
                        sandbox.stub(core.Window, 'open', function(href) {
                            expect(href).to.equal('#topologybrowser');
                            done();
                        });
                        // ACT
                        var lifecycle = objectUnderTest.run(callbackObject, data);
                        // ASSERT
                        expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                    });
                });
            });
            describe('success is false and should call onFail, giving an error', function() {
                [undefined,null,0,false,'',{},[]].forEach(function(data) {
                    it('data = ' + JSON.stringify(data), function(done) {
                        // ARRANGE
                        callbackObject.onComplete = function(result) {
                            // ASSERT
                            expect(result).to.be.an.instanceof(ActionLibrary.ActionResult);
                            expect(result.success).to.equal(false);
                        };
                        sandbox.stub(core.Window, 'open', function(href) {
                            expect(href).to.equal('#topologybrowser');
                            done();
                        });
                        // ACT
                        var lifecycle = objectUnderTest.run(callbackObject, data);
                        // ASSERT
                        expect(lifecycle).to.be.an.instanceof(ActionLibrary.ActionLifecycle);
                    });
                });
            });
        });
    });
});
