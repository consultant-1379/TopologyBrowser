if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return function() {

        var defaultDropdownSettings = {
            id: 'dropdownSettings',
            value: JSON.stringify({
                id: 'networkData',
                type: 'NetworkData'
            })
        };

        var dropdownSettings;

        return {
            getDropdownSettings: function() {
                if (!dropdownSettings) {
                    return [defaultDropdownSettings];
                }
                return [dropdownSettings];
            },

            saveDropdownSettings: function(data) {
                dropdownSettings = data;
            },

            resetDropdownSettings: function() {
                dropdownSettings = defaultDropdownSettings;
            }
        };
    };
});
