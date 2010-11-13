var http = require('http');
var url = require('url');
var config = require('../config');

var isRunning = false;
var servers = {};

exports.start = function () {
    if (isRunning) {
        throw 'Dummy servers already running';
    }

    servers.get = createGet();
    servers.get.listen(config.test.server_get.port, config.test.server_get.host);

    isRunning = true;
};

exports.stop = function () {
    if (!isRunning) {
        throw 'Dummy servers are not running';
    }

    servers.get.close();

    isRunning = false;
};

exports.isRunning = function () {
    return isRunning;
};

exports.getUrlGet = function () {
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
