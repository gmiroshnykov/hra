var http = require('http');
var url = require('url');
var util = require('util');
var request = require('request');

var config = require('../config');
config.test = require('./config');

var baseUrl = 'http://' + config.http.host + ':' + config.http.port;
exports.baseUrl = baseUrl;

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
    var dummyServer = null;
    exports.startDummyServers = function () {
        if (isRunning) {
            throw 'Dummy server is running';
        }

        dummyServer = createDummyServer();
        dummyServer.listen(config.test.server.port, config.test.server.host);

        isRunning = true;
    };

    exports.stopDummyServers = function () {
        if (!isRunning) {
            throw 'Dummy server is not running';
        }

        dummyServer.close();

        isRunning = false;
    };

    exports.areDummyServersRunning = function () {
        return isRunning;
    };

    exports.getDummyUrl = function () {
        return 'http://' + config.test.server.host + ':' + config.test.server.port;
    };

    function createDummyServer() {
        return http.createServer(function (req, res) {
            var params = url.parse(req.url, true);

            switch (params.pathname) {
                case '/':
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Main Page');
                    return;

                case '/echo-get':
                    if (params.query == undefined) {
                        params.query = {};
                    }
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(JSON.stringify(params.query));
                    return;

                case '/echo-post':
                    req.body = '';
                    req.on('data', function (chunk) {
                        req.body += chunk;
                    });

                    req.on('end', function() {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(req.body);
                    });
                    return;

                case '/redirect':
                    var location = '/echo-get?redirected=true';
                    res.writeHead(301, {'Location': location});
                    res.end('Reditecting...');
                    return;

                default:
                    console.log('UNKOWN PATHNAME: ' + params.pathname);
            }
        });
    }
})();
