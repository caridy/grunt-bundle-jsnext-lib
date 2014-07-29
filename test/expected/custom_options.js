(function() {
    "use strict";
    function test$fixtures$other$$foo() {
      return 'print other';
    }
    if (typeof define === 'function' && define.amd) {
      define(function() { return test$fixtures$other$$foo; });
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = test$fixtures$other$$foo;
    } else if (typeof this !== 'undefined') {
      this['foo']['bar']['baz'] = test$fixtures$other$$foo;
    }
}).call(this);

//# sourceMappingURL=custom_options.js.map