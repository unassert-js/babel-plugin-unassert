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
            AssignmentExpression: {
                enter: function (nodePath, pluginPass) {
                    if (!nodePath.equals('operator', '=')) {
                        return;
                    }
                    var left = nodePath.get('left');
                    var right = nodePath.get('right');
                    if (!left.isIdentifier()) {
                        return;
                    }
                    if (!right.isCallExpression()) {
                        return;
                    }
                    var callee = right.get('callee');
                    if (!(callee.isIdentifier() || callee.node.name !== 'require')) {
                        return;
                    }
                    var arg = right.get('arguments')[0];
                    if (arg.isLiteral() && (arg.node.value === 'assert' || arg.node.value === 'power-assert')) {
                        nodePath.remove();
                    }
                }
            },
            VariableDeclarator: {
                enter: function (nodePath, pluginPass) {
                    if (!nodePath.get('id').isIdentifier()) {
                        return;
                    }
                    if (nodePath.get('id').node.name !== 'assert') {
                        return;
                    }
                    if (!nodePath.get('init').isCallExpression()) {
                        return;
                    }
                    var callee = nodePath.get('init').get('callee');
                    if (!(callee.isIdentifier() || callee.node.name !== 'require')) {
                        return;
                    }
                    var arg = nodePath.get('init').get('arguments')[0];
                    if (arg.isLiteral() && (arg.node.value === 'assert' || arg.node.value === 'power-assert')) {
                        nodePath.remove();
                    }
                }
            },
            ImportDeclaration: {
                enter: function (nodePath, pluginPass) {
                    var moduleName = nodePath.get('source').node.value;
                    if (moduleName !== 'assert' && moduleName !== 'power-assert') {
                        return;
                    }
                    var firstSpecifier = nodePath.get('specifiers')[0];
                    if (!t.isImportDefaultSpecifier(firstSpecifier)) {
                        return;
                    }
                    if (firstSpecifier.get('local').node.name === 'assert') {
                        nodePath.remove();
                    }
                }
            },
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
