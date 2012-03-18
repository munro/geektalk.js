'use strict';

// TODO: Do autocompleting
// TODO: Use OOP instead of modular programming, so programmer can pass in
//       desired input stream

/**
 * Require libraries
 */
var EventEmitter = require('events').EventEmitter;

/**
 * {Object} Create input module as an `EventEmitter`.
 */
var input = new EventEmitter();

/**
 * {String} State of input line
 */
var line = '';

/**
 * {Number} Position in line being edited
 */
var line_position = 0;

/**
 * {Array} History of previously entered lines
 */
var line_history = ['', 'foo', 'bar', 'wtttttf'];

/**
 * {Number} History of line
 */
var line_history_position = 0;


/**
 * Modify state of readline on keypress.
 */
process.stdin.on('keypress', function (char, key) {
    var temp, old_line = line, old_line_position = line_position;

    if (key && key.ctrl && key.name === 'c') {
        console.log('graceful exit');
        process.exit();
    }

    /**
     * Editing
     */
    if (key && key.name === 'backspace') {
        line_position = Math.min(line_position, line.length);
        if (line_position > 0) {
            line = (
                line.substr(0, line_position - 1) +
                line.substr(line_position)
            );
            line_position -= 1;
        }
    } else if (key && key.name === 'delete') {
        line = line.substr(0, line_position) + line.substr(line_position + 1);
    /**
     * Movement
     */
    } else if (key && key.name === 'left') {
        if (key.ctrl) {
            line_position = line.substr(
                0, line_position
            ).replace(/[^\s]*\s*$/, '').length;
        } else if (line_position > 0) {
            line_position -= 1;
        }
    } else if (key && key.name === 'right') {
        if (key.ctrl) {
            line_position += (line.substr(line_position).match(/^[^\s]*\s*/) || [''])[0].length;
        } else if (line_position < line.length) {
            line_position += 1;
        }
    } else if (key && key.name === 'home') {
        line_position = 0;
    } else if (key && key.name === 'end') {
        line_position = line.length;
    /**
     * Readline style key combinations.
     */
    // ^W — Delete word left of cursor position.
    } else if (key && key.name === 'w' && key.ctrl) {
        temp = line.substr(0, line_position).replace(/([A-Za-z0-9]*|[^A-Za-z0-9\t\r\n ]*)[\t\r\n ]*$/, '');
        line = temp + line.substr(line_position);
        line_position = temp.length;
    /**
     * Navigate line history
     */
    } else if (key && key.name === 'up') {
        if (line_history_position < line_history.length - 1) {
            line_history_position += 1;
            line = line_history[line_history_position];
        }
    } else if (key && key.name === 'down') {
        if (line_history_position > 0) {
            line_history_position -= 1;
            line = line_history[line_history_position];
        }
    /**
     * Autocomplete
     */
    } else if (key && key.name === 'tab') {
        // TODO
    /**
     * Emit input
     */
    } else if (key && key.name === 'enter') {
        input.emit('line', line);
        line = '';
        line_position = 0;

        line_history = [''].concat(line_history.slice(0, 20));
        line_history_position = 0;
    /**
     * Insert character
     */
    } else if (char && (!key || (!key.ctrl && key.name !== 'escape'))) {
        line = line.substr(0, line_position) + char + line.substr(line_position);
        line_position += 1;

        line_history[0] = line;
        line_history_position = 0;
    }

    /**
     * Emit chanaged line or position.
     */
    if (old_line !== line) {
        input.emit('input', line);
    }
    if (old_line_position !== line_position) {
        input.emit('position', line_position);
    }
});

/**
 * Export input module
 */
module.exports = input;
