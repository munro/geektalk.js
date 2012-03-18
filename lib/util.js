'use strict';

/**
 * Splits up a string into bite size increments!
 *
 * @param {String} String to split
 * @param {Number} Increment size to break message up by
 * @returns {Array} Returns a list of message parts into bite sizes!
 */
exports.splitBySize = function (str, size) {
    var lines = [];
    while (true) {
        if (str.length >= size) {
            lines.push(str.substr(0, size));
            str = str.substr(size);
        } else {
            lines.push(str);
            break;
        }
    }
    return lines;
};

/**
 * Converts a timestamp into a string using Geektalk's date format.
 *
 * @param {Date} Optional timestamp
 * @return {String} Geektalk date format
 */
exports.dateToString = function (timestamp) {
    var hours, minutes, am_pm;

    if (typeof timestamp === 'undefined') {
        timestamp = new Date();
    }

    hours = (timestamp.getHours() % 12).toString();
    minutes = (timestamp.getMinutes()).toString();

    if (hours.length === 1) {
        hours = '0' + hours;
    }
    if (minutes.length === 1) {
        minutes = '0' + minutes;
    }
    if (timestamp.getHours() < 12) {
        am_pm = 'AM';
    } else {
        am_pm = 'PM';
    }

    return hours + ':' + minutes + am_pm;
};
