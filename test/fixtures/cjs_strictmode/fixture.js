'use strict';

var assert = require('assert').strict;

function add (a, b) {
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.deepEqual({a: 1}, {a: '1'});
    return a + b;
}
