'use strict';

delete require.cache[require.resolve('..')];
var unassert = require('..');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var babel = require('@babel/core');

function testTransform (fixtureName, options) {
  it(fixtureName, function () {
    options = options || {};
    var sourceType = options.sourceType || 'script';
    var extension = sourceType === 'module' ? 'mjs' : 'js';
    var dialect = options.dialect ? '-presets-' + options.dialect : '';
    var fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'fixture' + '.' + extension);
    var expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, 'expected' + dialect + '.' + extension);
    var result = babel.transformFileSync(fixtureFilepath, Object.assign({
      sourceType: sourceType,
      plugins: [ unassert ]
    }, options.babelOptions));
    var actual = result.code;
    var expected = fs.readFileSync(expectedFilepath).toString();
    assert.strictEqual(actual + '\n', expected);
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
  var opt = { babelOptions: { presets: ['@babel/env'] } };
  testTransform('node_assert_api', opt);
  testTransform('conditional', opt);
  testTransform('cjs', opt);
  testTransform('cjs_strictmode', opt);
  testTransform('cjs_singlevar', opt);
  testTransform('cjs_singlevar_strictmode', opt);
  testTransform('cjs_powerassert', opt);
  testTransform('cjs_powerassert_strictmode', opt);
  testTransform('cjs_assignment', opt);
  testTransform('cjs_assignment_singlevar', Object.assign({}, opt, { dialect: 'env' }));
  testTransform('cjs_assignment_strictmode', Object.assign({}, opt, { dialect: 'env' }));
  testTransform('esm_default_binding', Object.assign({}, opt, { dialect: 'env', sourceType: 'module' }));
  testTransform('esm_default_binding_powerassert', Object.assign({}, opt, { dialect: 'env', sourceType: 'module' }));
  testTransform('esm_namespace_import', Object.assign({}, opt, { dialect: 'env', sourceType: 'module' }));
  testTransform('not_an_expression_statement', opt);
});
