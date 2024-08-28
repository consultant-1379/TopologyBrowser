define([
    'topologybrowser/utils/Rest',
    'jscore/ext/net',
], function(Rest, net) {
    'use strict';

    describe('Rest', function() {
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

        describe('fetchNotifications()', function() {
            it('should fetch the notification for the provided user', function() {
                // Setup
                var mockData = {data: ''};
                sandbox.stub(net, 'ajax').yieldsTo('success', JSON.stringify(mockData));
                var user = 'test';

                // Act
                Rest.fetchNotifications(user)
                .then(function(data) {
                    // Expect
                    expect(data).to.deep.equal(mockData);
                });

                // Assert
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/network-visualization/v1/network-elements/get-current-notifications/' + user,
                    type: 'GET',
                    dataType: 'application/json'
                })).to.equal(true);
            });

            it('should resolve an empty object if no data fetched', function() {
                // Setup
                sandbox.stub(net, 'ajax').yieldsTo('success', undefined);
                var user = 'test';

                // Act
                Rest.fetchNotifications(user)
                    .then(function(data) {
                        // Expect
                        expect(data).to.deep.equal({});
                    });

                // Assert
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/network-visualization/v1/network-elements/get-current-notifications/' + user,
                    type: 'GET',
                    dataType: 'application/json'
                })).to.equal(true);
            });

            it('should reject the call if an error occurs', function(done) {
                // Setup
                var mockError = {error: ''};
                sandbox.stub(net, 'ajax').yieldsTo('error', mockError);
                var user = 'test';

                // Act
                Rest.fetchNotifications(user)
                .catch(function(error) {
                    // Assert
                    expect(error).to.deep.equal({msg: mockError, xhr: undefined});
                    done();
                });

                // Assert
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/network-visualization/v1/network-elements/get-current-notifications/' + user,
                    type: 'GET',
                    dataType: 'application/json'
                })).to.equal(true);
            });
        });
    });
});
