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
    current_line = 0,
    size = process.stdout.getWindowSize();

var screen = new EventEmitter();



// Currently node does not provide an event to listen for window resizing.  Some
// guy on IRC said it should be added in node v0.8
setInterval(function () {
    var new_size = process.stdout.getWindowSize();    
    if (size[0] !== new_size[0] || size[1] !== new_size[1]) {
        process.stdout.emit('resize');
        size = new_size;
    }
}, 500);

function resizeCalculate() {
    messages.forEach(function (message) {
        message.height = Math.ceil(message.length / size[0]);
    });
}

function redrawScreen() {
    var y, m = current_message, l = current_line;

    // Draw message window
    for (y = 0; y < size[0] - autocomplete.length ? 2 : 1; y += 1) {
        process.stdout.cursorTo(0, y);
        process.stdout.clearLine(0);

        if (m >= messages.length) {
            continue;
        }

        process.stdout.write(messages[m].lines[l]);

        l += 1;
        if (messages[m].lines.length > l) {
            m += 1;
            l = 0;
        }
    }

    // Draw autocomplete
    process.stdout.cursorTo(0, y);
    process.stdout.clearLine(0);
    process.stdout.write('autocomplete');
}
redrawScreen();

// Info
screen.width = function () {
};

// Controlling
screen.scroll = function (amount) {
};

// Output
screen.message = function (msg) {
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

module.exports = screen;
