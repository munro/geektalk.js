var EventEmitter = require('events').EventEmitter,
    tty = require('tty');

var screen = require('./screen');

var input = new EventEmitter();

var text = '',
    pos = 0;

process.stdin.resume();
tty.setRawMode(true);

process.stdin.on('keypress', function (char, key) {
    var temp;

    if (key && key.ctrl && key.name == 'c') {
        console.log('graceful exit');
        process.exit();
    }
    
    // Editing
    if (key && key.name === 'backspace') {
        text = text.substr(0, pos - 1) + text.substr(pos);
        pos = pos === 0 ? 0 : pos - 1;
    } else if (key && key.name === 'delete') {
        text = text.substr(0, pos) + text.substr(pos + 1);
    // Movement
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
    // Readline
    } else if (key && key.name === 'w' && key.ctrl) {
        temp = text.substr(0, pos - 1).replace(/[^\s]*\s*$/, '');
        text = temp + text.substr(pos);
        pos = temp.length;
    // Autocomplete
    } else if (key && key.name === 'tab') {
    // SEND!
    } else if (key && key.name === 'enter') {
        input.emit('line', text);
        text = '';
        pos = 0;
    // Characters
    } else if (char) {
        text = text.substr(0, pos) + char + text.substr(pos);
        pos += 1;
    }

    screen.input(text);
    screen.inputPosition(pos);
});

module.exports = input;
