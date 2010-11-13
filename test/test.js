var helpers = require('./helpers');
var dummyServers = require('./dummy-servers');

var testCase = require('nodeunit').testCase;
module.exports = testCase({
    setUp: function() {
        dummyServers.start();
    },

    tearDown: function() {
        dummyServers.stop();
    },

    testJsonSingleGet: function (test) {
        var urlGet = dummyServers.getUrlGet();
        var request = {
            foo: {
                url: urlGet + '?foo=bar'
            }
        };
        helpers.makeJsonRequest(request, function(err, response, body) {
            test.equal(200, response.statusCode);

            test.equal(200, body.foo.statusCode);
            test.equal(JSON.stringify({foo: 'bar'}),
                body.foo.body);

            test.done();
        });
    },

    testJsonMultiGets: function (test) {
        var urlGet = dummyServers.getUrlGet();
        var request = {
            foo: {
                url: urlGet + '?foo=bar'
            },
            bar: {
                url: urlGet + '?bar=foo'
            }
        };
        helpers.makeJsonRequest(request, function(err, response, body) {
            test.equal(200, response.statusCode);

            test.equal(200, body.foo.statusCode);
            test.equal(JSON.stringify({foo: 'bar'}),
                body.foo.body);

            test.equal(200, response.body.bar.statusCode);
            test.equal(JSON.stringify({bar: 'foo'}),
                body.foo.body);

            test.done();
        });

        test.done();
    }
});
