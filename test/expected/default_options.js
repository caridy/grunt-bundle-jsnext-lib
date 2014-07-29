(function() {
    "use strict";

    var test$fixtures$main$$default = function () {
      return 'print main';
    };

    if (typeof define === 'function' && define.amd) {
      define(function() { return test$fixtures$main$$default; });
    } else if (typeof module !== 'undefined' && module.exports) {
      module.exports = test$fixtures$main$$default;
    } else if (typeof this !== 'undefined') {
      this['grunt-bundle-jsnext-lib'] = test$fixtures$main$$default;
    }
}).call(this);

//# sourceMappingURL=default_options.js.map