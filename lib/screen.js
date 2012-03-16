var EventEmitter = require('events').EventEmitter;

/**
 * Collection of message objects
 * @Object {
 *     length: @Number characters
 *     height: @Number calculated from screen width
 *     message: @String
 * }
 */
var messages = [],
    autocomplete = [],
    input = '',
    current_message = 0,
    current_line = 0;

/**
 * @Array [width, height]
 */
var size = process.stdout.getWindowSize();

var screen = new EventEmitter();

function splitByLength(message, length) {
    var lines = [];
    while (true) {
        if (message.length >= length) {
            lines.push(message.substr(0, length));
            message = message.substr(length);
        } else {
            lines.push(message);
            break;
        }
    }
    return lines;
}

function resizeCalculate() {
    messages.forEach(function (message) {
        message.lines = splitByLength(message.message, size[0]);
    });
}

function redrawScreen() {
    var y, m = current_message, l = current_line;

    // Draw message window
    for (y = 0; y < size[1] - (autocomplete.length ? 2 : 1); y += 1) {
        process.stdout.cursorTo(0, y);
        process.stdout.clearLine(0);

        if (m >= messages.length) {
            continue;
        }

        process.stdout.write(messages[m].lines[l]);

        l += 1;
        if (l >= messages[m].lines.length) {
            m += 1;
            l = 0;
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
    process.stdout.write('> INPUT');
}

// Currently node does not provide an event to listen for window resizing.  Some
// guy on IRC said it should be added in node v0.8
setInterval(function () {
    var new_size = process.stdout.getWindowSize();
    if (size[1] !== new_size[0] || size[1] !== new_size[1]) {
        process.stdout.emit('resize');

        process.nextTick(function () {
            resizeCalculate();
            redrawScreen();
            size = new_size;
        });
    }
}, 500);

// Info
screen.width = function () {
};

screen.inputWidth = function () {
    //return size
};

// Controlling
screen.scroll = function (amount) {
};

// Output
screen.message = function (message) {
    messages.push({
        message: message,
        lines: splitByLength(message, size[0])
    });
    redrawScreen();
};

screen.userMessage = function (name, msg) {
};

screen.logonEvent = function (name) {
};

screen.logoutEvent = function (name) {
};

// Input
screen.autocomplete = function (words) {
};

screen.input = function (text) {
};

redrawScreen();

module.exports = screen;
