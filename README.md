# grunt-bundle-jsnext-lib

Grunt plugin to build libraries written using ES6 Modules. The library can depend on other similar libraries, and can be build for browsers and nodejs.

This plugin allow you to write your library as a collection of ES6 modules, define an entry point to that collection of modules that will be used to transpile the modules into a single file exporting a global namespace to use it in a browser as a global script. It can also transpile the modules into CommonJS to use it in nodejs.

This plugin relies on [es6-module-transpiler][] transpile the modules into bundles.

It also relies on a custom resolver [es6-module-transpiler-npm-resolver][] to support importing ES6 modules from another NPM package, if that other package contains the `jsnext:main` definition in `package.json`. You can see an example of this here: https://github.com/yahoo/handlebars-helper-intl/

[es6-module-transpiler]: https://github.com/square/es6-module-transpiler
[es6-module-transpiler-npm-resolver]: https://github.com/caridy/es6-module-transpiler-npm-resolver

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bundle-jsnext-lib --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bundle-jsnext-lib');
```

## The "bundle_jsnext" task

### Overview
In your project's Gruntfile, add a section named `bundle_jsnext` and/or `cjs_jsnext` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bundle_jsnext: {
    library: {
      options: {
        namespace: 'MyLibrary'
      },
      dest: 'dist/library.js'
    }
  },
  cjs_jsnext: {
    library: {
      options: {
        main: 'src/main.js',
      },
      dest: 'lib/'
    }
  },
});
```

Both tasks support the same options, the only difference is in the `dest` value. For `bundle` format output, a destination file is required, while for `cjs`, a destination folder is required.

### Options

#### options.namespace
Type: `String`
Default value: the `name` value from the  `package.json` in your project.

A string value that is used to expose the entry point module into a global script for browsers. (e.g.: `window.IntlMessageFormat` for `intl-messageformat` package.)

#### options.main
Type: `String`
Default value: the `jsnext:main` value from the  `package.json` in your project.

A string value that is used as the path to the source of the ES6 module that should be exported.

_Note: you should rely on `jsnext:main` as the standard way of pointing to the main module written in a format that is still not supported in the current javascript engines, and requires some transpilation, so this value can be used by other tools as well._

#### options.namedExport
Type: `String`
Default value: `default`

A string value that is used to specify the named export that should be exported into the namespace, and into `module.exports`. By default, it will use the ES6 default export of the module specified thru `options.main`.

#### options.basePath
Type: `String`
Default value: `process.cwd()`

A string path used to resolve the transpiled modules' source paths against. The resolved path will then serve as the `sourceFileName` value for the module in the bundled output file's source map.

#### options.sourceRoot
Type: `String`
Default value: `"/"`

A string path to use as the `sourceRoot` value in the bundled output file's source map.

### Usage Examples

#### Default Options
In this example, the default options are used, which means the package name will be used as the `namespace`, and the value of `jsnext:main` in the `package.json` will be used as the entry point. As a result, the bundle with the transpiled modules is going to be written into `dest/library.js`.

```js
grunt.initConfig({
  bundle_jsnext: {
    dest: 'dest/library.js',
  },
});
```

#### Custom Options
In this example, a custom namespace, and a custom entry point are provided. As a result, the bundle with the transpiled module `main-module`, and its dependencies is going to be written into `dest/library.js`.

__Please, stick to the default options :), seriously.__

```js
grunt.initConfig({
  bundle_jsnext: {
    options: {
      namespace: 'MyLibrary',
      namedExport: 'default',
      main: 'path/to/entry/point/main-module.js',
    },
    dest: 'dest/library.js',
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
