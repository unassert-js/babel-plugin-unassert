babel-plugin-unassert
================================

[Babel](https://babeljs.io/) plugin for unassert: Encourages [programming with assertions](https://en.wikipedia.org/wiki/Assertion_(software_development)) by providing tools to compile them away.

[![unassert][unassert-banner]][unassert-url]

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Code Style][style-image]][style-url]
[![License][license-image]][license-url]

babel-plugin-unassert removes assertions on build. So you can use assertions to declare preconditions, postconditions and invariants.


#### RELATED MODULES

- [unassert](https://github.com/unassert-js/unassert): Encourages programming with assertions by providing tools to compile them away.
- [unassertify](https://github.com/unassert-js/unassertify): Browserify transform for unassert
- [webpack-unassert-loader](https://github.com/unassert-js/webpack-unassert-loader): Webpack loader for unassert
- [gulp-unassert](https://github.com/unassert-js/gulp-unassert): Gulp plugin for unassert
- [unassert-cli](https://github.com/unassert-js/unassert-cli): CLI for unassert


INSTALL
---------------------------------------

```
$ npm install --save-dev babel-plugin-unassert
```


CAUTION
---------------------------------------

Babel7 is incompatible with Babel6. Babel6 is incompatible with Babel5.

For Babel6, you need to use 2.x release of babel-plugin-unassert.

```
$ npm install --save-dev babel-plugin-unassert@2
```

For Babel 5 or lower, you need to use the 1.x release of babel-plugin-unassert.

```
$ npm install --save-dev babel-plugin-unassert@1
```


HOW TO USE
---------------------------------------


### via [.babelrc.js](https://babeljs.io/docs/en/configuration#babelrcjs)

```javascript
const presets = ['@babel/env'];
const plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins.push('babel-plugin-unassert');
}

module.exports = { presets, plugins };
```

```
$ babel /path/to/src/target.js > /path/to/build/target.js
```


### via [@babel/cli](https://babeljs.io/docs/en/babel-cli)

```
$ babel --plugins babel-plugin-unassert /path/to/src/target.js > /path/to/build/target.js
```


### via [@babel/core](https://babeljs.io/docs/en/babel-core/)

```javascript
const babel = require('@babel/core');
const transformed = babel.transformFileSync('/path/to/src/target.js', {
  presets: ['@babel/env'],
  plugins: ['babel-plugin-unassert']
});
console.log(transformed.code);
```


EXAMPLE
---------------------------------------

For given `math.js` below,

```javascript
'use strict';

const assert = require('assert');

function add (a, b) {
  console.assert(typeof a === 'number');
  assert(!isNaN(a));
  assert.equal(typeof b, 'number');
  assert.ok(!isNaN(b));
  return a + b;
}
```

Run `babel-cli` with `--plugins babel-plugin-unassert` option to transform.

```
$ babel --plugins babel-plugin-unassert /path/to/demo/math.js > /path/to/build/math.js
```

You will see assert calls and declarations disappear.

```javascript
'use strict';

function add(a, b) {
  return a + b;
}
```


#### ES6 module and power-assert support

babel-plugin-unassert supports ES6 module syntax and [power-assert](https://github.com/power-assert-js/power-assert).

For given [babel.config.js](https://babeljs.io/docs/en/configuration#babelconfigjs),

```javascript
module.exports = function (api) {
  const presets = ['@babel/env'];
  const plugins = [];

  if (api.env(['development', 'test'])) {
    presets.push('babel-preset-power-assert');
  }

  if (api.env('production')) {
    plugins.push('babel-plugin-unassert');
  }

  return {
    presets,
    plugins
  };
};
```

and production code below,

```javascript
import assert from 'assert';

class Calc {
  add (a, b) {
    assert(!(isNaN(a) || isNaN(b)));
    assert(typeof a === 'number');
    assert(typeof b === 'number');
    return a + b;
  }
}
```

then it becomes in production,

```javascript
'use strict';

class Calc {
  add(a, b) {
    return a + b;
  }
}
```

and in development, produces power-assert messages like below

```
AssertionError:   # example.js:5

  assert(!(isNaN(a) || isNaN(b)))
         | |     |  |  |     |
         | |     |  |  true  NaN
         | false 3  true
         false
```


SUPPORTED PATTERNS
---------------------------------------

Assertion expressions are removed when they match patterns below. In other words, babel-plugin-unassert removes assertion calls that are compatible with Node.js standard [assert](https://nodejs.org/api/assert.html) API (and `console.assert`).

* `assert(value, [message])`
* `assert.ok(value, [message])`
* `assert.equal(actual, expected, [message])`
* `assert.notEqual(actual, expected, [message])`
* `assert.strictEqual(actual, expected, [message])`
* `assert.notStrictEqual(actual, expected, [message])`
* `assert.deepEqual(actual, expected, [message])`
* `assert.notDeepEqual(actual, expected, [message])`
* `assert.deepStrictEqual(actual, expected, [message])`
* `assert.notDeepStrictEqual(actual, expected, [message])`
* `assert.fail([message])`
* `assert.fail(actual, expected, message, operator)`
* `assert.throws(block, [error], [message])`
* `assert.doesNotThrow(block, [message])`
* `assert.rejects(asyncFn, [error], [message])`
* `assert.doesNotReject(asyncFn, [error], [message])`
* `assert.ifError(value)`
* `console.assert(value, [message])`

babel-plugin-unassert also removes assert variable declarations such as,

* `const assert = require("assert")`
* `const assert = require("assert").strict`
* `const assert = require("power-assert")`
* `const assert = require("power-assert").strict`
* `import assert from "assert"`
* `import assert from "power-assert"`

and assignments.

* `assert = require("assert")`
* `assert = require("assert").strict`
* `assert = require("power-assert")`
* `assert = require("power-assert").strict`


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


OUR SUPPORT POLICY
---------------------------------------

We support Node under maintenance. In other words, we stop supporting old Node version when [their maintenance ends](https://github.com/nodejs/LTS).

This means that any other environment is not supported.

NOTE: If babel-plugin-unassert works in any of the unsupported environments, it is purely coincidental and has no bearing on future compatibility. Use at your own risk.


LICENSE
---------------------------------------
Licensed under the [MIT](https://github.com/unassert-js/babel-plugin-unassert/blob/master/LICENSE) license.


[unassert-url]: https://github.com/unassert-js/unassert
[unassert-banner]: https://raw.githubusercontent.com/unassert-js/unassert-js-logo/master/banner/banner-official-fullcolor.png

[npm-url]: https://npmjs.org/package/babel-plugin-unassert
[npm-image]: https://badge.fury.io/js/babel-plugin-unassert.svg

[travis-url]: https://travis-ci.org/unassert-js/babel-plugin-unassert
[travis-image]: https://secure.travis-ci.org/unassert-js/babel-plugin-unassert.svg?branch=master

[style-url]: https://github.com/Flet/semistandard
[style-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg

[license-url]: https://github.com/unassert-js/babel-plugin-unassert/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
