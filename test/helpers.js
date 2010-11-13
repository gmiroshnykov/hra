var http = require('http');
var url = require('url');
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
        body = JSON.parse(body);
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

        isRunning = true;
    };

    exports.stopDummyServers = function () {
        if (!isRunning) {
            throw 'Dummy servers are not running';
        }

        servers.get.close();

        isRunning = false;
    };

    exports.areDummyServersRunning = function () {
        return isRunning;
    };

    exports.getDummyUrlGet = function () {
        return 'http://' + config.test.server_get.host + ':' + config.test.server_get.port + '/';
    };

    function createGet()
    {
        return http.createServer(function (req, res) {
            var params = url.parse(req.url, true);
            if (params.query == undefined) {
                params.query = {};
            }

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(params.query));
        });
    }
})();
