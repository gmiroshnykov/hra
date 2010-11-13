var http = require('http');

var config = require('../config');

var client = http.createClient(config.http.port, config.http.host);

exports.testIndexReturns404 = function (test) {
    test.expect(2);

    var request = client.request('GET', '/');
    request.end();
    request.on('response', function (response) {
        test.equal(404, response.statusCode);

        response.setEncoding('utf8');
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function() {
            test.equal('Not Found\n', body);
            test.done();
        });
    });
};

exports.testSimpleJsonGetRequests = function (test) {
    var requestBody = {
        downforeveryoneorjustme: {
            method: 'GET',
            url: 'http://downforeveryoneorjustme.com/',
            headers: {Host: 'downforeveryoneorjustme.com'}
        },
        whatwg: {
            method: 'GET',
            url: 'http://www.whatwg.org/',
            headers: {Host: 'www.whatwg.org'}
        }
    };
    var requestBodyRaw = JSON.stringify(requestBody);

    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': requestBodyRaw.length
    };
    var request = client.request('POST', '/json', headers);
    request.write(requestBodyRaw);
    request.end();
    request.on('response', function (res) {
        test.equal(200, res.statusCode);
        test.equal('application/json', res.headers['content-type']);

        res.setEncoding('utf8');
        var responseBodyRaw = '';
        res.on('data', function (chunk) {
            responseBodyRaw += chunk;
        });

        res.on('end', function() {
            var responseBody = JSON.parse(responseBodyRaw);
            test.equal(200, responseBody.downforeveryoneorjustme.statusCode);
            test.equal(200, responseBody.whatwg.statusCode);
            test.done();
        });
    });
};