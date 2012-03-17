'use strict';

/**
 * Require libraries
 */
var EventEmitter = require('events').EventEmitter,
    tty = require('tty');

/**
 * {Object} Create input module as an `EventEmitter`.
 */
var input = new EventEmitter();

/**
 * {String} State of input text
 */
var text = '';

/**
 * {Number} Position in line being edited
 */
var pos = 0;

/**
 * Listen for input on stdin in raw mode. TODO: Why?
 */
process.stdin.resume();
tty.setRawMode(true);

/**
 * Modify state of readline on keypress.
 */
process.stdin.on('keypress', function (char, key) {
    var temp, old_text = text, old_pos = pos;

    if (key && key.ctrl && key.name === 'c') {
        console.log('graceful exit');
        process.exit();
    }

    /**
     * Editing
     */
    if (key && key.name === 'backspace') {
        text = text.substr(0, pos - 1) + text.substr(pos);
        pos = pos === 0 ? 0 : pos - 1;
    } else if (key && key.name === 'delete') {
        text = text.substr(0, pos) + text.substr(pos + 1);

    /**
     * Movement
     */
    } else if (key && key.name === 'left') {
        if (!key.ctrl) {
            pos = pos === 0 ? 0 : pos - 1;
        } else {
            pos = text.substr(0, pos).replace(/[^\s]*\s*$/, '').length;
        }
    } else if (key && key.name === 'right') {
        if (!key.ctrl) {
            pos = pos === text.length ? pos : pos + 1;
        } else {
            pos += (text.substr(pos).match(/^[^\s]*\s*/) || [''])[0].length;
        }
    } else if (key && key.name === 'home') {
        pos = 0;
    } else if (key && key.name === 'end') {
        pos = text.length;

    /**
     * Readline style key combinations.
     */
    // ^W — Delete word left of cursor position.
    } else if (key && key.name === 'w' && key.ctrl) {
        temp = text.substr(0, pos - 1).replace(/[^\s]*\s*$/, '');
        text = temp + text.substr(pos);
        pos = temp.length;

    /**
     * Autocomplete
     */
    } else if (key && key.name === 'tab') {

    /**
     * Emit input
     */
    } else if (key && key.name === 'enter') {
        input.emit('line', text);
        text = '';
        pos = 0;

    /**
     * Insert character
     */
    } else if (char) {
        text = text.substr(0, pos) + char + text.substr(pos);
        pos += 1;
    }

    /**
     * Emit chanaged text or position.
     */
    if (old_text !== text) {
        input.emit('input', text);
    }
    if (old_pos !== pos) {
        input.emit('position', pos);
    }
});

/**
 * Export input module
 */
module.exports = input;
