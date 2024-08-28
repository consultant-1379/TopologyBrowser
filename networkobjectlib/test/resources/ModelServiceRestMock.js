define([

], function() {

    return {
        respondModel: function(server, statusCode, body, urlData, isOldApi) {
            var neVersion = isOldApi ? '' : urlData.neVersion + '/';
            var neType = isOldApi ? '' : urlData.neType + '/';
            var base = isOldApi ? '/modelInfo/model/' : '/persistentObject/model/';

            respond(server, 'GET', base + neType + neVersion + urlData.namespace + '/' + urlData.type
                + '/' + urlData.namespaceVersion + '/attributes?' + urlData.parameter + '=true', statusCode, body);
        }
    };

    function respond(server, method, url, statusCode, body) {
        server.respondWith(method, url, [statusCode, {'Content-Type': 'application/json'}, JSON.stringify(body)]);
    }
});
