'use strict';

delete require.cache[require.resolve('..')];
const unassert = require('..');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const testTransform = (fixtureName, unassertOptions) => {
  it(fixtureName, () => {
    unassertOptions = unassertOptions || {};
    const fixtureFilepath = path.resolve(__dirname, 'fixtures', fixtureName, `fixture.js`);
    const expectedFilepath = path.resolve(__dirname, 'fixtures', fixtureName, `expected.js`);
    const result = babel.transformFileSync(fixtureFilepath, {
      plugins: [
        [unassert, unassertOptions]
      ]
    });
    const actual = result.code;
    const expected = fs.readFileSync(expectedFilepath).toString();
    assert.strictEqual(actual + '\n', expected);
  });
};

describe('customization option', () => {
  testTransform('customization', {
    variables: [
      'invariant',
      'nassert',
      'uassert'
    ],
    modules: [
      'invariant',
      'nanoassert',
      'uvu/assert'
    ]
  });
});
