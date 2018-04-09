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
    testTransform('node_assert_api');
    testTransform('conditional');
    testTransform('cjs');
    testTransform('cjs_singlevar');
    testTransform('cjs_powerassert');
    testTransform('cjs_assignment');
    testTransform('cjs_assignment_singlevar');
    testTransform('es6module');
    testTransform('es6module_powerassert');
    testTransform('es6module_namespece');
    testTransform('not_an_expression_statement');
});

describe('babel-plugin-unassert with presets', function () {
    var opt = { presets: ['es2015'] };
    testTransform('node_assert_api', opt);
    testTransform('conditional', opt);
    testTransform('cjs', opt);
    testTransform('cjs_singlevar', opt);
    testTransform('cjs_powerassert', opt);
    testTransform('cjs_assignment', opt);
    testTransform('cjs_assignment_singlevar', opt, 'presets-es2015');
    testTransform('es6module', opt);
    testTransform('es6module_powerassert', opt);
    testTransform('es6module_namespece', opt);
    testTransform('not_an_expression_statement', opt);
});
