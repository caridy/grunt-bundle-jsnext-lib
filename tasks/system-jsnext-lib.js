'use strict';

var libpath = require('path');
var Container = require('es6-module-transpiler/lib/container');
var NPMFileResolver = require('../lib/npm-resolver');
var FileResolver = require('es6-module-transpiler/lib/file_resolver');
var FormatterClass = require('es6-module-transpiler-system-formatter');
var resolverClasses = [FileResolver, NPMFileResolver];

module.exports = function(grunt) {

  grunt.registerMultiTask('system_jsnext', 'Grunt plugin to bundle ES6 Modules into a library for System.register.', function() {
    var pkg;
    if (!grunt.file.exists('./package.json')) {
      grunt.log.warn('package.json not found.');
      return false;
    } else {
      pkg = require(libpath.resolve('./package.json'));
    }
    var config = this.options({
      main: pkg && pkg["jsnext:main"]
    });

    var resolvers = [FileResolver, NPMFileResolver].map(function(ResolverClass) {
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
      container.getModule(filepath);
      container.convert();
      container.findImportedModules();
    } catch (err) {
      grunt.fatal('Error converting ES6 modules: ' + err);
      return;
    }

    Object.keys(container.modules).forEach(function (src) {
      var external = container.modules[src].external;
      delete container.modules[src];
      if (!external) {
        container.getModule(src.slice(libpath.resolve('./').length + 1));
      }
    });

    var dest = (this.data && this.data.dest) || this.data;
    grunt.file.mkdir(dest);
    try {
      container.write(dest);
      grunt.log.ok('System.register library written in ' + dest);
    } catch (err) {
      grunt.fatal('Error writing library in "' + dest + '": ' + err);
      return;
    }
  });

};
