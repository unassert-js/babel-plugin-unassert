'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel');
var extend = require('xtend');

function testTransform (fixtureName, extraOptions) {
    it(fixtureName, function () {
        var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js');
        var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected.js');
        var result = babel.transformFileSync(fixtureFilepath, extend({
            plugins: ['../index']
        }, extraOptions));
        var actual = result.code;
        var expected = fs.readFileSync(expectedFilepath).toString();
        assert.equal(actual + '\n', expected);
    });
}

describe('babel-plugin-unassert', function () {
    testTransform('func');
    testTransform('commonjs');
    testTransform('commonjs_singlevar');
    testTransform('es6module');
    testTransform('commonjs_powerassert');
    testTransform('es6module_powerassert');
});
