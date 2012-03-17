'use strict';

var net = require('net'),
    exec = require('child_process').exec;

var screen = require('./screen'),
    input = require('./input');

var options = {
    username: 'ryan',
    hostname: '0x0539.org',
    host: 'localhost',
    port: 41000
};

var client = net.connect(options.port, options.host, function () {
    screen.message('Connected!');
    client.write(
        'u=' + options.username + '\nh=' + options.hostname + '\n/signon\n'
    );
});

client.setEncoding('utf-8');

screen.message(
    'Connecting to ' + options.host + ':' + options.port + '...'
);

var data_buffer = '';

client.on('data', function (data) {
    var lines = data.split(/\r?\n\r?/);

    data_buffer = lines.pop();

    lines.forEach(function (line) {
        screen.message(line);
    });
});

input.on('line', function (text) {
    client.write(text + '\n');
});

input.on('input', function (text) {
    screen.input(text);
});

input.on('position', function (position) {
    screen.inputPosition(position);
});

client.on('end', function () {
    process.exit();
});
