HRA - HTTP Requests Aggregator
==============================

About
-----

HTTP Requests Aggregator bundles multiple HTTP requests into one.
You may use it to reduce the number of HTTP requests that browser
has to perform in order to get all the data it needs.

Usage
-----

1. Create `config.local.js` and redefine any settings you wish from `config.js` like so:

        config = module.parent.exports;
        config.http.port = 8000;

2. Configure your frontend server to proxy requests to HRA. Here's example for nginx:

        location /hra/ {
            proxy_pass http://127.0.0.1:8000/;
        }

3. Start HRA: `bin/hra-server`
4. Force your fontend server to reload config, e.g. `/etc/init.d/nginx reload`
5. Start sending POST requests from your application to URL `/hra/json` with JSON body like this:

        {
            google: {
                url: 'http://www.google.com/'
            },
            facebook: {
                url: 'http://www.facebook.com/'
            }
        }

6. Receive responses like this:

        {
            google: {
                statusCode: 301,
                headers: {...},
                body: '<HTML>...</HTML>\r\n'    // yup, Google doesn't give a damn about markup validity
            },
            facebook: {
                statusCode: 302,
                headers: {...},
                body: ''                        // and Facebook doesn't even bother to explain anything
            }
        }


Installation
------------

1. Install latest node.js
2. Clone the git repository

Optional steps for devs:

1. Install npm
2. npm install nodeunit
3. npm install request


