babel-plugin-unassert
================================

[Babel](http://babeljs.io/) plugin to remove assertions on build.

Encourages Design by Contract (DbC). Use assertions in production code! Write more assertions!

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

You will see assert calls disappear.

```javascript
'use strict';

function add(a, b) {
    return a + b;
}
```


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
