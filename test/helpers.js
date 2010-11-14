var http = require('http');
var url = require('url');
var util = require('util');
var request = require('request');

var config = require('../config');
var baseUrl = 'http://' + config.http.host + ':' + config.http.port;

exports.makeJsonRequest = function(body, callback) {
    var requestBodyRaw = JSON.stringify(body);
    var httpRequest = {
        method: 'POST',
        uri: baseUrl + '/json',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': requestBodyRaw.length
        },
        body: requestBodyRaw
    };
    request(httpRequest, function(err, response, body) {
        if (!err) {
            body = JSON.parse(body);
        }
        callback(err, response, body);
    });
};

(function() {
    var isRunning = false;
    var servers = {};
    exports.startDummyServers = function () {
        if (isRunning) {
            throw 'Dummy servers already running';
        }

        servers.get = createGet();
        servers.get.listen(config.test.server_get.port, config.test.server_get.host);

        servers.post = createPost();
        servers.post.listen(config.test.server_post.port, config.test.server_post.host);

        isRunning = true;
    };

    exports.stopDummyServers = function () {
        if (!isRunning) {
            throw 'Dummy servers are not running';
        }

        servers.get.close();
        servers.post.close();

        isRunning = false;
    };

    exports.areDummyServersRunning = function () {
        return isRunning;
    };

    exports.getDummyUrl = function (method) {
        method = method.toLowerCase();
        return 'http://' + config.test['server_' + method].host + ':' + config.test['server_' + method].port + '/';
    };

    function createGet() {
        return http.createServer(function (req, res) {
            var params = url.parse(req.url, true);
            if (params.query == undefined) {
                params.query = {};
            }

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(params.query));
        });
    }

    function createPost() {
        return http.createServer(function (req, res) {
            var body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function() {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(body);
            });
        });
    }
})();
