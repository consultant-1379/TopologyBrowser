define([
    'jscore/core',
    './ProgressRegionView',
    'i18n!networkobjectlib/dictionary.json',
    '../../widgets/CounterBox/CounterBox',
    '../../widgets/ProgressDetailsTable/ProgressDetailsTable',
    'widgets/ProgressBar'
], function(core, ProgressRegionView, i18n, CounterBox, ProgressDetailsTable, ProgressBar) {

    /**
     * ProgressRegion is a region that will display a detailed set of states for a long lived process.
     * ProgressRegion has minimal logic, all of which is related solely to the initial state.
     *
     * ### Options
     * [===
     *    {AppContext} context - application context, required for sharing events.
     * ===]
     *
     * ### Events Subscribed
     * [===
     *     progress-region:update ({Object} event)
     *               - name Name of the Node/Cell whatever to update
     *               - state ENUM, set in state definitions, to update to
     * ===]
     *
     * @class networkobjectlib/ProgressRegion
     * @extends Region
     */
    return core.Region.extend({
        events: {
            PROGRESS_REGION_UPDATE: 'progress-region:update'
        },
        View: function() {
            return new ProgressRegionView(i18n.ProgressRegion);
        },
        init: function(options) {
            this.data = options.data;
            this.stateDefinitions = options.stateDefinitions.slice();
            this.initialState = options.initialState;
            this.dictionary = options.dictionary || i18n.ProgressRegion.columns;
            this.goalStates = this.stateDefinitions.filter(function(definition) {
                return definition.goalState;
            }.bind(this));


            this.getEventBus().subscribe(this.events.PROGRESS_REGION_UPDATE, this.onProgressUpdate, this);
        },
        onStart: function() {
        },
        onViewReady: function() {
            // Counters
            this.counterWidgets = {};
            this.states = {};
            this.stateToItemMap = {};
            this.stateDefinitions.reverse().forEach(function(stateDefinition) {
                // Build state map
                var key = stateDefinition.state;
                this.states[key] = stateDefinition;

                //Build widget map
                var counterWidget = new CounterBox(stateDefinition);
                this.counterWidgets[key] = counterWidget;

                // Set initial counter values
                this.stateToItemMap[key] = {};
                if (stateDefinition.initialState) {
                    // Fill stateToItemMap with data, indexed by name
                    this.data.forEach(function(item) {
                        this.stateToItemMap[key][item.name] = item;
                    }.bind(this));
                    counterWidget.updateCounter(this.data.length);
                } else {
                    counterWidget.updateCounter(stateDefinition.value || 0);
                }

                this.view.addCounterBox(counterWidget);
            }.bind(this));

            // Progress Bar
            this.progressBar = new ProgressBar({
                label: i18n.get('ProgressRegion.progress.labelStart'),
                value: 0,
                color: '#666'
            });

            var initialState = this.states[this.initialState],
                initialMessage = initialState.description || initialState.label;

            var rows = this.data.map(function(item) {
                return {
                    name: item.name,
                    message: initialMessage
                };
            });

            this.progressDetailsTable = new ProgressDetailsTable({
                dictionary: this.dictionary,
                items: rows,
                stateDefinitions: this.states
            });

            // Attach UI components to DOM
            this.progressBar.attachTo(this.view.getProgressBarHolder());
            this.progressDetailsTable.attachTo(this.view.getDetailsHolder());

        },

        /**
         * Callback for event when Action has received an update affecting an item's state
         *
         * @private
         * @method onProgressUpdate
         * @param {Object} event
         *               - name String Name of the Node/Cell whatever to update
         *               - state ENUM Set in state definitions, to update to
         *               - detail String (Optional) Additional info to be appended e.g. error description
         */
        onProgressUpdate: function(event) {
            // Get message from state => label mapping
            var message = this.states[event.state].description || this.states[event.state].label;
            event.message = message;

            // add any error message
            if (event.detail) {
                event.message += (': '+event.detail);
            }

            //  lookup which state(s) this node is currently in
            var availableStates = Object.keys(this.stateToItemMap);
            var currentState = availableStates.find(function(state) {
                return this.stateToItemMap[state][event.name];
            }.bind(this));

            // Update details table
            this.progressDetailsTable.onProgressDetailsUpdate(event);

            //  increment the new state counter
            this.stateToItemMap[event.state][event.name] = this.stateToItemMap[currentState][event.name];
            this.counterWidgets[event.state].updateCounter(Object.keys(this.stateToItemMap[event.state]).length);

            //  decrement the previous state counter
            delete this.stateToItemMap[currentState][event.name];
            this.counterWidgets[currentState].updateCounter(Object.keys(this.stateToItemMap[currentState]).length);

            // Increment Progress Bar
            var totalFinished = this.goalStates.reduce(function(count, goalState) {
                return count + Object.keys(this.stateToItemMap[goalState.state]).length;
            }.bind(this), 0);

            var percentage = totalFinished * 100 / this.data.length;
            this.progressBar.setValue(percentage|0);
            if (totalFinished === this.data.length) {
                this.progressBar.setLabel(i18n.get('ProgressRegion.progress.labelEnd'));
            }
        }
    });

});
