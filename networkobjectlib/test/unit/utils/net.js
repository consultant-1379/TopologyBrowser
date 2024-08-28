define([
    'jscore/ext/net',
    'networkobjectlib/utils/net',
], function(jscoreNet, net) {

    describe('utils/net', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('ajax', function() {
            // test being skipped because uisdk is adding a Promise polyfill
            it.skip('should return promise', function() {
                sandbox.stub(jscoreNet, 'ajax').yieldsTo('success', {team: 'RopStars'});
                expect(net.ajax()).to.be.instanceOf(Promise);
            });

            it('should return successful promise', function(done) {
                var data = {team: 'RopStars'};
                sandbox.stub(jscoreNet, 'ajax').yieldsTo('success', data);

                net.ajax().then(function(response) {
                    expect(response.data).to.eql(data);
                    done();
                }).catch(function(e) {
                    done(new Error(e));
                });
            });

            it('should return failure promise', function(done) {
                sandbox.stub(jscoreNet, 'ajax').yieldsTo('error');
                net.ajax().then(function() {
                    done(new Error());
                }).catch(function(response) {
                    expect(response.data).to.eql({errorCode: -1});
                    done();
                }).catch(function(e) {
                    done(new Error(e));
                });
            });
        });
    });
});
