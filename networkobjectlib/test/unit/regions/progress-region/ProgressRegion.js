/*global  describe, sinon, beforeEach, afterEach, it*/
define([
    'jscore/core',
    'networkobjectlib/regions/progress-region/ProgressRegion',
], function(core, ProgressRegion) {
    'use strict';

    describe('regions/ProgressRegion', function() {
        var sandbox, app, content, classUnderTest, eventBusStub;

        beforeEach(function() {
            // create sandbox
            sandbox = sinon.sandbox.create();

            // create app
            app = new core.App();
            app.start(new core.Element());

            // create div to hold the region
            content = new core.Element();
            content.setStyle({width: '100%', height: 420});
            app.getElement().append(content);

            eventBusStub = sinon.createStubInstance(core.EventBus);

            var data = {
                'name': 'LTE01ERBS0001'
            };

            // param: stateDefinitions
            var defns = [
                {
                    state: 'INITIAL_STATE',
                    label: 'initial-state-label',
                    description: 'Initial Description',
                    initialState: true
                },
                {
                    state: 'GOAL_STATE',
                    label: 'goal-state-label',
                    goalState: true
                }
            ];

            // create region
            classUnderTest = new ProgressRegion({
                data: [data],
                stateDefinitions: defns,
                initialState: 'INITIAL_STATE',
                context: app.getContext()
            });

            classUnderTest.getEventBus = function() {
                return eventBusStub;
            };

            classUnderTest.start(content);
        });

        afterEach(function() {
            content.remove();
            app.stop();
            sandbox.restore();
        });

        it('Should create ProgressRegion correctly with states', function() {
            // Assert
            expect(classUnderTest.stateDefinitions.length).to.equal(2);
            expect(classUnderTest.goalStates.length).to.equal(1);
            expect(classUnderTest.goalStates[0].state).to.equal('GOAL_STATE');

        });

        it('Should create progressDetailsTable and progressBar', function() {
            // Assert
            expect(classUnderTest.progressDetailsTable).not.to.be.undefined;
            expect(classUnderTest.progressBar).not.to.be.undefined;
        });

        describe('onProgressUpdate', function() {
            var node = 'LTE01ERBS0001';
            [
                {
                    description: 'reach goal state and update progress label with label \'Node Sync Initiation Complete\'',
                    state: 'GOAL_STATE',

                    expected: {
                        callCount: 1,
                        state: {
                            'LTE01ERBS0001': {
                                name: node
                            }
                        },
                        length: 1
                    }
                },
                {
                    description: 'reach initial state and not update progress label',
                    state: 'INITIAL_STATE',
                    expected: {
                        callCount: 0,
                        state: {},
                        length: 0
                    }
                }
            ].forEach(function(test) {
                it('Should update progress when ' + test.description, function() {
                    sandbox.spy(classUnderTest.progressDetailsTable, 'onProgressDetailsUpdate');
                    sandbox.spy(classUnderTest.progressBar, 'setLabel');

                    // Action
                    classUnderTest.onProgressUpdate({
                        name: node,
                        state: test.state

                    });
                    // Assert
                    expect(classUnderTest.progressDetailsTable.onProgressDetailsUpdate.callCount).to.equal(1);
                    expect(classUnderTest.progressBar.setLabel.callCount).to.equal(test.expected.callCount);
                    expect(Object.keys(classUnderTest.stateToItemMap[test.state]).length).to.equal(test.expected.length);
                    expect(classUnderTest.stateToItemMap[test.state]).to.eql(test.expected.state);
                });
            });
        });
    });
});
