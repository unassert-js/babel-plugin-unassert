'use strict';

delete require.cache[require.resolve('..')];
var unassert = require('..');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var extend = require('xtend');

function testTransform (fixtureName, options) {
    it(fixtureName, function () {
        options = options || {};
        var suffix = options.suffix || 'js';
        var dialect = options.dialect ? '-presets-' + options.dialect : '';
        var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture' + '.' + suffix);
        var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected' + dialect + '.' + suffix);
        var result = babel.transformFileSync(fixtureFilepath, extend({
            plugins: [ unassert ]
        }, options.babelOptions));
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
    testTransform('esm_default_binding', { suffix: 'mjs' });
    testTransform('esm_default_binding_powerassert', { suffix: 'mjs' });
    testTransform('esm_namespace_import', { suffix: 'mjs' });
    testTransform('not_an_expression_statement');
});

describe('babel-plugin-unassert with presets', function () {
    var opt = { babelOptions: { presets: ['es2015'] }};
    testTransform('node_assert_api', opt);
    testTransform('conditional', opt);
    testTransform('cjs', opt);
    testTransform('cjs_singlevar', opt);
    testTransform('cjs_powerassert', opt);
    testTransform('cjs_assignment', opt);
    testTransform('cjs_assignment_singlevar', extend(opt, { dialect: 'es2015' }));
    testTransform('esm_default_binding', extend(opt, { dialect: 'es2015', suffix: 'mjs' }));
    testTransform('esm_default_binding_powerassert', extend(opt, { dialect: 'es2015', suffix: 'mjs' }));
    testTransform('esm_namespace_import', extend(opt, { dialect: 'es2015', suffix: 'mjs' }));
    testTransform('not_an_expression_statement', opt);
});
