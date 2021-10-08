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

module.exports = (babel, options) => {
  const config = Object.assign({
    variables: [
      'assert'
    ],
    modules: [
      'assert',
      'power-assert',
      'node:assert'
    ]
  }, options);

  function isAssertionModuleName (lit) {
    const modules = config.modules;
    return modules.some((name) => lit.equals('value', name));
  }

  function isAssertionVariableName (id) {
    const variables = config.variables;
    return variables.some((name) => id.equals('name', name));
  }

  function isAssertionMethod (callee) {
    const variables = config.variables;
    return variables.some((name) => callee.matchesPattern(name, true));
  }

  function isAssertionFunction (callee) {
    return callee.isIdentifier() && isAssertionVariableName(callee);
  }

  const isRequireAssert = (id, init) => {
    if (!id.isIdentifier()) {
      return false;
    }
    if (!isAssertionVariableName(id)) {
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
    return (arg.isLiteral() && isAssertionModuleName(arg));
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
        if (!(isAssertionModuleName(source))) {
          return;
        }
        const firstSpecifier = nodePath.get('specifiers')[0];
        if (!(firstSpecifier.isImportDefaultSpecifier() || firstSpecifier.isImportNamespaceSpecifier() || firstSpecifier.isImportSpecifier())) {
          return;
        }
        const local = firstSpecifier.get('local');
        if (isAssertionVariableName(local)) {
          nodePath.remove();
        }
      },
      CallExpression (nodePath, pluginPass) {
        const callee = nodePath.get('callee');
        if (isAssertionFunction(callee) || isAssertionMethod(callee) || callee.matchesPattern('console.assert')) {
          if (nodePath.parentPath && nodePath.parentPath.isExpressionStatement()) {
            nodePath.remove();
          }
        }
      }
    }
  };
};
