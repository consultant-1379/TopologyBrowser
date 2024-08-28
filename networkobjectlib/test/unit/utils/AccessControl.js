define([
    'networkobjectlib/utils/AccessControl',
    'networkobjectlib/utils/net',
], function(AccessControl, net) {

    describe('utils/AccessControl', function() {
        var sandbox, classUnderTest;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            sandbox.stub(net, 'ajax', function() {
                return Promise.resolve({
                    data:
                    {
                        resource: 'persistentobjectservice',
                        actions: ['read', 'write']
                    }

                });
            });
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getResources', function() {
            // test being skipped because uisdk is adding a Promise polyfill
            it.skip('should return promise', function() {
                classUnderTest = new AccessControl();
                expect(classUnderTest.getResources()).to.be.instanceOf(Promise);
            });
        });

        describe('isAllowed', function() {
            beforeEach(function() {
                classUnderTest = new AccessControl();
            });

            it('should return true for allowed resources/actions', function(done) {
                classUnderTest.getResources().then(function() {
                    expect(classUnderTest.isAllowed(['persistentobjectservice', 'read'])).to.be.true;
                    expect(classUnderTest.isAllowed(
                        ['persistentobjectservice', 'read'],
                        ['persistentobjectservice', 'write']
                    )).to.be.true;
                    done();
                }).catch(function(e) {
                    done(new Error(e));
                });
            });

            it('should return false for disallowed resources/actions', function(done) {
                classUnderTest.getResources().then(function() {
                    expect(classUnderTest.isAllowed()).to.be.false;
                    expect(classUnderTest.isAllowed([])).to.be.false;
                    expect(classUnderTest.isAllowed(['persistentobjectservice', 'delete'])).to.be.false;
                    expect(classUnderTest.isAllowed(
                        ['persistentobjectservice', 'read'],
                        ['topologySearchService', 'write']
                    )).to.be.false;
                    done();
                }).catch(function(e) {
                    done(new Error(e));
                });
            });

            it('should throw exception if resources were not fetched yet', function() {
                classUnderTest = new AccessControl();
                expect(classUnderTest.isAllowed.bind(classUnderTest)).to.throw();
            });
        });
    });
});
