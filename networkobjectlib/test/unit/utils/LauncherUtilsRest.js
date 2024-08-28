define([
    'jscore/ext/net',
    'networkobjectlib/utils/LauncherUtilsRest',
], function(net, LauncherUtilsRest) {

    describe('utils/LauncherUtilsRest', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('checkCollectionHasNodes', function() {
            it('should return successful promise for the /object-configuration/collections/v4/contain-node api', function(done) {
                var data = {objects: true};
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                LauncherUtilsRest.checkCollectionHasNodes(['1000'])
                    .then(function(response) {
                        expect(response).to.eql(data);
                        done();
                    });
            });

            it('should return failure promise for the /object-configuration/collections/v4/contain-node api', function(done) {
                var data = {
                    code: -999,
                    title: 'Unable to Retrieve Data',
                    message: 'The server encountered an internal error. Please try again later.',
                    body: 'The server encountered an internal error. Please try again later.',
                };
                sandbox.stub(net, 'ajax').yieldsTo('error');

                LauncherUtilsRest.checkCollectionHasNodes(['1000'])
                    .catch(function(error) {
                        expect(error.code).to.equal(data.code);
                        expect(error.title).to.equal(data.title);
                        expect(error.message).to.equal(data.message);
                        expect(error.body).to.equal(data.body);
                        done();
                    });
            });
        });
    });
});
