/**
 * babel-plugin-unassert
 *   Babel plugin to encourage reliable programming
 *   by writing assertions in production code, and compiling them away from release.
 * 
 * https://github.com/unassert-js/babel-plugin-unassert
 *
 * Copyright (c) 2015-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/unassert-js/babel-plugin-unassert/blob/master/LICENSE
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
                    if (isRequireAssert(nodePath.get('left'), nodePath.get('right'))) {
                        nodePath.remove();
                    }
                }
            },
            VariableDeclarator: {
                enter: function (nodePath, pluginPass) {
                    if (isRequireAssert(nodePath.get('id'), nodePath.get('init'))) {
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
                    if (!(firstSpecifier.isImportDefaultSpecifier() || firstSpecifier.isImportNamespaceSpecifier())) {
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
                           // TODO: this conditional could be removed since babel 6.11.4 has introduced a removal hook
                           // https://github.com/babel/babel/releases/tag/v6.11.4
                           if (nodePath.parentPath
                               && nodePath.parentPath.isExpressionStatement()
                               && nodePath.parentPath.parentPath) {
                               if (nodePath.parentPath.parentPath.isBlockStatement()) {
                                   nodePath.remove();
                               } else {
                                   nodePath.replaceWith(babel.types.emptyStatement());
                               }
                           }
                       }
                }
            }
        }
    };
};

function isRequireAssert (id, init) {
    if (!id.isIdentifier()) {
        return false;
    }
    if (!id.equals('name', 'assert')) {
        return false;
    }
    if (!init.isCallExpression()) {
        return false;
    }
    var callee = init.get('callee');
    if (!callee.isIdentifier() || !callee.equals('name', 'require')) {
        return false;
    }
    var arg = init.get('arguments')[0];
    return (arg.isLiteral() && (arg.equals('value', 'assert') || arg.equals('value', 'power-assert')));
}
