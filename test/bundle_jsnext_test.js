'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.bundle_jsnext_lib = {
  default_options: function(test) {
    var actual = grunt.file.read('tmp/default_options.js');
    var expected = grunt.file.read('test/expected/default_options.js');
    test.equal(actual.toString(), expected.toString(), 'should use the package name as the namespace.');
    test.done();
  },
  custom_options: function(test) {
    var actual = grunt.file.read('tmp/custom_options.js');
    var expected = grunt.file.read('test/expected/custom_options.js');
    test.equal(actual, expected, 'should use the custom namespace `foo.bar.baz` instead of the package name.');
    test.done();
  },
};
