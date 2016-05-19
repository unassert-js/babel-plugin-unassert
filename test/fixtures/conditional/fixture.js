'use strict';

var assert = require('assert');

function add (a, b) {
    if (!isNaN(a)) assert(0 < a);
    return a + b;
}
