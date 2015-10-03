babel-plugin-unassert
================================

[Babel](http://babeljs.io/) plugin to encourage Design by Contract (DbC).

babel-plugin-unassert removes assertions on build. So you can use assertions to declare preconditions, postconditions and invariants.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]


#### RELATED MODULES

- [unassert](https://github.com/twada/unassert): Remove assertions from AST
- [unassertify](https://github.com/twada/unassertify): Browserify transform to remove assertions on production build
- [webpack-unassert-loader](https://github.com/zoncoen/webpack-unassert-loader): A webpack loader to remove assertions on production build


INSTALL
---------------------------------------

```
$ npm install --save-dev babel-plugin-unassert
```


HOW TO USE
---------------------------------------


### via [Babel CLI](http://babeljs.io/docs/usage/cli/)

```
$ $(npm bin)/babel --plugins babel-plugin-unassert /path/to/src/target.js > /path/to/build/target.js
```

or shortly,

```
$ $(npm bin)/babel --plugins unassert /path/to/src/target.js > /path/to/build/target.js
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
$ $(npm bin)/babel --plugins unassert /path/to/demo/math.js > /path/to/build/math.js
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

```javascript
'use strict';

import assert from 'power-assert';

function add (a, b) {
    assert(!isNaN(a));
    assert.equal(typeof b, 'number');
    assert.ok(!isNaN(b));
    return a + b;
}
```

becomes

```javascript
'use strict';

function add(a, b) {
    return a + b;
}
```


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
