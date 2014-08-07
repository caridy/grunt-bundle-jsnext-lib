/* jshint node:true, undef:true, unused:true */

var libpath = require('path');
var libfs = require('fs');
var libmodule = require('module');
var ModuleClass = require('es6-module-transpiler/lib/module');
var recast = require('recast');
var types = recast.types;
var b = types.builders;

/**
 * Provides resolution of npm modules with `jsnext:main` directive from module import sources.
 *
 * @constructor
 */
function FileResolver(paths) {
  this.rootPath = (paths && paths.length ? paths[0] : process.cwd()); // top level module in the npm tree
}

/**
 * Resolves `importedPath` imported by the given module `fromModule` to a
 * npm module.
 *
 * @param {string} importedPath
 * @param {?Module} fromModule
 * @param {Container} container
 * @return {?Module}
 */
FileResolver.prototype.resolveModule = function(importedPath, fromModule, container) {
  if (importedPath.charAt(0) !== '.') {
    console.log('INFO: NPM module detected: "%s"', importedPath);
    var resolvedPath = this.resolvePath(importedPath, fromModule);
    if (resolvedPath) {
      var cachedModule = container.getCachedModule(resolvedPath);
      if (cachedModule) {
        return cachedModule;
      } else {
        console.log('INFO: NPM module found at: "%s"', resolvedPath);
        var mod = new ModuleClass(resolvedPath, importedPath, container);
        var exportIdentifiers = Object.getOwnPropertyNames(require(resolvedPath)).map(function (name) {
          return b.variableDeclarator(b.identifier(name), null);
        });
        mod.ast = {program: b.program([
          b.exportDeclaration(true,  b.functionExpression(b.identifier('default'), [], b.blockStatement([])), [], null),
          b.exportDeclaration(false, b.variableDeclaration('var', exportIdentifiers), [], null)
        ]), type: 'file'};
        mod.external = true;
        return mod;
      }
    }
  }
  return null;
};

/**
 * Resolves `importedPath` against the importing module `fromModule`, if given,
 * within this resolver's paths.
 *
 * @private
 * @param {string} importedModuleName
 * @param {?Module} fromModule
 * @return {string}
 */
FileResolver.prototype.resolvePath = function(importedModuleName, fromModule) {
  var main,
    parentPackagePath = this.resolvePackage(fromModule ? fromModule.path : this.rootPath);

  if (!parentPackagePath) {
    console.error('ERROR: Parent module not found for: "%s"', importedModuleName);
    return null;
  }

  try {
    main = libmodule._resolveFilename(importedModuleName, libmodule._cache[parentPackagePath]);
  } catch (e1) {
    console.error('ERROR: Lookup fails for module "%s" from "%s"', importedModuleName, parentPackagePath);
    return null;
  }

  return main;
};

/**
 * Resolves the fullpath to the nearest `package.json` for a given module path.
 *
 * @private
 * @param {string} modulePath
 * @return {string}
 */
FileResolver.prototype.resolvePackage = function(modulePath) {
  var paths = libmodule._nodeModulePaths(libpath.dirname(modulePath)),
    i, p;

  for (i = 0; i < paths.length; i++) {
    p = libpath.resolve(paths[i], '../package.json');
    if (libfs.existsSync(p)) {
      require(p);
      return p;
    }
  }

  return null;
};

module.exports = FileResolver;
