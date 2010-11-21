var url = require('url');
var util = require('util');

var httpClient = require('./http-client');

exports.process = function (aggregatorRequests, callback) {
    //console.log('Aggregator Requests: ' + util.inspect(aggregatorRequests));

    for (var id in aggregatorRequests) {
        var aggregatorRequest = aggregatorRequests[id];
        if (aggregatorRequest.method == undefined) {
            aggregatorRequest.method = 'GET';
        }

        if (aggregatorRequest.headers == undefined) {
            aggregatorRequest.headers = {};
        }

        var urlParts = url.parse(aggregatorRequest.url);
        if (urlParts.port == undefined) {
            urlParts.port = 80;
        }

        if (aggregatorRequest.headers['Host'] == undefined) {
            aggregatorRequest.headers['Host'] = urlParts.hostname;
        }

        var query = '/';
        if (urlParts.pathname != undefined) {
            query = urlParts.pathname;
        }

        if (urlParts.search != undefined) {
            query += urlParts.search;
        }

        //console.log('URL parts: ' + util.inspect(urlParts));

        var client = httpClient.createClient(urlParts.port, urlParts.hostname);
        var request = client.request(aggregatorRequest.method,
                query, aggregatorRequest.headers);

        if (aggregatorRequest.body != undefined) {
            if (typeof aggregatorRequest.body != 'string') {
                aggregatorRequest.body = JSON.stringify(aggregatorRequest.body);
            }
            request.write(aggregatorRequest.body);
        }

        request.end();
        request.aggregatorId = id;

        request.on('response', function (response) {
            var aggregatorId = this.aggregatorId;
            var aggregatorResponse = {};
            aggregatorResponse.statusCode = response.statusCode;
            aggregatorResponse.headers = response.headers;

            response.setEncoding('utf8');

            response.on('end', function() {
                aggregatorResponse.body = response.data;
                callback(aggregatorId, aggregatorResponse);
            });
        });
    }
};

