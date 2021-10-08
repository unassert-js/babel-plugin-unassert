'use strict';

var invariant = require('invariant');
const nassert = require('nanoassert');
import * as uassert from 'uvu/assert';


function add (a, b) {
    nassert(!isNaN(a));

    uassert.is(Math.sqrt(4), 2);
    uassert.is(Math.sqrt(144), 12);
    uassert.is(Math.sqrt(2), Math.SQRT2);

    invariant(someTruthyVal, 'This will not throw');
    invariant(someFalseyVal, 'This will throw an error with this message');

    return a + b;
}
