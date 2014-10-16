/* jshint node:true, undef:true, unused:true */

var esprima = require('esprima-fb');
var recast = require('recast');
var libpath = require('path');
var ModuleClass = require('es6-module-transpiler/lib/module');

var wrapperSource = [
  "import {<binding> as m} from '<path>';",
  "this['<namespace>'] = m;",
].join('\n');

/**
 * Provides resolution of `global-wrapper` module, which is a synthetic module to export
 * into a library that works as global.
 *
 * @constructor
 */
function GlobalResolver(paths) {
  this.rootPath = (paths && paths.length ? paths[0] : process.cwd()); // top level module in the npm tree
}

/**
 * Resolves `importedPath` imported by the given module `fromModule` to an npm wrapper module.
 *
 * @param {string} importedPath
 * @param {?Module} fromModule
 * @param {Container} container
 * @return {?Module}
 */
GlobalResolver.prototype.resolveModule = function(importedPath, fromModule, container) {
  if (importedPath === 'global-wrapper') {
    var mod = new ModuleClass(libpath.join(this.rootPath, importedPath), importedPath, container);
    var src = wrapperSource
      .replace('<path>', container.globalDepedency)
      .replace('<namespace>', container.globalNamespace)
      .replace('<binding>', container.globalNamedExport);

    mod.ast = recast.parse(src, {esprima: esprima});

    console.log('INFO: Using a global wrapper module for "%s", exporting namespace "%s"', container.globalDepedency, container.globalNamespace);
    return mod;
  }
  return null;
};

module.exports = GlobalResolver;
