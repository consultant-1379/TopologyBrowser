/* global module, require */
/* jshint esversion:6 */
var proxyServer = require('./proxyServer');

module.exports = function(app) {
    'use strict';

    // mock your requests (es6)
    // app.get('/network/1', (req, res) => res.status(404).send({message: 'Not Found'}));
    // app.get('/network/:id', (req, res) => res.status(200).send({poid: req.params.id}));
    // app.post('/network', (req, res) => res.status(200).send({body: req.body}));

    // add a 5min delay to request
    // app.put('/network/:id(\\d+)/', (req, res, next) => setTimeout(() => next, 300000))

    // mock your requests (es5)
    // app.get('/fdn/:fdn', function(req, res) {
    //     res.status(200).send({fdn: req.params.fdn});
    // });

    // initialize proxyServer
    proxyServer(app);
};
