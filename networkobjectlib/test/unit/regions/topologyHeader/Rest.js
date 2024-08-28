define([
    'networkobjectlib/regions/topologyHeader/Rest',
    'networkobjectlib/utils/net'
], function(Rest,net) {

    describe('Rest', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('get Custom Topologies', function() {
            it('should make right ajax request for v4',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                //ACT
                Rest.getDropdown();
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/collections/search/v4',
                    type: 'POST',
                    dataType: 'json'
                })).to.equal(true);
            });

            it('should fall back to v2 call if v4 fails',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.reject());
                sandbox.stub(Rest, 'getCustomTopologiesOptions');
                //ACT
                Rest.getDropdown();
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax).to.be.rejected;
                return net.ajax({
                    url: 'test'
                }).then(function(data) {
                    //Failure
                }).catch(function(error) {
                    expect(Rest.getCustomTopologiesOptions.callCount).to.equal(1);
                });
            });

            it('should make right ajax request for v2',function() {
                //SETUP
                sandbox.stub(net, 'ajax').returns(Promise.resolve());
                //ACT
                Rest.getCustomTopologiesOptions();
                //ASSERT
                expect(net.ajax.callCount).to.equal(1);
                expect(net.ajax.getCall(0).calledWithMatch({
                    url: '/object-configuration/custom-topology/v2?customTopology=true',
                    type: 'GET',
                    dataType: 'json'
                })).to.equal(true);
            });
        });
    });
});
