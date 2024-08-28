/* global define,console */
define([
    'i18n!networkobjectlib/dictionary.json',
], function(i18n) {
    return {

        getErrorFromResponse: function(xhr) {
            if (!xhr) {
                return i18n.errors.poidNotAvailable;
            }

            switch (xhr.getStatus()) {
            case 404:
                return i18n.errors.persistentObjectNotFound;

            case 403:
                return i18n.errors.forbidden;

            case 500: case 503:
                var json;
                try {
                    json = xhr.getResponseJSON();
                } catch (e) {
                    console.error(e);
                }

                return (json && json.body && json.body.indexOf('status: RetryFailed') > -1) ?
                    i18n.errors.databaseUnavailable : i18n.errors.persistentObjectError;
            case 504:
                return i18n.errors.serviceUnavailable;
            default:
                return i18n.errors.persistentObjectError;
            }
        }

    };
});
