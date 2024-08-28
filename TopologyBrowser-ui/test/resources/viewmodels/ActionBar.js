define([
    'test/resources/BitUtils'
], function(promises) {
    return {
        getActionButton: function() {
            return promises.waitForElementVisible('.ebBtn.elLayouts-ActionBarButton', 3000);
        },
        waitForActionsToClear: function() {
            return promises.waitUntil(function() {
                var rows = document.querySelectorAll('.elLayouts-ActionBarButton');
                return rows && rows.length === 0;
            }, 5000);
        }
    };
});
