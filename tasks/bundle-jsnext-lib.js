'use strict';

var libpath = require('path');
var formatters = require('es6-module-transpiler/lib/formatters');
var Container = require('es6-module-transpiler/lib/container');
var NPMFileResolver = require('es6-module-transpiler-npm-resolver');
var UMDWrapperResolver = require('../lib/global-resolver');
var FileResolver = require('es6-module-transpiler/lib/file_resolver');
var FormatterClass = formatters[formatters.DEFAULT];
var resolverClasses = [FileResolver, UMDWrapperResolver, NPMFileResolver];

module.exports = function(grunt) {

  grunt.registerMultiTask('bundle_jsnext', 'Grunt plugin to bundle ES6 Modules into a library for Browsers.', function() {
    var pkg;
    if (!grunt.file.exists('./package.json')) {
      grunt.log.warn('package.json not found.');
      return false;
    } else {
      pkg = require(libpath.resolve('./package.json'));
    }
    var config = this.options({
      namespace: pkg && pkg.name,
      main: pkg && pkg["jsnext:main"],
      namedExport: 'default'
    });

    var resolvers = resolverClasses.map(function(ResolverClass) {
      return new ResolverClass([libpath.resolve('./')]);
    });
    var container = new Container({
      formatter: new FormatterClass(),
      resolvers: resolvers,
      basePath: config.basePath,
      sourceRoot: config.sourceRoot
    });

    var filepath = config.main;
    if (!filepath) {
      grunt.fatal('Missing `jsnext:main` value in ' + libpath.resolve('./package.json'));
      return;
    }
    // Warn on and remove invalid source files (if nonull was set).
    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return;
    }

    try {
      container.globalDepedency = filepath;
      container.globalNamespace = config.namespace;
      container.globalNamedExport = config.namedExport;
      container.getModule("global-wrapper");
    } catch (err) {
      grunt.fatal('Error converting ES6 modules: ' + err);
      return;
    }

    var dest = (this.data && this.data.dest) || this.data;
    var destIsFile = libpath.extname(dest) === '.js';
    if (!destIsFile) {
      grunt.fatal('Destination (dest) should be a javascript file instead of "' + dest + '"');
    }

    grunt.file.mkdir(libpath.dirname(dest));
    try {
      container.write(dest);
      grunt.log.ok('Bundled library written in ' + dest);
    } catch (err) {
      grunt.fatal('Error writing bundle in "' + dest + '": ' + err);
      return;
    }
  });

};
