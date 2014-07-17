/*
 * grunt-bundle-jsnext-lib
 * https://github.com/caridy/grunt-bundle-jsnext-lib
 *
 * Copyright (c) 2014 Caridy Patino
 * Licensed under the MIT license.
 */

'use strict';

var libpath = require('path');
var recast = require('recast');
var formatters = require('es6-module-transpiler/lib/formatters');
var Container = require('es6-module-transpiler/lib/container');
var NPMFileResolver = require('es6-module-transpiler-npm-resolver');
var UMDWrapperResolver = require('../lib/umd-resolver');
var FileResolver = require('es6-module-transpiler/lib/file_resolver');
var FormatterClass = formatters[formatters.DEFAULT];
var resolverClasses = [FileResolver, UMDWrapperResolver, NPMFileResolver];

module.exports = function(grunt) {

  grunt.registerMultiTask('bundle_jsnext', 'Grunt plugin to bundle ES6 Modules into a library for Browsers and CommonJS.', function() {
    var pkg;
    if (!grunt.file.exists('./package.json')) {
      grunt.log.warn('package.json not found.');
      return false;
    } else {
      pkg = require(libpath.resolve('./package.json'));
    }
    var config = this.options({
      namespace: pkg && pkg.name
    });

    var resolvers = resolverClasses.map(function(ResolverClass) {
      return new ResolverClass([libpath.resolve('./')]);
    });
    var container = new Container({
      formatter: new FormatterClass(),
      resolvers: resolvers
    });
    var code, outputs,
      filepath = pkg && pkg["jsnext:main"];

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
      container.umdDepedency = filepath;
      container.umdNamespace = config.namespace;
      container.getModule("umd-wrapper");
      outputs = container.convert();
      code = recast.print(outputs[0]).code;
    } catch (err) {
      grunt.fatal('Error converting ES6 modules: ' + err);
      return;
    }

    grunt.file.write(this.data, code, { encoding: 'utf8' });
    grunt.log.ok('Bundled library written in ' + this.data);

  });

};
