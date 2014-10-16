'use strict';

var grunt = require('grunt');
var path = require('path');

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

exports.cjs_jsnext_lib = {
  main_node_module: function(test) {
    var main = require(path.resolve('./tmp/cjs_default/test/fixtures/main.js'));
    test.equal(main['default'](), 'print main', 'should export the `default` member from main.js.');
    test.done();
  },
  other_node_module: function(test) {
    var other = require(path.resolve('./tmp/cjs_custom/test/fixtures/other.js'));
    test.equal(other.foo(), 'print other', 'should export member `other` from main.js.');
    test.done();
  },
};
