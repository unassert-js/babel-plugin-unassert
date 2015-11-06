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
                    var arg = right.get('arguments')[0];
                    if (isRequireAssert(callee, arg)) {
                        nodePath.remove();
                    }
                }
            },
            VariableDeclarator: {
                enter: function (nodePath, pluginPass) {
                    var id = nodePath.get('id');
                    if (!id.isIdentifier()) {
                        return;
                    }
                    if (!id.equals('name', 'assert')) {
                        return;
                    }
                    var init = nodePath.get('init');
                    if (!init.isCallExpression()) {
                        return;
                    }
                    var callee = init.get('callee');
                    var arg = init.get('arguments')[0];
                    if (isRequireAssert(callee, arg)) {
                        nodePath.remove();
                    }
                }
            },
            ImportDeclaration: {
                enter: function (nodePath, pluginPass) {
                    var source = nodePath.get('source');
                    if (!(source.equals('value', 'assert') || source.equals('value', 'power-assert'))) {
                        return;
                    }
                    var firstSpecifier = nodePath.get('specifiers')[0];
                    if (!firstSpecifier.isImportDefaultSpecifier()) {
                        return;
                    }
                    var local = firstSpecifier.get('local');
                    if (local.equals('name', 'assert')) {
                        nodePath.remove();
                    }
                }
            },
            CallExpression: {
                enter: function (nodePath, pluginPass) {
                    var callee = nodePath.get('callee');
                    if ((callee.isIdentifier() && callee.equals('name', 'assert'))
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

function isRequireAssert (callee, arg) {
    if (!callee.isIdentifier() || !callee.equals('name', 'require')) {
        return false;
    }
    return (arg.isLiteral() && (arg.equals('value', 'assert') || arg.equals('value', 'power-assert')));
}
