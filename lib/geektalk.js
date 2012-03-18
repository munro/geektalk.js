'use strict';

// TODO: Handle PAGEUP/PAGEDOWN

var exec = require('child_process').exec,
    net = require('net'),
    tty = require('tty');

var client = require('./client'),
    input = require('./input'),
    screen = require('./screen');

/**
 * Listen for input on stdin in raw mode. TODO: Why?
 */
process.stdin.resume();
tty.setRawMode(true);

/**
 * Setup default Geektalk options
 */
var options = {
    username: 'ryan',
    hostname: '0x0539.org',
    host: 'localhost',
    port: 41000
};

/**
 * Connect to Geektalk server stored in the options
 */
screen.systemMessage('connecting', options.host + ':' + options.port);
client.connect(options.port, options.host);

/**
 * Write connection details to screen
 */
client.on('connect', function () {
    screen.systemMessage('connected');
    client.write(
        'u=' + options.username + '\nh=' + options.hostname + '\n/signon\n'
    );
});

client.on('message', function (message) {
    screen.message(message);
});

client.on('end', function () {
    screen.message('*** CONNECTION DISCONNECTED ***');
    screen.message('* Type /quit to close to program.');
    screen.message('*');
});

/**
 * Relay input to screen
 */
input.on('input', function (text) {
    screen.input(text);
});

input.on('position', function (position) {
    screen.inputPosition(position);
});

/**
 * Handle message input
 */
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

/**
 * Handle scrolling the screen with pageup/pagedown
 */
process.stdin.on('keypress', function (char, key) {
    if (key && key.name === 'pageup') {
        screen.scroll(-1);
    } else if (key && key.name === 'pagedown') {
        screen.scroll(1);
    }
});
