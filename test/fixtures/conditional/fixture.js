'use strict';

var assert = require('assert');

function add (a, b) {
    if (!isNaN(a)) assert(0 < a);
    if (typeof b === 'number') {
        assert(0 < b);
    }
    return a + b;
}
