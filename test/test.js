'use strict';

delete require.cache[require.resolve('..')];
var unassert = require('..');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var extend = require('xtend');

function testTransform (fixtureName, extraOptions, extraSuffix) {
    it(fixtureName, function () {
        var suffix = extraSuffix ? '-' + extraSuffix : '';
        var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture.js');
        var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected' + suffix + '.js');
        var result = babel.transformFileSync(fixtureFilepath, extend({
            plugins: [ unassert ]
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
    testTransform('assignment');
    testTransform('assignment_singlevar');
});

describe('babel-plugin-unassert with presets', function () {
    var opt = { presets: ['es2015'] };
    testTransform('func', opt);
    testTransform('commonjs', opt);
    testTransform('commonjs_singlevar', opt);
    testTransform('es6module', opt);
    testTransform('commonjs_powerassert', opt);
    testTransform('es6module_powerassert', opt);
    testTransform('assignment', opt);
    testTransform('assignment_singlevar', opt, 'presets-es2015');
});
