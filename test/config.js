config = exports;

config.server = {};
config.server.host = '127.0.0.1';
config.server.port = 8700;

try {
    require('./config.local');
} catch (e) {
    if (e.message != "Cannot find module './config.local'") {
        throw e;
    }
    console.log('WARNING: No local config file found in "test/config.local.js", consider creating one.');
}
