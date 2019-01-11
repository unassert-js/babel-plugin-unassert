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
        var sourceType = options.sourceType || 'script';
        var extension = sourceType === 'module' ? 'mjs' : 'js';
        var dialect = options.dialect ? '-presets-' + options.dialect : '';
        var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture' + '.' + extension);
        var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected' + dialect + '.' + extension);
        var result = babel.transformFileSync(fixtureFilepath, extend({
            sourceType: sourceType,
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
    testTransform('cjs_strictmode');
    testTransform('cjs_singlevar');
    testTransform('cjs_singlevar_strictmode');
    testTransform('cjs_powerassert');
    testTransform('cjs_powerassert_strictmode');
    testTransform('cjs_assignment');
    testTransform('cjs_assignment_singlevar');
    testTransform('cjs_assignment_strictmode');
    testTransform('esm_default_binding', { sourceType: 'module' });
    testTransform('esm_default_binding_powerassert', { sourceType: 'module' });
    testTransform('esm_namespace_import', { sourceType: 'module' });
    testTransform('not_an_expression_statement');
});

describe('babel-plugin-unassert with presets', function () {
    var opt = { babelOptions: { presets: ['es2015'] }};
    testTransform('node_assert_api', opt);
    testTransform('conditional', opt);
    testTransform('cjs', opt);
    testTransform('cjs_strictmode', opt);
    testTransform('cjs_singlevar', opt);
    testTransform('cjs_singlevar_strictmode', opt);
    testTransform('cjs_powerassert', opt);
    testTransform('cjs_powerassert_strictmode', opt);
    testTransform('cjs_assignment', opt);
    testTransform('cjs_assignment_singlevar', extend(opt, { dialect: 'es2015' }));
    testTransform('cjs_assignment_strictmode', extend(opt, { dialect: 'es2015' }));
    testTransform('esm_default_binding', extend(opt, { dialect: 'es2015', sourceType: 'module' }));
    testTransform('esm_default_binding_powerassert', extend(opt, { dialect: 'es2015', sourceType: 'module' }));
    testTransform('esm_namespace_import', extend(opt, { dialect: 'es2015', sourceType: 'module' }));
    testTransform('not_an_expression_statement', opt);
});
