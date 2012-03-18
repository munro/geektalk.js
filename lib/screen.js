'use strict';

// TODO: Display autocomplete
// TODO: Message window movement

var EventEmitter = require('events').EventEmitter;

var util = require('./util');

/**
 * Collection of message objects
 *
 * {Object} {
 *     length: {Number} characters
 *     height: {Number} calculated from screen width
 *     message: {String}
 * }
 */
var messages = [];
var autocomplete = [];
var input = '';
var input_position = 0;

/**
 * Current position of the message window relative to messages
 */
var current_message = 0;

/**
 * Current position relative to current message's lines
 */
var current_line = 0;

/**
 * {Array} [width, height]
 */
var size = process.stdout.getWindowSize();

/**
 * {Object} Create screen module as an EventEmitter instance.
 */
var screen = new EventEmitter();

/**
 * Rebreaks up all the messages to the new screen width.
 */
function resizeCalculate() {
    messages.forEach(function (message) {
        message.lines = util.splitBySize(message.message, size[0]);
    });
}

/**
 * Scroll the message window by a line amount
 *
 * @param {Number} Number of lines to scroll the message window
 */
screen.scroll = function (amount) {
};

/**
 * Add a message to the screen
 *
 * @param {String} Message to add to the screen
 */
screen.message = function (message) {
    message = message.replace(/[\r\n\s]*$/, '');
    messages.push({
        message: message,
        lines: util.splitBySize(message, size[0])
    });
    screen.redrawScreen();
};

/**
 * Prints a system message onto the screen
 *
 * @param {String} Type of system message
 * @param {String} System message
 * @param {Date} Optional timestamp
 */
screen.systemMessage = function (type, message, timestamp) {
    if (type) {
        type = ' ' + type;
    }

    timestamp = util.dateToString(timestamp);

    screen.message('|' + hours + minutes + am_pm + type + '| ' + message); 
};

/**
 * Display words to autocomplete
 * 
 * @param {Array} [{
 *     word: {String} Word to autocomplete,
 *     selected: {Boolean} Word is currently selected
 * }, ...]
 */
screen.autocomplete = function (words) {
};

/**
 * Display text on the input line
 *
 * @param {String} Text to display on the input line
 */
screen.input = function (text) {
    input = text;
    screen.redrawScreen();
};

/**
 * Move input's cursor position
 *
 * @param {Number} Position of cursor in input text
 */
screen.inputPosition = function (position) {
    input_position = position;
    screen.redrawScreen();
};

/**
 * Redraw the screen
 */
screen.redrawScreen = (function () {
    var redrawing = false;

    return function () {
        // Squash consecutive drawing calls into one.
        if (redrawing) {
            return;
        }

        redrawing = true;

        process.nextTick(function () {
            var y,
                m = current_message,
                l = current_line;

            redrawing = false;

            // Hide cursor
            process.stdout.write('\x1b[?25l');

            // Draw message window
            for (y = 0; y < size[1] - (autocomplete.length ? 2 : 1); y += 1) {
                process.stdout.cursorTo(0, y);
                process.stdout.clearLine(0);

                if (m < messages.length) {
                    process.stdout.write(messages[m].lines[l]);

                    l += 1;
                    if (l >= messages[m].lines.length) {
                        m += 1;
                        l = 0;
                    }
                }
            }

            // Draw autocomplete
            if (autocomplete.length) {
                process.stdout.cursorTo(0, y);
                process.stdout.clearLine(0);
                process.stdout.write('autocomplete');
            }

            // Draw input
            process.stdout.cursorTo(0, y + 1);
            process.stdout.clearLine(0);
            process.stdout.write('> ' + input.substr(
                (size[0] - 2) * Math.floor(input_position / (size[0] - 2)),
                size[0] - 2
            ));

            // Set & show cursor
            
            var temp_input_pos = Math.min(input_position, input.length);
            process.stdout.cursorTo(2 + temp_input_pos % (size[0] - 2), y + 1);
            process.stdout.write('\x1b[?25h');
        });
    };
}());

/**
 * When the window is resized — redraw the screen, dyuh!
 */
process.on('SIGWINCH', function () {
    size = process.stdout.getWindowSize();
    resizeCalculate();
    screen.redrawScreen();
});

/**
 * Redraw the screen for the first time.
 */
screen.redrawScreen();

/**
 * Export the screen module
 */
module.exports = screen;
