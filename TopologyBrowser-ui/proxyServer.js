/* global module, require, process, console */
var request = require('request');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

module.exports = function(app) {
    'use strict';

    var cookieJar = request.jar();
    var settings = require('./proxyMappings.json');

    var proxy_protocol = settings.proxy_protocol;
    var proxy_host = settings.proxy_host;
    var proxy_port = settings.proxy_port;
    var baseUrl = proxy_protocol + '://' + proxy_host + ':' + proxy_port;
    var loginUrl = baseUrl + '/login';

    console.log('Posting to: ' + loginUrl);

    request.post(loginUrl, {
        form: {
            IDToken1: settings.username,
            IDToken2: settings.userpassword
        }
    }, function(err, httpResponse) {
        if (err) {
            console.error('httpResponse: ' + httpResponse);
            return console.error('Login Error: ' + err);
        }
        console.log('Login Successful: ' + JSON.stringify(httpResponse.headers));

        var cookieArray = httpResponse.headers['set-cookie'] || [];
        cookieArray.forEach(function(e) {
            return cookieJar.setCookie(request.cookie(e), baseUrl);
        });
    });

    settings.mappings.forEach(function(mapping) {
        app.use(mapping.source, function(req, res) {
            proxy_protocol = mapping.proxy_protocol || settings.proxy_protocol;
            proxy_host = mapping.proxy_host || settings.proxy_host;
            proxy_port = mapping.proxy_port || settings.proxy_port;

            var url = baseUrl + (mapping.dest ? mapping.dest : mapping.source) + (req.url === '/' ? '' : req.url); // fix /editprofile/ to /editprofile

            req.on('error', function(e) {
                return console.log('Request Error: ' + e.message);
            });

            const headers = Object.assign({}, req.headers, {
                'X-Tor-UserId': settings.username
            }, settings.headers);

            delete headers['host'];

            request({
                method: req.method,
                url: url,
                jar: cookieJar,
                json: req.body,
                headers: headers
            }, function(err) {
                return err ? console.log('Response Error: ' + err) : null;
            }).pipe(res);
        });
    });
};
