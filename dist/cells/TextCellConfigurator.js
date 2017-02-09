'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseCellConfigurator2 = require('./BaseCellConfigurator');

var _BaseCellConfigurator3 = _interopRequireDefault(_BaseCellConfigurator2);

var _TextCell = require('../components/cells/TextCell');

var _TextCell2 = _interopRequireDefault(_TextCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextCellConfigurator = function (_BaseCellConfigurator) {
  _inherits(TextCellConfigurator, _BaseCellConfigurator);

  function TextCellConfigurator(attr, name) {
    var translator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, TextCellConfigurator);

    var _this = _possibleConstructorReturn(this, (TextCellConfigurator.__proto__ || Object.getPrototypeOf(TextCellConfigurator)).call(this, attr, name, translator));

    _this.config.Cell = _TextCell2.default;
    return _this;
  }

  return TextCellConfigurator;
}(_BaseCellConfigurator3.default);

exports.default = TextCellConfigurator;