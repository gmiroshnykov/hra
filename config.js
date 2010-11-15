config = exports;

config.http = {};
config.http.host = '127.0.0.1';
config.http.port = 8080;

try {
    require('./config.local');
} catch (e) {
    if (e.message != "Cannot find module './config.local'") {
        throw e;
    }
    console.log('WARNING: No local config file found in "config.local.js", consider creating one.');
}
