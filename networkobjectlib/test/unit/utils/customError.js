define([
    'networkobjectlib/utils/customError'
], function(customError) {

    describe('utils/customError', function() {
        var sandbox, classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            classUnderTest = customError;
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getError', function() {
            it('should return UnknownServerError', function() {
                var error = classUnderTest.getError(-1);
                expect(error).to.be.an.instanceof(customError.UnknownServerError);
            });

            it('should return NetworkObjectNotFound', function() {
                var error = classUnderTest.getError(1000);
                expect(error).to.be.an.instanceof(customError.NetworkObjectNotFound);
            });

            it('should return DatabaseUnavailable', function() {
                var error = classUnderTest.getError(10014);
                expect(error).to.be.an.instanceof(customError.DatabaseUnavailable);
            });

            it('should return AccessDenied', function() {
                var error = classUnderTest.getError(10015);
                expect(error).to.be.an.instanceof(customError.AccessDenied);
            });

            it('should return TBACPermissionDenied', function() {
                var error = classUnderTest.getError(10023);
                expect(error).to.be.an.instanceof(customError.TBACPermissionDenied);
            });

            it('should have correct properties', function() {
                var error = classUnderTest.getError(-1);
                expect(error).to.have.property('code').that.is.a('number');
                expect(error).to.have.property('title').that.is.a('string');
                expect(error).to.have.property('message').that.is.a('string');
                expect(error).to.have.property('body').that.is.a('string');
                expect(error).to.have.property('extra').that.is.an('object');
                expect(error.message).to.equal(error.body);
            });

            it('should overwrite title', function() {
                var title = 'My title';
                var error = classUnderTest.getError(-1, title);
                expect(error.title).to.equal(title);
            });

            it('should have extra information', function() {
                var extra = { id: 1 };
                var error = classUnderTest.getError(-1, null, extra);
                expect(error.title).to.exists;
                expect(error.extra).to.equal(extra);
            });
        });
    });
});
