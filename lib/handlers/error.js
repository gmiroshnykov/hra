var errors = {
    400: 'Bad Request',
    404: 'Not Found',
    500: 'Internal Server Error'
};

exports.showError = function (code, req, res) {
    if (errors[code] == undefined) {
        code = 500;
    }

    var message = code + ' ' + errors[code];
    console.log('Response: HTTP ' + message);

    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(message + '\n');
};
