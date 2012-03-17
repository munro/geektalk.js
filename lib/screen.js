var EventEmitter = require('events').EventEmitter;

/**
 * Collection of message objects
 *
 * @Object {
 *     length: @Number characters
 *     height: @Number calculated from screen width
 *     message: @String
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
    screen.redrawScreen();
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
    input = text;
    screen.redrawScreen();
};

screen.inputPosition = function (position) {
    input_position = position;
    screen.redrawScreen();
};

// Drawing
screen.redrawScreen = (function () {
    var redrawing = false;

    return function () {
        if (redrawing) {
            return;
        }

        redrawing = true;

        process.nextTick(function () {
            var y, m, l;

            m = current_message;
            l = current_line;
            redrawing = false;

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
            process.stdout.write('> ' + input.substr(
                (size[0] - 2) * Math.floor(input_position / (size[0] - 2)),
                size[0] - 2
            ));

            // Move cursor
            process.stdout.cursorTo(2 + input_position % (size[0] - 2), y + 1);
        });
    };
}());

// Currently node does not provide an event to listen for window resizing.  Some
// guy on IRC said it should be added in node v0.8
process.on('SIGWINCH', function () {
    size = process.stdout.getWindowSize();
    resizeCalculate();
    screen.redrawScreen();
});

// Draw the screen the first time!
screen.redrawScreen();

module.exports = screen;
