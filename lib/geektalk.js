'use strict';

// TODO: Handle PAGEUP/PAGEDOWN

var net = require('net'),
    exec = require('child_process').exec;

var screen = require('./screen'),
    input = require('./input'),
    client = require('./client');

/**
 * Setup default Geektalk options
 */
var options = {
    username: 'ryan',
    hostname: '0x0539.org',
    host: 'localhost',
    port: 41000
};

screen.message(
    '|12:23AM connecting| ' + options.host + ':' + options.port
);

client.connect(options.port, options.host);

client.on('connect', function () {
    screen.message('|12:23AM connected|');
    client.write(
        'u=' + options.username + '\nh=' + options.hostname + '\n/signon\n'
    );
});

client.on('message', function (message) {
    screen.message(message);
});

input.on('line', function (text) {
    text = text.replace(/\s+$/, '');
    if (text === '/quit') {
        process.stdout.write('\n');
        process.exit();
    } else if (text === '/disconnect') {
        screen.message('TODO HANDLE DISCONNECT');
    } else if (text === '/connect' || text.match(/^\/connect /)) {
        screen.message('TODO HANDLE CONNECT');
    } else {
        client.write(text + '\n');
    }
});

input.on('input', function (text) {
    screen.input(text);
});

input.on('position', function (position) {
    screen.inputPosition(position);
});

client.on('end', function () {
    screen.message('*** CONNECTION DISCONNECTED ***');
    screen.message('* Type /quit to close to program.');
    screen.message('*');
});
