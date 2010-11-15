var util = require('util');
var simple_request = require('request');
var helpers = require('./helpers');

var testCase = require('nodeunit').testCase;
module.exports = testCase({
    setUp: function(callback) {
        helpers.startDummyServers();
        if (callback) callback();
    },

    tearDown: function(callback) {
        helpers.stopDummyServers();
        if (callback) callback();
    },

    testJsonSingleGet: function (test) {
        test.expect(4);

        var urlGet = helpers.getDummyUrl('get');
        var request = {
            foo: {
                url: urlGet + '?foo=bar'
            }
        };
        helpers.makeJsonRequest(request, function(err, response, body) {
            test.ifError(err);

            test.equal(200, response.statusCode);

            test.equal(200, body.foo.statusCode);
            test.equal(JSON.stringify({foo: 'bar'}),
                body.foo.body);

            test.done();
        });
    },

    testJsonSinglePost: function (test) {
        test.expect(4);

        var urlPost = helpers.getDummyUrl('post');
        var request = {
            foo: {
                url: urlPost,
                method: 'POST',
                body: {foo: 'bar'}
            }
        };
        helpers.makeJsonRequest(request, function(err, response, body) {
            test.ifError(err);

            test.equal(200, response.statusCode);

            test.equal(200, body.foo.statusCode);
            test.equal(JSON.stringify({foo: 'bar'}),
                body.foo.body);

            test.done();
        });
    },

    testJsonMultiGets: function (test) {
        test.expect(6);

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
            test.ifError(err);

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
        test.expect(6);

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
            test.ifError(err);

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
        test.expect(6);

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
            test.ifError(err);

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

    testJsonGetReturns400: function (test) {
        test.expect(1);

        var request = {
            uri: helpers.baseUrl + '/json'
        };
        simple_request(request, function(err, response, body) {
            test.equal(400, response.statusCode);
            test.done();
        });
    },

    testJsonEmptyPostReturns400: function (test) {
        test.expect(1);

        var request = {
            method: 'POST',
            uri: helpers.baseUrl + '/json'
        };
        simple_request(request, function(err, response, body) {
            test.equal(400, response.statusCode);
            test.done();
        });
    },

    testJsonInvalidBodyReturns400: function (test) {
        test.expect(1);

        var request = {
            method: 'POST',
            uri: helpers.baseUrl + '/json',
            body: 'foo=bar'
        };
        simple_request(request, function(err, response, body) {
            test.equal(400, response.statusCode);
            test.done();
        });
    }
});
