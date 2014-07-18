# grunt-bundle-jsnext-lib

Grunt plugin to bundle a ES6 Module and its dependencies into a library that can be used today in  a browser, or thru AMD and CommonJS.

This plugin allow you to write your library as a collection of ES6 modules, define an entry point to that collection of modules that will be used to transpile the modules into a single file that implements UMD format to use it today in any module system.

As a result, you will have an NPM module that can work in nodejs, with browserify, with AMD, or simply as a global script in a browser.

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
In your project's Gruntfile, add a section named `bundle_jsnext` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  bundle_jsnext: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific destination and/or options go here.
    },
  },
});
```

### Options

#### options.namespace
Type: `String`
Default value: the `name` value from the  `package.json` in your project.

A string value that is used to expose the entry point module into a global script for browsers. (e.g.: `window.IntlMessageFormat` for `intl-messageformat` package.)

You can use multiple levels for this namespace, for example: `Foo.Bar-baz`, which will define `window.Foo["Bar-baz"]` as the way to access the exported values.

#### options.main
Type: `String`
Default value: the `jsnext:main` value from the  `package.json` in your project.

A string value that is used as the path to the source of the ES6 module that should be exported.

_Note: the encourage people rely on `jsnext:main`, as the standard way of pointing to the main module written in a format that is still not supported in the current javascript engines, and requires some transpilation, so this value can be used by other tools as well._

#### options.namedExport
Type: `String`
Default value: `default`

A string value that is used to specify the named export that should be exported into the namespace, into `module.exports` and thru `define()`. By default, it will use the ES6 default export.

### Usage Examples

#### Default Options
In this example, the default options are used, which means the package name will be used as the `namespace`, and the value of `jsnext:main` in the `package.json` will be used as the entry point. As a result, the bundle with the transpiled modules is going to be written into `dest/my-library.js`.

```js
grunt.initConfig({
  bundle_jsnext: {
    dest: 'dest/my-library.js',
  },
});
```

#### Custom Options
In this example, a custom namespace, and a custom entry point are provided. As a result, the bundle with the transpiled module `main-module`, and its dependencies is going to be written into `dest/my-library.js`.

__Please, stick to the default options :), seriously.__

```js
grunt.initConfig({
  bundle_jsnext: {
    options: {
      namespace: 'Foo.Bar',
      namedExport: 'foo',
      main: 'path/to/entry/point/custom-module.js',
    },
    dest: 'dest/custom-module.js',
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
