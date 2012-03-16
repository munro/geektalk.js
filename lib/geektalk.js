var net = require('net');

var screen = require('./screen'),
    input = require('./input');


screen.message('Connecting to localhost:41000...');
var client = net.connect(41000, 'localhost', function () {
    screen.message('Connected!');
    client.write('u=ryan_foo\nh=weeee\n/signon\n');
});

client.setEncoding('utf-8');

var data_buffer = '';

client.on('data', function (data) {
    screen.message(data);
    /*var lines = data.split(/\r?\n\r?/);

    data_buffer = lines.pop();

    lines.forEach(function (line) {
        screen.message(line);
    });*/
});

client.on('end', function () {
    process.exit();
});
