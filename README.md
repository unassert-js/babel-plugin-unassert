babel-plugin-unassert
================================

[Babel](http://babeljs.io/) plugin to encourage Design by Contract (DbC) by writing assertions in production code, and compiling them away from release.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]

babel-plugin-unassert removes assertions on build. So you can use assertions to declare preconditions, postconditions and invariants.


#### RELATED MODULES

- [unassert](https://github.com/twada/unassert): Encourage Design by Contract (DbC) by writing assertions in production code, and compiling them away from release
- [unassertify](https://github.com/twada/unassertify): Browserify transform to encourage Design by Contract (DbC) by writing assertions in production code, and compiling them away from release
- [webpack-unassert-loader](https://github.com/zoncoen/webpack-unassert-loader): A webpack loader to remove assertions on production build


INSTALL
---------------------------------------

```
$ npm install --save-dev babel-plugin-unassert
```


CAUTION
---------------------------------------

For Babel 5 or lower, you need to use the 1.2.x release of babel-plugin-unassert.

```
$ npm install --save-dev babel-plugin-unassert@1.2.0
```


HOW TO USE
---------------------------------------


### via [Babel CLI](http://babeljs.io/docs/usage/cli/)

```
$ babel --plugins babel-plugin-unassert /path/to/src/target.js > /path/to/build/target.js
```

or shortly,

```
$ babel --plugins unassert /path/to/src/target.js > /path/to/build/target.js
```


### via [Babel API](http://babeljs.io/docs/usage/api/)

```javascript
var babel = require('babel-core');
var jsCode = fs.readFileSync('/path/to/src/target.js');
var transformed = babel.transform(jsCode, {
    plugins: ['babel-plugin-unassert']
});
console.log(transformed.code);
```


### via [.babelrc](http://babeljs.io/docs/usage/babelrc/)

```javascript
{
  "env": {
    "production": {
      "plugins": [
        "babel-plugin-unassert"
      ]
    }
  }
}
```

```
$ babel /path/to/src/target.js > /path/to/build/target.js
```


EXAMPLE
---------------------------------------

For given `math.js` below,

```javascript
'use strict';

var assert = require('assert');

function add (a, b) {
    console.assert(typeof a === 'number');
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.ok(!isNaN(b));
    return a + b;
}
```

Run `babel` with `--plugins unassert` to transform tests.

```
$ babel --plugins unassert /path/to/demo/math.js > /path/to/build/math.js
```

You will see assert calls and declarations disappear.

```javascript
'use strict';

function add(a, b) {
    return a + b;
}
```


#### ES6 module and power-assert support

babel-plugin-unassert supports ES6 module syntax and [power-assert](http://github.com/power-assert-js/power-assert).

with [.babelrc](http://babeljs.io/docs/usage/babelrc/),

```javascript
{
  "presets": [
    ...
  ],
  "env": {
    "development": {
      "plugins": [
        "babel-plugin-espower"
      ],
    },
    "production": {
      "plugins": [
        "babel-plugin-unassert"
      ]
    }
  }
}
```

production code below

```javascript
import assert from 'power-assert';

class Calc {
    add (a, b) {
        assert(!(isNaN(a) || isNaN(b)));
        assert(typeof a === 'number');
        assert(typeof b === 'number');
        return a + b;
    }
}
```

becomes

```javascript
'use strict';

class Calc {
    add(a, b) {
        return a + b;
    }
}
```

in production, and produces power-assert messages like

```
AssertionError:   # example.js:5

  assert(!(isNaN(a) || isNaN(b)))
         | |     |  |  |     |
         | |     |  |  true  NaN
         | false 3  true
         false
```

in development.


SUPPORTED PATTERNS
---------------------------------------

Assertion expressions are removed when they match patterns below. In other words, babel-plugin-unassert removes assertion calls that are compatible with Node.js standard [assert](http://nodejs.org/api/assert.html) API (and `console.assert`).

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
* `assert.fail(actual, expected, message, operator)`
* `assert.throws(block, [error], [message])`
* `assert.doesNotThrow(block, [message])`
* `assert.ifError(value)`
* `console.assert(value, [message])`

babel-plugin-unassert also removes assert variable declarations,

* `var assert = require("assert")`
* `var assert = require("power-assert")`
* `import assert from "assert"`
* `import assert from "power-assert"`

and assignments.

* `assert = require("assert")`
* `assert = require("power-assert")`


AUTHOR
---------------------------------------
* [Takuto Wada](http://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](http://twada.mit-license.org/) license.


[npm-url]: https://npmjs.org/package/babel-plugin-unassert
[npm-image]: https://badge.fury.io/js/babel-plugin-unassert.svg

[travis-url]: http://travis-ci.org/twada/babel-plugin-unassert
[travis-image]: https://secure.travis-ci.org/twada/babel-plugin-unassert.svg?branch=master

[depstat-url]: https://gemnasium.com/twada/babel-plugin-unassert
[depstat-image]: https://gemnasium.com/twada/babel-plugin-unassert.svg

[license-url]: http://twada.mit-license.org/
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg
