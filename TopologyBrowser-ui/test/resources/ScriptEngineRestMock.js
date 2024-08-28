define([

], function() {

    return {
        respondCommandOutput: function(server, statusCode, processId, body) {
            respond(server, 'GET', '/script-engine/services/command/output/' + processId, statusCode, '9999', body);
        },
        respondCommand: function(server, statusCode, processId, body) {
            respond(server, 'POST', '/script-engine/services/command/', statusCode, processId, body);
        }
    };

    function respond(server, method, url, statusCode, processId, body) {
        server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json', 'process_id': processId}, JSON.stringify(body)]);
    }
});
