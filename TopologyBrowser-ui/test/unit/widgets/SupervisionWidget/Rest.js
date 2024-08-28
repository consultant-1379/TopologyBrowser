define([
    'topologybrowser/widgets/Supervision/Rest',
    'jscore/ext/net'
], function(Rest, net) {
    'use strict';

    describe('Supervision Rest', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
        });

        afterEach(function() {
            //CLEANUP
            sandbox.restore();

        });

        describe('deleteNotifyData', function() {
            it('Should resolve with data on successful deletion', function() {
                // Setup
                var responseData = { status: 'success' };
                sandbox.stub(net, 'ajax').yieldsTo('success', responseData);
              
                // Act
                var promise = Rest.deleteNotifyData({ data: {} });

                // Assert
                promise.then(function(data) {
                    expect(data).to.deep.equal(responseData);
                    expect(net.ajax.callCount).to.equal(1);
                    expect(net.ajax.getCall(0).calledWithMatch({
                        url: '/network-visualization/v1/network-elements/clear-current-notifications',
                        type: 'POST',
                        dataType: 'application/json'
                    })).to.equal(true);
                });
            });

            it('Should reject with error object on deletion error', function(done) {
                // Setup
                var data = {
                    code: -999,
                    title: 'Unable to Retrieve Data',
                    body: 'The server encountered an internal error. Please try again later.'
                };
                sandbox.stub(net, 'ajax').yieldsTo('error');
              
                // Act
                var promise = Rest.deleteNotifyData({ data: {} });

                // Assert
                promise.catch(function(error) {
                    expect(net.ajax.callCount).to.equal(1);
                    expect(error.code).to.deep.equal(data.code);
                    expect(error.title).to.deep.equal(data.title);
                    expect(error.body).to.deep.equal(data.body);
                    done();
                });
            });
        });

        describe('getPOBySearchStringCustomTopology', function() {
            it('should resolve data', function(done) {
                // Setup
                var data = {
                    objects: [{
                        poid: 1234,
                        nodeName: 'NR01',
                        path: [4000]
                    }]
                };
                sandbox.stub(net, 'ajax').yieldsTo('success', data);

                // Act
                var promise = Rest.getPOByQueryStringCustomTopology('4000', 'NR01');

                // Assert
                promise.then(function(response) {
                    expect(net.ajax.callCount).to.equal(1);
                    expect(response).to.deep.equal(data.objects);
                    done();
                });
            });

            it('should reject data', function(done) {
                // Setup
                var data = {
                    code: -999,
                    title: 'Unable to Retrieve Data',
                    body: 'The server encountered an internal error. Please try again later.'
                };
                sandbox.stub(net, 'ajax').yieldsTo('error');

                // Act
                var promise = Rest.getPOByQueryStringCustomTopology('4000', 'NR01');

                // Assert
                promise.catch(function(error) {
                    expect(net.ajax.callCount).to.equal(1);
                    expect(error.code).to.deep.equal(data.code);
                    expect(error.title).to.deep.equal(data.title);
                    expect(error.body).to.deep.equal(data.body);
                    done();
                });
            });

        });
    });
});
