'use strict';

var EventEmitter = require('events').EventEmitter,
    net = require('net');

// hell owoorld ga;[';;

// Parse this input:
// |11:33PM| NAME is now known as NEWNAME.
// |11:33PM signon| NAME@HOST (NAME)
// |11:33PM signoff| NAME@HOST (NAME)
//* 11:35PM
//*  Channel    Username         Idle   Conn'd    UserID@Node
//* >1          ryan                0m      0m ryan@0x0539.org
//*

var client = new EventEmitter();

var socket = new net.Socket({type: 'tcp4'});

client.connect = function (host, port) {
};

socket.on('connect', function () {
});

socket.on('data', function () {
});

socket.on('end', function () {
});
