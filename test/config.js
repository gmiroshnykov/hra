config = exports;

config.server_get = {};
config.server_get.host = '127.0.0.1';
config.server_get.port = 8700;

config.server_post = {};
config.server_post.host = '127.0.0.1';
config.server_post.port = 8701;

try {
    require('./config.local');
} catch (e) {
    if (e.message != "Cannot find module './config.local'") {
        throw e;
    }
    console.log('WARNING: No local config file found in "test/config.local.js", consider creating one.');
}
