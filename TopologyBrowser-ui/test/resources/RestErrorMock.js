if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {
    return {
        default: {
            title: 'Unknown server error',
            body: 'There was an unknown server error',
            errorCode: -1
        },
        overLoadProtection: {
            title: 'Unable to Retrieve Data',
            body: 'There is currently no capacity to process the request due to a large amount of activity on the server. Please try again later.',
            errorCode: 10106
        },
        overLoadProtectionFdn: {
            title: 'Unable to Locate Object',
            body: 'There is currently no capacity to process the request due to a large amount of activity on the server. Please try again later.',
            errorCode: 10106
        }
    };
});
