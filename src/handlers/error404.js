exports.handler = function (req, res) {
    console.log('Response: HTTP 404');

    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found\n');
};
