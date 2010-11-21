var util = require('util');
var simple_request = require('request');
var helpers = require('./helpers');

var testCase = require('nodeunit').testCase;

var dummyUrl = helpers.getDummyUrl();

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

        var request = {
            foo: {
                url: dummyUrl + '/echo-get?foo=bar'
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

        var request = {
            foo: {
                url: dummyUrl + '/echo-post',
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

        var request = {
            foo: {
                url: dummyUrl + '/echo-get?foo=bar'
            },
            bar: {
                url: dummyUrl + '/echo-get?bar=foo'
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

        var request = {
            foo: {
                url: dummyUrl + '/echo-post',
                method: 'POST',
                body: {foo: 'bar'}
            },
            bar: {
                url: dummyUrl + '/echo-post',
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

        var request = {
            foo: {
                url: dummyUrl + '/echo-get?foo=bar'
            },
            bar: {
                url: dummyUrl + '/echo-post',
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

    testJsonGetWithoutPath: function (test) {
        test.expect(2);

        var request = {
            foo: {
                url: dummyUrl
            }
        };
        helpers.makeJsonRequest(request, function(err, response, body) {
            test.ifError(err);
            test.equal(200, response.statusCode);
            test.done();
        });
    },

    testJsonGetReturns400: function (test) {
        test.expect(2);

        var request = {
            uri: helpers.baseUrl + '/json'
        };
        simple_request(request, function(err, response, body) {
            test.ifError(err);
            test.equal(400, response.statusCode);
            test.done();
        });
    },

    testJsonEmptyPostReturns400: function (test) {
        test.expect(2);

        var request = {
            method: 'POST',
            uri: helpers.baseUrl + '/json'
        };
        simple_request(request, function(err, response, body) {
            test.ifError(err);
            test.equal(400, response.statusCode);
            test.done();
        });
    },

    testJsonInvalidBodyReturns400: function (test) {
        test.expect(2);

        var request = {
            method: 'POST',
            uri: helpers.baseUrl + '/json',
            body: 'foo=bar'
        };
        simple_request(request, function(err, response, body) {
            test.ifError(err);
            test.equal(400, response.statusCode);
            test.done();
        });
    }
});
