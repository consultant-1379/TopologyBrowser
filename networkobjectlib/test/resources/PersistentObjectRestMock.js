define([

], function() {

    return {
        respondSubNetworks: function(server, statusCode, body) {
            respond(server, 'GET', '/persistentObject/network/-1?relativeDepth=0:-2&childDepth=1', statusCode, body);
        },

        respondAllOtherNodes: function(server, statusCode, body) {
            respond(server, 'GET', '/persistentObject/network/-2?relativeDepth=0:-2&childDepth=1', statusCode, body);
        },

        respondExpansion: function(server, statusCode, body, id) {
            respond(server, 'GET', '/persistentObject/network/'+id, statusCode, body);
        },

        respondSubtree: function(server, statusCode, body, id) {
            respond(server, 'GET', '/persistentObject/network/'+id+'/subTrees', statusCode, body);
        },

        respondPoids: function(server, statusCode, body) {
            respond(server, 'POST', '/persistentObject/network/poids', statusCode, body);
        },

        respondAttributes: function(server, statusCode, body, id, includeNonPersistent) {
            respond(server, 'GET', '/persistentObject/'+id+'?includeNonPersistent='+includeNonPersistent+'&stringifyLong=true', statusCode, body);
        },

        respondSaveAttributes: function(server, statusCode, body, id) {
            respond(server, 'PUT', '/persistentObject/'+id, statusCode, body);
        },

        respondFDN: function(server, statusCode, body, fdn) {
            respond(server, 'GET', '/persistentObject/fdn/' + fdn, statusCode, body);
        }
    };

    function respond(server, method, url, statusCode, body) {
        server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, JSON.stringify(body)]);
    }
});
