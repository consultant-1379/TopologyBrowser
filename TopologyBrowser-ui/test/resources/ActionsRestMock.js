define([

], function() {

    return {
        respondActions: function(server, statusCode, body) {
            respond(server, 'POST', '/rest/v1/apps/action-matches', statusCode, body);
        }
    };

    function respond(server, method, url, statusCode, body) {
        server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, JSON.stringify(body)]);
    }
});
