define([
    'test/resources/BitUtils'
], function(promises) {
    return {
        getProgressBarValueSpan: function() {
            return promises.waitForElementVisible('.ebProgressBar-value', 3000);
        },
        getCounterBoxValueByTitle: function(title) {
            return promises.waitForElementVisible('.elNetworkObjectLib-wCounterBox', 100)
                .then(function(counterboxes) {
                    return new Promise(function(resolve, reject) {
                        var titleWasFound = [].slice.call(counterboxes).find(function(counterbox) {
                            if (counterbox.querySelector('.elNetworkObjectLib-wCounterBox-title').textContent === title) {
                                resolve(counterbox.querySelector('.elNetworkObjectLib-wCounterBox-value').textContent);
                                return true;
                            }
                            return false;
                        });
                        if (!titleWasFound) {
                            reject('Could not find .elNetworkObjectLib-wCounterBox-value');
                        }
                    });
                });
        },
        getResultValueForName: function(name) {
            return promises.waitForElementVisible('.ebTableRow', 100).then(function(rows) {
                return new Promise(function(resolve, reject) {
                    var titleWasFound = [].slice.call(rows).find(function(row) {
                        if (row.children[0].textContent === name) {
                            resolve(row.children[1].children[1].textContent);
                            return true;
                        }
                        return false;
                    });
                    if (!titleWasFound) {
                        reject('Could not find .elNetworkObjectLib-wCounterBox-value');
                    }
                });
            });
        },
        getRowNamesInResultsTable: function() {
            return promises.waitForElementVisible('.ebTableRow', 100).then(function(rows) {
                return new Promise(function(resolve) {
                    var namesInRow = [].slice.call(rows).map(function(row) {
                        return row.children[0].textContent;
                    });

                    if (namesInRow[0] === 'Node Name') {
                        namesInRow.shift();
                    }
                    return resolve(namesInRow);
                });
            });
        }
    };
});
