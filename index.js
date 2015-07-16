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
var espurify = require('espurify');
var deepEqual = require('deep-equal');
var extend = require('xtend');
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

var declarationPatterns = [
    'import assert from "assert"',
    'var assert = require("assert")',
    'import assert from "power-assert"',
    'var assert = require("power-assert")'
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

    var declarationHandlers = (function () {
        var blacklist = {
            ImportDeclaration: [],
            VariableDeclarator: []
        };
        declarationPatterns.forEach(function (dcl) {
            var ast = babel.parse(dcl, {sourceType: 'module'});
            var body0 = ast.program.body[0];
            if (body0.type === 'VariableDeclaration') {
                // pick VariableDeclarator up
                blacklist.VariableDeclarator.push(espurify(body0.declarations[0]));
            } else if (body0.type === 'ImportDeclaration') {
                blacklist.ImportDeclaration.push(espurify(body0));
            }
        });
        return Object.keys(blacklist).reduce(function (handlers, key) {
            handlers[key] = {
                enter: function (currentNode, parentNode, scope, file) {
                    if (blacklist[key].some(function (node) { return deepEqual(espurify(currentNode), node); })) {
                        this.dangerouslyRemove();
                    }
                }
            };
            return handlers;
        }, {});
    })();

    return new babel.Transformer('babel-plugin-unassert', extend(declarationHandlers, {
        CallExpression: {
            enter: function (currentNode, parentNode, scope, file) {
                if (matchers.some(matches(currentNode))) {
                    this.dangerouslyRemove();
                }
            }
        }
    }));
};
