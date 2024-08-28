define([
    'networkobjectlib/utils/net',
    'networkobjectlib/utils/UserSettings'
], function(net, UserSettings) {

    describe('UserSettings', function() {
        var sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function() {
            sandbox.restore();
        });

        describe('getDropdownSettings', function() {

            [
                {
                    scenario: 'return default dropdown settings (network data)',
                    response: JSON.stringify([]),
                    settings: {
                        id: 'dropdownSettings',
                        value: {
                            id: 'networkData',
                            type: 'NetworkData'
                        }
                    },
                    getDefaultDropdownSettingsCallCount: 1
                },
                {
                    scenario: 'return dropdown settings saved by the user',
                    response: JSON.stringify([{
                        id: 'dropdownSettings',
                        value: JSON.stringify({
                            id: '4000',
                            type: 'CustomTopology'
                        }),
                        created: 1675180060608,
                        lastUpdated: null
                    }]),
                    settings: {
                        id: 'dropdownSettings',
                        value: {
                            id: '4000',
                            type: 'CustomTopology'
                        },
                        created: 1675180060608,
                        lastUpdated: null
                    },
                    getDefaultDropdownSettingsCallCount: 0
                }
            ].forEach(function(testData) {
                it('should ' + testData.scenario, function(done) {
                    sandbox.stub(net, 'ajax').returns(Promise.resolve({data: [testData.response]}));
                    sandbox.spy(UserSettings, 'getDefaultDropdownSettings');

                    var call = UserSettings.getDropdownSettings();

                    call.then(function(data) {
                        expect(net.ajax.getCall(0).calledWith({
                            url: '/rest/ui/settings/topologybrowser/dropdownSettings',
                            type: 'GET',
                        })).to.eql(true);
                        expect(data).to.eql(testData.settings);
                        expect(UserSettings.getDefaultDropdownSettings.callCount).to.eql(testData.getDefaultDropdownSettingsCallCount);
                    }).then(function() { done(); }, done);
                });
            });

        });

        describe('saveDropdownSettings', function() {

            it('should save user settings', function() {
                var id = 4000;
                var type = 'CustomTopology';

                sandbox.stub(net, 'ajax').returns(Promise.resolve());

                UserSettings.saveDropdownSettings(id, type);

                expect(net.ajax.getCall(0).calledWith({
                    url: '/rest/ui/settings/topologybrowser/dropdownSettings',
                    type: 'PUT',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        id: 'dropdownSettings',
                        value: JSON.stringify({
                            id: id,
                            type: type
                        })
                    })
                })).to.eql(true);

            });
        });
    });
});
