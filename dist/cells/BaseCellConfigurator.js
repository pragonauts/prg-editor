"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseCellConfigurator = function () {
  function BaseCellConfigurator(attr, name) {
    var translator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, BaseCellConfigurator);

    this.translator = translator;

    this.config = {
      attr: attr,
      name: translator ? translator(name) : name,
      map: function map(a) {
        return a;
      },
      Cell: null,
      order: 0,
      orderBy: null,
      orderByDefault: false
    };
  }

  _createClass(BaseCellConfigurator, [{
    key: "map",
    value: function map(fn) {
      this.config.map = fn;
      return this;
    }
  }, {
    key: "orderBy",
    value: function orderBy() {
      var defaultDirection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var fieldName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.config.orderBy = fieldName || this.config.attr;
      this.config.order = defaultDirection;
      return this;
    }
  }, {
    key: "orderByDefault",
    value: function orderByDefault() {
      this.config.orderByDefault = true;
      return this;
    }
  }]);

  return BaseCellConfigurator;
}();

exports.default = BaseCellConfigurator;