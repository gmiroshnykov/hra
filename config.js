config = exports;

config.http = {};
config.http.host = '127.0.0.1';
config.http.port = 8080;

config.test = {};
config.test.server_get = {};
config.test.server_get.host = '127.0.0.1';
config.test.server_get.port = 8700;

config.test.server_post = {};
config.test.server_post.host = '127.0.0.1';
config.test.server_post.port = 8701;

try {
    require('./config.local');
} catch (e) {
    if (e.message != "Cannot find module './config.local'") {
        throw e;
    }
    console.log('WARNING: No local config file found, consider creating one.');
}
