'use strict';

// TODO: Parse LOGON/LOGOFF/NAMES data for autocompletion
// Parse this input:

// |11:33PM| NAME is now known as NEWNAME.

// |11:33PM signon| NAME@HOST (NAME)

// |11:33PM signoff| NAME@HOST (NAME)

//* 11:35PM
//*  Channel    Username         Idle   Conn'd    UserID@Node
//* >1          ryan                0m      0m ryan@0x0539.org
//*

var EventEmitter = require('events').EventEmitter,
    net = require('net');


/**
 * {Object} Client module is an instance of an EventEmitter
 */
var client = new EventEmitter();

/**
 * {net.Socket} Create a socket for connection to a Geektalk server
 */
var socket = new net.Socket({type: 'tcp4'});

/**
 * {String} Buffer incoming socket data incase an entire line was not recieved
 */
var data_buffer = '';

/**
 * Set encoding of incoming date to UTF-8
 */
socket.setEncoding('utf-8');

/**
 * Connect to a Geektalk server
 *
 * @param {Number} Port of Geektalk server
 * @param {String} IP/Hostname of Geektalk server
 */
client.connect = function (port, host) {
    socket.connect(port, host);
};

/**
 * Write data to the Geektalk server
 *
 * @param {String} Data to wring
 */
client.write = function (data) {
    socket.write(data);
};

/**
 * Forward socket's on connect even to client module
 */
socket.on('connect', function () {
    data_buffer = '';
    client.emit('connect');
});

/**
 * Handle socket data, emitting each line to the client module
 */
socket.on('data', function (data) {
    var lines = data.split(/\r?\n\r?/);

    data_buffer = lines.pop();

    lines.forEach(function (line) {
        client.emit('message', line);
    });
});

/**
 * Forward socket's on connect even to client module
 */
socket.on('end', function () {
    client.emit('end');
});

module.exports = client;
