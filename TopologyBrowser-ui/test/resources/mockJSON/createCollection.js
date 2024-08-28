if (typeof define !== 'function') {
    var define = function(callback) {
        module.exports = callback();
    };
}
define(function() {
    return [
        {
            'id': '00000000000000',
            'name': '',
            'category': '',
            'readOnly': false,
            'update': false,
            'delete': false,
            'sortable': false,
            'timeCreated': 1234567890000,
            'lastUpdated': null,
            'userId': 'user'
        }
    ];
});
