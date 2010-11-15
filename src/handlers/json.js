var util = require('util');

var aggregator = require('../aggregator');

exports.handler = function (req, res) {
    if (req.method != 'POST') {
        require('./error').showError(400, req, res);
        return;
    }

    var requestBodyRaw = '';
    req.on('data', function (chunk) {
        requestBodyRaw += chunk;
    });

    req.on('end', function() {
        try {
            var aggregatorRequest = JSON.parse(requestBodyRaw);
        } catch (e) {
            require('./error').showError(400, req, res);
        }
        var total = 0;
        for (k in aggregatorRequest) {
            total++;
        }

        var done = 0;
        var responseBody = {};
        aggregator.process(aggregatorRequest, function (id, aggregatorResponse) {
            responseBody[id] = aggregatorResponse;
            if (++done == total) {
                sendResponse(req, res, responseBody);
            }
        });
    });
};

function sendResponse(req, res, responseBody) {
    console.log('Response: ' + util.inspect(responseBody));

    var responseBodyRaw = JSON.stringify(responseBody);
    var headers = {
        'Content-Type': 'application/json',
        'Content-Length': responseBodyRaw.length
    };
    res.writeHead(200, headers);
    res.end(responseBodyRaw);
}
