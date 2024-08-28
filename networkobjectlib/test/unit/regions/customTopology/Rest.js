define([
    'networkobjectlib/regions/customTopology/Rest',
    'networkobjectlib/utils/UserSettings',
    'networkobjectlib/utils/customError',
    'networkobjectlib/utils/net'
], function(Rest, UserSettings, customError, net) {

    describe('CustomTopology Rest', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('get children poids of leaf collection', function() {
            it('should make right ajax request with v3',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                var collectionId = '1234';
                //ACT
                Rest.getLeafCollectionChildren(collectionId);
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/collections/v3/' + collectionId,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });

            it('should make right ajax request with v4',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                var collectionId = '1234';
                //ACT
                Rest.getLeafCollectionChildrenV4(collectionId);
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/collections/v4/' + collectionId + '?includeContents=true',
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });

            it('should fall back to v2 call if v4 fails',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.reject());
                sandbox.stub(Rest, 'getLeafCollectionChildren');
                var collectionId = '1234';
                //ACT
                Rest.getLeafCollectionChildrenV4();
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax).to.be.rejected;
                return net.ajax({
                    url: '/object-configuration/collections/v4/' + collectionId,
                    type: 'GET',
                    dataType: 'json'
                }).then(function(data) {
                    //Failure
                }).catch(function(error) {
                    expect(Rest.getLeafCollectionChildren.callCount).to.equal(1);
                });
            });
        });

        describe('get custom topologies by Id', function() {
            it('should make right ajax request with v2',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                var id = '1234';
                //ACT
                Rest.getCustomTopologyById(id);
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/custom-topology/v2/' + id,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });

            it('should make right ajax request with v4',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                var id = '1234';
                //ACT
                Rest.getCustomTopologyByIdV4(id);
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/collections/v4/' + id,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });

            it('should fall back to v2 call if v4 fails',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.reject());
                sandbox.stub(Rest, 'getCustomTopologyById');
                var collectionId = '1234';
                //ACT
                Rest.getCustomTopologyByIdV4();
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax).to.be.rejected;
                return net.ajax({
                    url: '/object-configuration/collections/v4/' + collectionId,
                    type: 'GET',
                    dataType: 'json'
                }).then(function(data) {
                    //Failure
                }).catch(function(error) {
                    expect(Rest.getCustomTopologyById.callCount).to.equal(1);
                });
            });

            [
                {
                    scenario: 'reset the user settings when a topology is not found',
                    responseCode: 404,
                    saveDropdownSettingsCallCount: 1,
                    saveDropdownSettingsCalledWith: true,
                    getCustomTopologyByIdCallCount: 1,
                    getErrorCallCount: 0
                },
                {
                    scenario: 'throw custom error when an exception is caught',
                    responseCode: 418,
                    saveDropdownSettingsCallCount: 0,
                    saveDropdownSettingsCalledWith: false,
                    getCustomTopologyByIdCallCount: 0,
                    getErrorCallCount: 1
                }
            ].forEach(function(testData) {
                it('should ' + testData.scenario, function() {
                    var errorResponse = {
                        xhr: {
                            getStatus: function() { return testData.responseCode; }
                        },
                        data: {
                            internalErrorCode: 10007
                        }
                    };

                    sandbox.stub(net, 'ajax').returns(Promise.reject(errorResponse));
                    sandbox.stub(Rest, 'getCustomTopologyById');
                    sandbox.spy(UserSettings, 'saveDropdownSettings');
                    sandbox.spy(customError, 'getError');

                    Rest.getCustomTopologyByIdV4();

                    return net.ajax({
                        url: '/object-configuration/collections/v4/1234',
                        type: 'GET',
                        dataType: 'json'
                    }).then(function() {
                        // Failure
                    }).catch(function() {
                        expect(UserSettings.saveDropdownSettings.callCount).to.eql(testData.saveDropdownSettingsCallCount);
                        expect(UserSettings.saveDropdownSettings.calledWith('networkData', 'NetworkData')).to.eql(testData.saveDropdownSettingsCalledWith);
                        expect(Rest.getCustomTopologyById.callCount).to.eql(testData.getCustomTopologyByIdCallCount);
                        expect(customError.getError.callCount).to.eql(testData.getErrorCallCount);
                    });
                });
            });
        });

        describe('get children of collection from its parent Id', function() {
            it('should make right ajax request',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                var parentId = '1234';
                //ACT
                Rest.getChildren(parentId);
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/custom-topology/v2?parentId=' + parentId,
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });
        });
    });
});
