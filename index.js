/**
 * babel-plugin-unassert
 *   Babel plugin to encourage Design by Contract (DbC)
 *   by writing assertions in production code, and compiling them away from release.
 * 
 * https://github.com/twada/babel-plugin-unassert
 *
 * Copyright (c) 2015 Takuto Wada
 * Licensed under the MIT license.
 *   http://twada.mit-license.org/
 */
'use strict';

module.exports = function (babel) {
    var t = babel.types;
    return {
        visitor: {
            CallExpression: {
                enter: function (nodePath, pluginPass) {
                    var callee = nodePath.get('callee');
                    if ((callee.isIdentifier() && callee.node.name === 'assert')
                        || callee.matchesPattern('assert', true)
                        || callee.matchesPattern('console.assert')
                       ) {
                           nodePath.remove();
                       }
                }
            }
        }
    };
};
