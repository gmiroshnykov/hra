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
                url: urlGet + '?foo=1'
            }
        };
        helpers.makeJsonRequest(request, function(response) {
            test.equal(200, response.statusCode);

            test.equal(200, response.body.foo.statusCode);
            test.equal(JSON.stringify({foo: '1'}),
                response.body.foo.body);

            test.done();
        });
    },

    testJsonMultiGets: function (test) {
        var urlGet = dummyServers.getUrlGet();
        var request = {
            foo: {
                url: urlGet + '?foo=1'
            },
            bar: {
                url: urlGet + '?bar=1'
            }
        };
        helpers.makeJsonRequest(request, function(response) {
            test.equal(200, response.statusCode);

            test.equal(200, response.body.foo.statusCode);
            test.equal(JSON.stringify({foo: '1'}),
                response.body.foo.body);

            test.equal(200, response.body.bar.statusCode);
            test.equal(JSON.stringify({bar: '1'}),
                response.body.foo.body);

            test.done();
        });

        test.done();
    }
});
