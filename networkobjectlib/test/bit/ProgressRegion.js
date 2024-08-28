/* global bitbox */
define([
    'networkobjectlib/regions/progress-region/ProgressRegion',
    'jscore/core',
    'widgets/Dialog',
    'test/resources/BitUtils',
    'test/resources/PersistentObjectRestMock',
    'test/resources/ModelServiceRestMock',
    'i18n!networkobjectlib/dictionary.json',
    'test/resources/responses/attributes',
    'test/resources/responses/modelInfoService',
    'test/resources/viewModels/ProgressRegionViewModel'
], function(ProgressRegion, core, Dialog, BitUtils, PersistentObjectRestMock, ModelServiceRestMock, i18n, attributesMockResponse, modelMockResponse, ProgressRegionViewModel) {

    describe('ProgressRegion', function() {
        var sandbox, app, eventBus, classUnderTest;

        var defns, data = [];

        beforeEach(function() {
            // create sandbox with fake server and auto respond to requests
            sandbox = sinon.sandbox.create({
                useFakeServer: true
            });
            sandbox.server.autoRespond = true;

            // create app
            app = new core.App();
            app.start(core.Element.wrap(bitbox.getBody()));

            bitbox.setSize({width: 1024, height: 640});
        });

        afterEach(function() {
            app.stop();
            sandbox.restore();
            data = [];
            defns = [];
        });

        describe('Given one initial state and one goal state', function() {
            describe('when the initial state is updated to the goal state', function() {
                it('then the counters, progress state and results are updated correctly, description should be used for initial state rather than label', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = {
                        'name': 'LTE01ERBS0001'
                    };

                    // param: stateDefinitions
                    defns = [
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
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('LTE01ERBS0001');
                        },
                        function(value) {
                            expect(value).to.equal('Initial Description');
                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data.name,
                                state: 'GOAL_STATE'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('LTE01ERBS0001');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and two goal states', function() {
            describe('when the data is transitioned to one of each goal states', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'LTE01ERBS0001'
                    }, {
                        'name': 'LTE01ERBS0002'
                    }];

                    // param: stateDefinitions
                    defns = [
                        {
                            state: 'INITIAL_STATE',
                            label: 'initial-state-label',
                            initialState: true
                        },
                        {
                            state: 'GOAL_STATE_1',
                            label: 'goal-state-label-1',
                            goalState: true
                        },
                        {
                            state: 'GOAL_STATE_2',
                            label: 'goal-state-label-2',
                            goalState: true
                        }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('LTE01ERBS0001');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('LTE01ERBS0002');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('LTE01ERBS0001');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-1');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('LTE01ERBS0002');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and three goal states', function() {
            describe('when all of node data transitions to first goal state only', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [
                        {
                            state: 'INITIAL_STATE',
                            label: 'initial-state-label',
                            initialState: true
                        },
                        {
                            state: 'GOAL_STATE_1',
                            label: 'goal-state-label-1',
                            goalState: true
                        },
                        {
                            state: 'GOAL_STATE_2',
                            label: 'goal-state-label-2',
                            goalState: true
                        },
                        {
                            state: 'GOAL_STATE_3',
                            label: 'goal-state-label-3',
                            goalState: true
                        }

                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-1');
                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(result) {
                            expect(result).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and three goal states', function() {
            describe('when all of node data transitions to second goal state only', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    },
                    {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true
                    },
                    {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    },
                    {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                        }
                    ], done);
                });
            });
        });


        describe('Given one initial state and three goal states', function() {
            describe('when all of node data transitions to third goal state only', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    },
                    {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true

                    }, {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true

                    }, {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_3'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-3');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_3'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-3');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and three goal states', function() {
            describe('when two nodes transition to first & third goal states, second goal remains "empty"', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    },
                    {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true

                    },
                    {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    },
                    {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-1');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_3'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-3');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                        }
                    ], done);
                });
            });
        });


        describe('Given one initial state and three goal states', function() {
            describe('when two nodes transition to first & second goal states, third goal remains "empty"', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [
                        {
                            state: 'INITIAL_STATE',
                            label: 'initial-state-label',
                            initialState: true
                        },
                        {
                            state: 'GOAL_STATE_1',
                            label: 'goal-state-label-1',
                            goalState: true
                        },
                        {
                            state: 'GOAL_STATE_2',
                            label: 'goal-state-label-2',
                            goalState: true
                        },
                        {
                            state: 'GOAL_STATE_3',
                            label: 'goal-state-label-3',
                            goalState: true
                        }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-1');
                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and three goal states', function() {
            describe('when two nodes transition to second & third goal states, first goal remains "empty"', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    }, {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_3'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-3');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and three goal states', function() {
            describe('when three nodes transition to each of the goal states', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }, {
                        'name': 'NODE_3'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    }, {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('3');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_3');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_3'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('33%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-3');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('66%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[2].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_3');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state, one intermediary state and three goal states', function() {
            describe('transition first and second nodes to second and third goal states and third node to intermediary state', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }, {
                        'name': 'NODE_3'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    }, {
                        state: 'INTERMEDIATE_STATE',
                        label: 'intermediate-state-label'
                    },
                    {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('3');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('intermediate-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_3');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('33%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('66%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[2].name,
                                state: 'INTERMEDIATE_STATE'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('66%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('intermediate-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_3');
                        },
                        function(result) {
                            expect(result).to.equal('intermediate-state-label');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('intermediate-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state, one intermediary state and three goal states', function() {
            describe('transition first and second nodes to same goal state and third node to intermediary state', function() {
                it('then the counters, progress state and results are updated correctly', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }, {
                        'name': 'NODE_3'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    }, {
                        state: 'INTERMEDIATE_STATE',
                        label: 'intermediate-state-label'
                    },
                    {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('3');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('intermediate-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_3');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_3'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('33%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-3');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_2'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('66%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('goal-state-label-2');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[2].name,
                                state: 'INTERMEDIATE_STATE'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('66%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('intermediate-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_3');
                        },
                        function(result) {
                            expect(result).to.equal('intermediate-state-label');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('intermediate-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                        }
                    ], done);
                });
            });
        });

        describe('Given one initial state and three goal states', function() {
            describe('when all of node data transitions to first goal state only', function() {
                it('then the counters, progress state and results are updated correctly, supplied description should be used for goal state 1', function(done) {
                    this.timeout(20000);

                    // param: data
                    data = [{
                        'name': 'NODE_1'
                    }, {
                        'name': 'NODE_2'
                    }
                    ];

                    // param: stateDefinitions
                    defns = [{
                        state: 'INITIAL_STATE',
                        label: 'initial-state-label',
                        initialState: true
                    }, {
                        state: 'GOAL_STATE_1',
                        label: 'goal-state-label-1',
                        goalState: true,
                        description: 'description should replace default label for goal state 1'
                    }, {
                        state: 'GOAL_STATE_2',
                        label: 'goal-state-label-2',
                        goalState: true
                    }, {
                        state: 'GOAL_STATE_3',
                        label: 'goal-state-label-3',
                        goalState: true
                    }
                    ];

                    // create region
                    classUnderTest = new ProgressRegion({
                        data: data,
                        stateDefinitions: defns,
                        initialState: 'INITIAL_STATE',
                        context: app.getContext()
                    });
                    classUnderTest.start(app.getElement());

                    // Keep a reference
                    eventBus = app.getContext().eventBus;

                    BitUtils.runTestSteps([
                        ProgressRegionViewModel.getProgressBarValueSpan,
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('0%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('initial-state-label');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[0].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('50%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(value) {
                            expect(value).to.equal('1');
                            return ProgressRegionViewModel.getResultValueForName('NODE_1');
                        },
                        function(result) {
                            expect(result).to.equal('description should replace default label for goal state 1');

                            eventBus.publish(classUnderTest.events.PROGRESS_REGION_UPDATE, {
                                name: data[1].name,
                                state: 'GOAL_STATE_1'
                            });
                            return ProgressRegionViewModel.getProgressBarValueSpan();
                        },
                        function(progressBarSpan) {
                            expect(progressBarSpan.textContent).to.equal('100%');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('initial-state-label');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getResultValueForName('NODE_2');
                        },
                        function(result) {
                            expect(result).to.equal('description should replace default label for goal state 1');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-1');
                        },
                        function(result) {
                            expect(result).to.equal('2');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-2');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                            return ProgressRegionViewModel.getCounterBoxValueByTitle('goal-state-label-3');
                        },
                        function(value) {
                            expect(value).to.equal('0');
                        }
                    ], done);
                });
            });
        });


    });
});
