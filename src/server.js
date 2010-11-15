var http = require('http');

var handlers = {
    json:   require('./handlers/json').handler,
    error:  require('./handlers/error')
};

var server = http.createServer(function(req, res) {
    console.log('\nRequest: ' + req.url);

    if (req.url == '/json') {
        handlers.json(req, res);
        return;
    }

    handlers.error.showError(404, req, res);
});

exports.server = server;