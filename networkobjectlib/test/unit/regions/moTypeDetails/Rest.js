define([
    'networkobjectlib/regions/moTypeDetails/Rest',
    'test/resources/PersistentObjectRestMock',
    'test/resources/ModelServiceRestMock',
    'networkobjectlib/utils/customError'
], function(Rest, PersistentObjectRestMock, ModelServiceRestMock, customError) {

    describe('Rest', function() {
        var sandbox, classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            classUnderTest = Rest;
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getModelInfo', function() {
            var neType = 'neType';
            var neVersion = 'neVersion';
            var namespace = 'namespace';
            var type = 'type';
            var version = 'version';

            var urlData = {
                neType: neType,
                neVersion: neVersion,
                namespace: namespace,
                type: type,
                namespaceVersion: version,
                parameter: 'includeNonPersistent'
            };

            [
                {
                    description: 'throw NetworkObjectNotFound',
                    statusCode: 404,
                    body: { errorCode: 1000 },
                    expectedError: customError.NetworkObjectNotFound

                },
                {
                    description: 'throw Unauthorized Error',
                    statusCode: 401,
                    body: {},
                    expectedError: customError.Unauthorized

                },
                {
                    description: 'throw AccessDenied Error',
                    statusCode: 403,
                    body: {},
                    expectedError: customError.AccessDenied

                }
            ].forEach(function(test) {
                it('should ' + test.description, function(done) {
                    ModelServiceRestMock.respondModel(sandbox.server, test.statusCode, test.body, urlData);

                    classUnderTest.getModelInfo(neType, neVersion, namespace, type, version, true).catch(function(error) {
                        try {
                            expect(error).to.be.an.instanceof(test.expectedError);
                            done();
                        } catch (e) {
                            done(new Error(e));
                        }
                    });
                });
            });


            [
                {
                    neType: '',
                    neVersion: '',
                    namespace: namespace,
                    type: type,
                    namespaceVersion: version,
                    version: version,
                    parameter: 'includeNonPersistent',
                    expectedUrl: '/persistentObject/model/null/null/namespace/type/version/attributes?includeNonPersistent=true'
                },
                {
                    neType: null,
                    neVersion: null,
                    namespace: namespace,
                    type: type,
                    namespaceVersion: version,
                    version: version,
                    parameter: 'includeNonPersistent',
                    expectedUrl: '/persistentObject/model/null/null/namespace/type/version/attributes?includeNonPersistent=true'
                }
            ].forEach(function(param) {
                it('Should', function() {
                    classUnderTest.getModelInfo(param.neType, param.neVersion, param.namespace, param.type, param.version, true).catch(function() {
                        expect(sandbox.server.requests[0].url).to.equal(param.expectedUrl);
                    });
                });
            });
        });

        describe('getModelInfo - fall back', function() {
            var neType = 'neType';
            var neVersion = 'neVersion';
            var namespace = 'namespace';
            var type = 'type';
            var version = 'version';
            var urlData = {
                neType: neType,
                neVersion: neVersion,
                namespace: namespace,
                type: type,
                namespaceVersion: version,
                parameter: 'includeNonPersistent'
            };

            beforeEach(function() {
                sandbox.spy(classUnderTest, 'getModelInfoFromLegacyApi');
            });
            [
                {
                    description: 'should call getModelInfoFromLegacyApi when API not available',
                    restEasyCode: 'RESTEASY001185',
                    expected: true
                },
                {
                    description: 'should not call getModelInfoFromLegacyApi when API failed on different error ',
                    restEasyCode: 'aa',
                    expected: false
                }
            ].forEach(function(test) {
                it(test.description, function(done) {

                    ModelServiceRestMock.respondModel(sandbox.server, 403, { body: test.restEasyCode}, urlData);

                    classUnderTest.getModelInfo(neType, neVersion, namespace, type, version, true).catch(function() {
                        try {
                            expect(classUnderTest.getModelInfoFromLegacyApi.calledOnce).to.be.equals(test.expected);
                            done();
                        } catch (e) {
                            done(new Error(e));
                        }
                    });
                });
            });
        });

        describe('getModelInfoFromLegacyApi', function() {
            var namespace = 'namespace';
            var type = 'type';
            var version = 'version';
            var urlData = {
                namespace: namespace,
                type: type,
                namespaceVersion: version,
                parameter: 'stringifyLong'
            };

            [
                {
                    description: 'throw NetworkObjectNotFound',
                    statusCode: 404,
                    body: { errorCode: 1000 },
                    expectedError: customError.NetworkObjectNotFound

                },
                {
                    description: 'throw Unauthorized Error',
                    statusCode: 401,
                    body: {},
                    expectedError: customError.Unauthorized

                },
                {
                    description: 'throw AccessDenied Error',
                    statusCode: 403,
                    body: {},
                    expectedError: customError.AccessDenied

                }
            ].forEach(function(test) {
                it('should ' + test.description, function(done) {
                    ModelServiceRestMock.respondModel(sandbox.server, test.statusCode, test.body, urlData, true);

                    classUnderTest.getModelInfoFromLegacyApi(null, namespace, type, version).catch(function(error) {
                        try {
                            expect(error).to.be.an.instanceof(test.expectedError);
                            done();
                        } catch (e) {
                            done(new Error(e));
                        }
                    });
                });
            });
        });

        describe('getAttributes', function() {
            it('should throw DatabaseUnavailable', function(done) {
                var code = 10014;
                var poid = 123;
                PersistentObjectRestMock.respondAttributes(sandbox.server, 500, {errorCode: code}, poid, false);

                classUnderTest.getAttributes(poid, false).catch(function(error) {
                    try {
                        expect(error).to.be.an.instanceof(customError.DatabaseUnavailable);
                        done();
                    } catch (e) {
                        done(new Error(e));
                    }
                });
            });
        });

        describe('getAttributes', function() {
            it('should throw AccessDenied Error', function(done) {               
                var poid = 123;
                PersistentObjectRestMock.respondAttributes(sandbox.server, 403, {}, poid, false);

                classUnderTest.getAttributes(poid, false).catch(function(error) {
                    try {
                        expect(error).to.be.an.instanceof(customError.AccessDenied);
                        done();
                    } catch (e) {
                        done(new Error(e));
                    }
                });
            });
        });

        describe('getAttributes', function() {
            it('should throw Unauthorized Error', function(done) {               
                var poid = 123;
                PersistentObjectRestMock.respondAttributes(sandbox.server, 401, {}, poid, false);

                classUnderTest.getAttributes(poid, false).catch(function(error) {
                    try {
                        expect(error).to.be.an.instanceof(customError.Unauthorized);
                        done();
                    } catch (e) {
                        done(new Error(e));
                    }
                });
            });
        });

        describe('saveAttributes', function() {
            it('should throw AccessDenied', function(done) {
                var code = 10015;
                var poid = 123;
                var data = {};
                PersistentObjectRestMock.respondSaveAttributes(sandbox.server, 500, {errorCode: code}, poid);

                classUnderTest.saveAttributes(poid, data).catch(function(error) {
                    try {
                        expect(error).to.be.an.instanceof(customError.AccessDenied);
                        expect(error.extra.xhr).to.be.an('object');
                        done();
                    } catch (e) {
                        done(new Error(e));
                    }
                });
            });
        });
    });
});
