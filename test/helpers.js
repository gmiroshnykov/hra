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
