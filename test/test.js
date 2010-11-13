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
        var urlGet = helpers.getDummyUrl('get');
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

    testJsonSinglePost: function (test) {
        var urlPost = helpers.getDummyUrl('post');
        var request = {
            foo: {
                url: urlPost,
                method: 'POST',
                body: {foo: 'bar'}
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
        var urlGet = helpers.getDummyUrl('get');
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

            test.equal(200, body.bar.statusCode);
            test.equal(JSON.stringify({bar: 'foo'}),
                body.bar.body);

            test.done();
        });
    },

    testJsonMultiPosts: function (test) {
        var urlPost = helpers.getDummyUrl('post');
        var request = {
            foo: {
                url: urlPost,
                method: 'POST',
                body: {foo: 'bar'}
            },
            bar: {
                url: urlPost,
                method: 'POST',
                body: {bar: 'foo'}
            }
        };
        helpers.makeJsonRequest(request, function(err, response, body) {
            test.equal(200, response.statusCode);

            test.equal(200, body.foo.statusCode);
            test.equal(JSON.stringify({foo: 'bar'}),
                body.foo.body);

            test.equal(200, body.bar.statusCode);
            test.equal(JSON.stringify({bar: 'foo'}),
                body.bar.body);

            test.done();
        });
    },

    testJsonMixGetAndPost: function (test) {
        var urlGet = helpers.getDummyUrl('get');
        var urlPost = helpers.getDummyUrl('post');
        var request = {
            foo: {
                url: urlGet + '?foo=bar'
            },
            bar: {
                url: urlPost,
                method: 'POST',
                body: {bar: 'foo'}
            }
        };

        helpers.makeJsonRequest(request, function(err, response, body) {
            test.equal(200, response.statusCode);

            test.equal(200, body.foo.statusCode);
            test.equal(JSON.stringify({foo: 'bar'}),
                body.foo.body);

            test.equal(200, body.bar.statusCode);
            test.equal(JSON.stringify({bar: 'foo'}),
                body.bar.body);

            test.done();
        });
    }
});
