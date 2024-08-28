define([
    'test/resources/BitUtils'
], function(promises) {
    return {
        getSyncButton: function() {
            return promises.waitForElementVisible('.ebBtn_color_darkBlue', 3000);
        },
        getNonSyncButtons: function() {
            return promises.waitForElementVisible('.ebBtn:not(.ebBtn_color_darkBlue)', 3000);
        },
        getProgressRegion: function() {
            return promises.waitForElementVisible('.elNetworkObjectLib-progressRegion', 5000);
        },
        getOkButton: function() {
            return promises.waitForElementVisible('.ebBtn_color_blue', 3000);
        },
        waitForActionsToClear: function() {
            return promises.waitUntil(function() {
                var rows = document.querySelectorAll('.elLayouts-ActionBarButton');
                return rows && rows.length === 0;
            }, 5000);
        }
    };
});
