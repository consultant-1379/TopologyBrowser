define([
    'jscore/core',
    'widgets/Dialog',
    'i18n!networkobjectlib/dictionary.json',
    './SearchNodeView',
    './Rest',
    '../../utils/Constants'
], function(core, Dialog, i18n, SearchNodeView, Rest, Constants) {
    return core.Widget.extend({
        View: SearchNodeView,
        init: function(options) {
            this.options = options;
            this.searchIndex = 0;
        },

        onViewReady: function() {
            this.view.getFindInput().addEventHandler('input', this.onSearchInput.bind(this));
            this.view.getClearSearchIconButton().addEventHandler('click', this.onSearchInputClear.bind(this));
            this.view.getSearchUpButton().addEventHandler('click', function() {
                this.nextButtonClickHandler('prev');
            }.bind(this));
            this.view.getSearchDownButton().addEventHandler('click', function() {
                this.nextButtonClickHandler('next');
            }.bind(this));
            this.view.disableSearchUpButton();
            this.view.disableSearchDownButton();
            this.view.getFindInput().addEventHandler('keypress', function(event) {
                if (event.originalEvent.key === 'Enter') {
                    this.nextButtonClickHandler('next');
                }
            }.bind(this));
        },

        updateSearchNodeWidget: function(id) {
            if (this.options.selectedTopologyId === Constants.NETWORK_DATA && id === Constants.NETWORK_DATA) {
                return;
            }
            this.options.selectedTopologyId = id;
            this.onSearchInputClear();
        },

        nextButtonClickHandler: function(direction) {
            // rest query only if search string changed
            if (this.searchFilterValue && this.searchFilterValue !== this.previousSearchValue) {
                // reset search index
                this.searchIndex = 0;
                if (this.options.selectedTopologyId === Constants.NETWORK_DATA) {
                    this.getPOBySearchStringNetworkData(this.searchFilterValue, direction);
                } else {
                    this.getPOBySearchStringCustomTopology(this.searchFilterValue, direction);
                }

            } else {
                this.handleNextClickAction(direction, false);
            }
        },

        handleNextClickAction: function(direction, isNewSearch) {
            if (!this.responseData || this.responseData.length === 0) {
                this.showNodeEmpty();
                return;
            }
            if (direction === 'prev') {
                this.searchIndex = (this.searchIndex + this.responseData.length - 1) % this.responseData.length;
            } else if (direction === 'next' && !isNewSearch) {
                this.searchIndex = (this.searchIndex + 1) % this.responseData.length;
            }
            if (this.options.selectedTopologyId === Constants.NETWORK_DATA) {
                this.options.context.eventBus.publish('topologyHeader:topologyDropdown:change', {
                    select: Constants.NETWORK_DATA,
                    poid: this.responseData[this.searchIndex].poId
                });
            } else {
                var transformedIds = transformIds(this.responseData[this.searchIndex].path);
                var lastSelectedId = transformedIds.pop();
                var searchIndexId = lastSelectedId.split(':')[1] + ':' + this.responseData[this.searchIndex].poId;
                transformedIds.push(lastSelectedId);
                var topologyState = {
                    expansion: {},
                    selection: {},
                    lastSelectionId: searchIndexId,
                    selectionIds: [searchIndexId],
                    expansionIds: transformedIds,
                    isHardRefresh: true
                };
                this.options.context.eventBus.publish('topologyTree:refresh', topologyState);
            }
            this.view.setFindCount(this.searchIndex, this.responseData.length);
            this.view.showFindCount();
        },

        showNodeEmpty: function() {
            this.view.hideFindCount();
            this.view.showInputErrorMessage('Nodes not found');
        },

        getPOBySearchStringCustomTopology: function(searchStr, direction) {
            this.previousSearchValue = searchStr;
            return Rest.getPOByQueryStringCustomTopology(this.options.selectedTopologyId, searchStr)
                .then(function(response) {
                    this.responseData = response;
                    this.handleNextClickAction(direction, true);
                }.bind(this))
                .catch(function(error) {
                    showErrorDialog(error.title, error.body);
                }.bind(this));
        },

        getPOBySearchStringNetworkData: function(searchStr, direction) {
            this.previousSearchValue = searchStr;
            return Rest.getPOByQueryStringNetworkData(searchStr)
                .then(function(response) {
                    this.responseData = response;
                    this.handleNextClickAction(direction, true);
                }.bind(this))
                .catch(function(error) {
                    showErrorDialog(error.title, error.body);
                }.bind(this));
        },

        onSearchInput: function() {
            this.searchFilterValue = this.view.getFindInput().getValue();
            this.validateQuery();
            this.view.showClearSearchIconButton(this.searchFilterValue);
        },

        validateQuery: function() {
            if ((this.searchFilterValue !== '' && !this.searchFilterValue.match(Constants.SEARCH_INPUT_REGEX))) {
                this.handleSearchInputError();
            } else if ((this.searchFilterValue !== '' && this.previousSearchValue !== this.searchFilterValue) || this.searchFilterValue === '') {
                this.handleClearSearchInputError();
            }
        },

        handleSearchInputError: function() {
            this.view.showInputErrorMessage('Error at character '+ this.getInvalidCharIndex());
            this.view.disableSearchUpButton();
            this.view.disableSearchDownButton();
            this.view.hideFindCount();
        },

        getInvalidCharIndex: function() {
            for (var i = 0; i < this.searchFilterValue.length; i++) {
                if (!this.searchFilterValue[i].match(Constants.SEARCH_INPUT_REGEX)) {
                    return i+1;
                }
            }
            return 1;
        },

        handleClearSearchInputError: function() {
            this.view.clearInputErrorMessage();
            this.view.hideFindCount();
            if (this.searchFilterValue === '' || this.searchFilterValue === undefined) {
                this.view.disableSearchUpButton();
                this.view.disableSearchDownButton();
            } else {
                this.view.enableSearchDownButton();
                this.view.enableSearchUpButton();
            }
        },

        onSearchInputClear: function() {
            this.view.getFindInput().setValue('');
            this.view.hideClearSearchIconButton();
            this.previousSearchValue = '';
            this.searchFilterValue = '';
            this.responseData = null;
            this.handleClearSearchInputError();
        }
    });

    function transformIds(ids) {
        return ids.map(function(element, index, array) {
            if (index === 0) {
                return 'null:' + element;
            } else {
                return array[index - 1] + ':' + element;
            }
        });
    }

    function showErrorDialog(header, body) {
        var dialog = createDialog('error', header, body);
        dialog.show();
    }

    function createDialog(type, header, content) {
        var errorDialog = new Dialog({
            header: header,
            content: content,
            buttons: [
                {
                    caption: i18n.buttons.ok,
                    action: function() {
                        errorDialog.destroy();
                    }
                }
            ],
            type: type
        });
        return errorDialog;
    }

});
