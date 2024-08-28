if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}

define(function() {

    return {
        'userMessage': {
            'title': '',
            'body': 'Managed Object Does Not Exist'
        }
    };
});

