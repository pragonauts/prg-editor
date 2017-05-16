'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TextCellConfigurator = require('./cells/TextCellConfigurator');

var _TextCellConfigurator2 = _interopRequireDefault(_TextCellConfigurator);

var _ActionCellConfigurator = require('./cells/ActionCellConfigurator');

var _ActionCellConfigurator2 = _interopRequireDefault(_ActionCellConfigurator);

var _RelationCellConfigurator = require('./cells/RelationCellConfigurator');

var _RelationCellConfigurator2 = _interopRequireDefault(_RelationCellConfigurator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TableBuilder = function () {
  function TableBuilder() {
    var translator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, TableBuilder);

    this.cols = [];

    this.translator = translator;
  }

  _createClass(TableBuilder, [{
    key: 'addText',
    value: function addText(attr, name) {
      var col = new _TextCellConfigurator2.default(attr, name, this.translator);
      this.cols.push(col);
      return col;
    }
  }, {
    key: 'addAction',
    value: function addAction(attr, name) {
      var col = new _ActionCellConfigurator2.default(attr, name, this.translator);
      this.cols.push(col);
      return col;
    }
  }, {
    key: 'addRelationCell',
    value: function addRelationCell(attr, name) {
      var col = new _RelationCellConfigurator2.default(attr, name, this.translator);
      this.cols.push(col);
      return col;
    }
  }, {
    key: 'getColsConfig',
    value: function getColsConfig() {
      return this.cols.map(function (col, i) {
        return Object.assign({
          id: i + '-' + col.config.attr
        }, col.config);
      });
    }
  }]);

  return TableBuilder;
}();

exports.default = TableBuilder;