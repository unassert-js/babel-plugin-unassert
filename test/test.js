'use strict';

delete require.cache[require.resolve('..')];
const unassert = require('..');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const testTransform = (fixtureName, options) => {
  it(fixtureName, () => {
    options = options || {};
    const sourceType = options.sourceType || 'script';
    const extension = sourceType === 'module' ? 'mjs' : 'js';
    const dialect = options.dialect ? `-presets-${options.dialect}` : '';
    const fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, `fixture.${extension}`);
    const expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, `expected${dialect}.${extension}`);
    const result = babel.transformFileSync(fixtureFilepath, Object.assign({
      sourceType: sourceType,
      plugins: [ unassert ]
    }, options.babelOptions));
    const actual = result.code;
    const expected = fs.readFileSync(expectedFilepath).toString();
    assert.strictEqual(actual + '\n', expected);
  });
};

describe('babel-plugin-unassert', () => {
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

describe('babel-plugin-unassert with presets', () => {
  const opt = { babelOptions: { presets: ['@babel/env'] } };
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
