var helpers = require('./helpers');

var testCase = require('nodeunit').testCase;
module.exports = testCase({
    setUp: function() {
        helpers.startDummyServers();
    },

    tearDown: function() {
        helpers.stopDummyServers();
    },

    testJsonSingleGet: function (test) {
        var urlGet = helpers.getDummyUrlGet();
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
        var urlGet = helpers.getDummyUrlGet();
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
