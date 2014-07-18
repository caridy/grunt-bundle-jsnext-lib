/* jshint node:true, undef:true, unused:true */

var recast = require('recast');
var libpath = require('path');
var ModuleClass = require('es6-module-transpiler/lib/module');

var wrapperSource = [
  "import {<binding> as m} from '<path>';",
  "if (typeof define === 'function' && define.amd) {",
  "  define(function() { return m; });",
  "} else if (typeof module !== 'undefined' && module.exports) {",
  "  module.exports = m;",
  "} else if (typeof this !== 'undefined') {",
  "  this['<namespace>'] = m;",
  "}"
].join('\n');

/**
 * Provides resolution of `umd-wrapper` module, which is a synthetic module to export
 * into a library that works as global, AMD and CJS.
 *
 * @constructor
 */
function UMDResolver(paths) {
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
UMDResolver.prototype.resolveModule = function(importedPath, fromModule, container) {
  if (importedPath === 'umd-wrapper') {
    var mod = new ModuleClass(libpath.join(this.rootPath, importedPath), importedPath, container);
    mod.ast = recast.parse(wrapperSource
      .replace('<path>', container.umdDepedency)
      .replace('<namespace>', container.umdNamespace.split(".").join("']['"))
      .replace('<binding>', container.umdNamedExport)
    );
    console.log('INFO: Using a umd wrapper module for "%s", exporting namespace "%s"', container.umdDepedency, container.umdNamespace);
    return mod;
  }
  return null;
};

module.exports = UMDResolver;
