/**
 * babel-plugin-unassert
 *   Babel plugin for unassert
 *     Encourages programming with assertions by providing tools to compile them away.
 *
 * https://github.com/unassert-js/babel-plugin-unassert
 *
 * Copyright (c) 2015-2021 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/unassert-js/babel-plugin-unassert/blob/master/LICENSE
 */
'use strict';

const isRequireAssert = (id, init) => {
  if (!id.isIdentifier()) {
    return false;
  }
  if (!id.equals('name', 'assert')) {
    return false;
  }
  if (!init.isCallExpression()) {
    return false;
  }
  const callee = init.get('callee');
  if (!callee.isIdentifier() || !callee.equals('name', 'require')) {
    return false;
  }
  const arg = init.get('arguments')[0];
  return (arg.isLiteral() && (arg.equals('value', 'assert') || arg.equals('value', 'power-assert') || arg.equals('value', 'node:assert')));
};

const isRequireAssertStrict = (id, init) => {
  if (!init.isMemberExpression()) {
    return false;
  }
  if (!isRequireAssert(id, init.get('object'))) {
    return false;
  }
  const prop = init.get('property');
  if (!prop.isIdentifier()) {
    return false;
  }
  return prop.equals('name', 'strict');
};

const isRemovalTarget = (id, init) => isRequireAssert(id, init) || isRequireAssertStrict(id, init);

module.exports = (babel) => {
  return {
    visitor: {
      AssignmentExpression (nodePath, pluginPass) {
        if (!nodePath.equals('operator', '=')) {
          return;
        }
        if (isRemovalTarget(nodePath.get('left'), nodePath.get('right'))) {
          nodePath.remove();
        }
      },
      VariableDeclarator (nodePath, pluginPass) {
        if (isRemovalTarget(nodePath.get('id'), nodePath.get('init'))) {
          nodePath.remove();
        }
      },
      ImportDeclaration (nodePath, pluginPass) {
        const source = nodePath.get('source');
        if (!(source.equals('value', 'assert') || source.equals('value', 'power-assert') || source.equals('value', 'node:assert'))) {
          return;
        }
        const firstSpecifier = nodePath.get('specifiers')[0];
        if (!(firstSpecifier.isImportDefaultSpecifier() || firstSpecifier.isImportNamespaceSpecifier() || firstSpecifier.isImportSpecifier())) {
          return;
        }
        const local = firstSpecifier.get('local');
        if (local.equals('name', 'assert')) {
          nodePath.remove();
        }
      },
      CallExpression (nodePath, pluginPass) {
        const callee = nodePath.get('callee');
        if ((callee.isIdentifier() && callee.equals('name', 'assert')) ||
              callee.matchesPattern('assert', true) ||
              callee.matchesPattern('console.assert')) {
          if (nodePath.parentPath && nodePath.parentPath.isExpressionStatement()) {
            nodePath.remove();
          }
        }
      }
    }
  };
};
