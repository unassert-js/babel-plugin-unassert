/**
 * babel-plugin-unassert
 *   Babel plugin to remove assertions on build.
 *   Encourages Design by Contract (DbC).
 * 
 * https://github.com/twada/babel-plugin-unassert
 *
 * Copyright (c) 2015 Takuto Wada
 * Licensed under the MIT license.
 *   http://twada.mit-license.org/
 */
'use strict';

var escallmatch = require('escallmatch');
var patterns = [
    'assert(value, [message])',
    'assert.ok(value, [message])',
    'assert.equal(actual, expected, [message])',
    'assert.notEqual(actual, expected, [message])',
    'assert.strictEqual(actual, expected, [message])',
    'assert.notStrictEqual(actual, expected, [message])',
    'assert.deepEqual(actual, expected, [message])',
    'assert.notDeepEqual(actual, expected, [message])',
    'assert.deepStrictEqual(actual, expected, [message])',
    'assert.notDeepStrictEqual(actual, expected, [message])',
    'assert.fail(actual, expected, message, operator)',
    'assert.throws(block, [error], [message])',
    'assert.doesNotThrow(block, [message])',
    'assert.ifError(value)',
    'console.assert(value, [message])'
];

function matches (node) {
    return function (matcher) {
        return matcher.test(node);
    };
}

module.exports = function (babel) {
    var matchers = patterns.map(function (pattern) {
        return escallmatch(pattern, { visitorKeys: babel.types.VISITOR_KEYS });
    });

    return new babel.Transformer('babel-plugin-unassert', {
        CallExpression: {
            enter: function (currentNode, parentNode, scope, file) {
                if (matchers.some(matches(currentNode))) {
                    this.dangerouslyRemove();
                }
            }
        }
    });
};
