define([

], function() {

    return {
        respondSubNetworks: function(server, statusCode, body) {
            respond(server, 'GET', '/persistentObject/network/-1?relativeDepth=0:-2&childDepth=1', statusCode, body);
        },

        respondAllOtherNodes: function(server, statusCode, body) {
            respond(server, 'GET', '/persistentObject/network/-2?relativeDepth=0:-2&childDepth=1', statusCode, body);
        },

        respondNetworkGetPoids: function(server, statusCode, body) {
            respond(server, 'POST', '/persistentObject/network/poids', statusCode, body);
        },

        respondPoid: function(server, statusCode, body, id) {
            respond(server, 'GET', '/persistentObject/network/'+id, statusCode, body);
        },

        respondSubtree: function(server, statusCode, body, id) {
            respond(server, 'GET', '/persistentObject/network/'+id+'/subTrees', statusCode, body);
        },

        respondRefresh: function(server, statusCode, body) {
            respond(server, 'POST', '/persistentObject/network/refresh', statusCode, body);
        },

        respondAttributes: function(server, statusCode, body, id, includeNonPersistent) {
            respond(server, 'GET', '/persistentObject/'+id+'?includeNonPersistent='+includeNonPersistent?includeNonPersistent:false +'&stringifyLong=true' , statusCode, body);
        },

        respondRootAssociations: function(server, statusCode, body) {
            respond(server, 'POST', '/persistentObject/rootAssociations/', statusCode, body);
        },

        respondPerformActionOnMO: function(server, fdn, actionName, statusCode, body) {
            respond(server, 'POST', '/persistentObject/v1/perform-mo-action/'+fdn+'?actionName='+actionName, statusCode, body);
        }
    };

    function respond(server, method, url, statusCode, body) {
        server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, JSON.stringify(body)]);
    }
});
