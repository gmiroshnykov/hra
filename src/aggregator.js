var http = require('http');
var url = require('url');

exports.process = function (aggregatorRequests, callback) {
    //console.log('Aggregator Requests: ' + util.inspect(aggregatorRequests));

    for (var id in aggregatorRequests) {
        var aggregatorRequest = aggregatorRequests[id];
        var urlParts = url.parse(aggregatorRequest.url);

        if (urlParts.port == undefined) {
            urlParts.port = 80;
        }

        var client = http.createClient(urlParts.port, urlParts.hostname);
        var request = client.request(aggregatorRequest.method,
                urlParts.pathname, aggregatorRequest.headers);

        if (aggregatorRequest.body != undefined) {
            request.write(aggregatorRequest.body);
        }

        request.end();
        request.aggregatorId = id;

        request.on('response', function (res) {
            var aggregatorId = this.aggregatorId;
            var aggregatorResponse = {};
            aggregatorResponse.statusCode = res.statusCode;
            aggregatorResponse.headers = res.headers;

            res.setEncoding('utf8');
            var responseBodyRaw = '';
            res.on('data', function (chunk) {
                responseBodyRaw += chunk;
            });

            res.on('end', function() {
                aggregatorResponse.body = responseBodyRaw;
                callback(aggregatorId, aggregatorResponse);
            });
        });
    }
};
