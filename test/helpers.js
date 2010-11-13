var http = require('http');

var config = require('../config');
var client = http.createClient(config.http.port, config.http.host);

exports.makeJsonRequest = function(body, callback) {
    var requestBodyRaw = JSON.stringify(body);
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': requestBodyRaw.length
    };

    var request = client.request('POST', '/json', headers);
    request.write(requestBodyRaw);
    request.end();
    request.on('response', function (res) {
        res.setEncoding('utf8');
        var responseBodyRaw = '';
        res.on('data', function (chunk) {
            responseBodyRaw += chunk;
        });

        res.on('end', function() {
            res.body = JSON.parse(responseBodyRaw);
            callback(res);
        });
    });
};

