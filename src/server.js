var http = require('http');

var handlers = {
    json:       require('./handlers/json').handler,
    error404:   require('./handlers/error404').handler
};

var server = http.createServer(function(req, res) {
    console.log('\nRequest: ' + req.url);

    if (req.url == '/json') {
        handlers.json(req, res);
        return;
    }

    handlers.error404(req, res);
});

exports.server = server;