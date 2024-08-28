define([
    'jscore/core',
    './net'
], function(core, net) {

    var USER_SETTINGS_DROPDOWN_URL = '/rest/ui/settings/topologybrowser/dropdownSettings';

    /*
     * @returns {Object}
     *  {String|Object} data - response from the request
     *  {jscore/core/XHR} xhr - Custom XmlHttpRequest
     *  {Object} - config - configuration object (ex: to identify the request)
     */
    return {

        /**
         * Returns the default dropdown settings
         * @returns {{id: string, value: {id: string, type: string}}}
         */
        getDefaultDropdownSettings: function() {
            return {
                id: 'dropdownSettings',
                value: {
                    id: 'networkData',
                    type: 'NetworkData'
                }
            };
        },

        /**
         * Retrieves dropdown settings from the user settings rest service and returns a formatted object with relevant info
         * @returns {Promise<{lastUpdated: null|number, created: number, {id: string, value: string}}>}
         */
        getDropdownSettings: function() {
            return net.ajax({
                url: USER_SETTINGS_DROPDOWN_URL,
                type: 'GET',
            }).then(function(response) {
                if (JSON.parse(response.data).length > 0) {
                    var setting = JSON.parse(response.data)[0];
                    return {
                        id: setting.id,
                        value: JSON.parse(setting.value),
                        created: setting.created,
                        lastUpdated: setting.lastUpdated
                    };
                } else {
                    return this.getDefaultDropdownSettings();
                }
            }.bind(this));
        },

        /**
         * Sends the selected dropdown settings to the user settings rest service with stringified data
         * @param id - topology id
         * @param type - topology type
         * @returns {Promise | Promise<unknown>}
         */
        saveDropdownSettings: function(id, type) {
            return net.ajax({
                url: USER_SETTINGS_DROPDOWN_URL,
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
            });
        },

    };
});
