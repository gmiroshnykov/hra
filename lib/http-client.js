var util = require('util');
var http = require('http');
var url = require('url');

function Client() {
    http.Client.call(this);
}
util.inherits(Client, http.Client);

exports.Client = Client;

function createClient(port, host, https, credentials) {
    var c = new Client();
    c.port = port;
    c.host = host;
    c.https = https;
    c.credentials = credentials;
    return c;
};
exports.createClient = createClient;

Client.prototype.request = function () {
    var clientRequest = http.Client.prototype.request.apply(this, arguments);
    clientRequest.on('response', function (response) {
        response.data = '';
        response.on('data', function(chunk){
            response.data += chunk;
        });
    });
    return clientRequest;
};
