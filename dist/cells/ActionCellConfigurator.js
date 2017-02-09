'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseCellConfigurator2 = require('./BaseCellConfigurator');

var _BaseCellConfigurator3 = _interopRequireDefault(_BaseCellConfigurator2);

var _ActionCell = require('../components/cells/ActionCell');

var _ActionCell2 = _interopRequireDefault(_ActionCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionCellConfigurator = function (_BaseCellConfigurator) {
    _inherits(ActionCellConfigurator, _BaseCellConfigurator);

    function ActionCellConfigurator(attr, name) {
        var translator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        _classCallCheck(this, ActionCellConfigurator);

        var _this = _possibleConstructorReturn(this, (ActionCellConfigurator.__proto__ || Object.getPrototypeOf(ActionCellConfigurator)).call(this, attr, name, translator));

        _this.config.Cell = _ActionCell2.default;

        _this.config.href = null;

        _this.config.label = _this.config.name;

        _this.config.onClick = null;

        _this.config.condition = null;
        return _this;
    }

    _createClass(ActionCellConfigurator, [{
        key: 'condition',
        value: function condition(callback) {
            this.config.condition = callback;
            return this;
        }
    }, {
        key: 'href',
        value: function href(callback) {
            this.config.href = callback;
            return this;
        }
    }, {
        key: 'label',
        value: function label(callbackOrString) {
            if (typeof callbackOrString === 'string') {
                this.config.label = this.translator(callbackOrString);
            } else {
                this.config.label = callbackOrString;
            }
            return this;
        }
    }, {
        key: 'onClick',
        value: function onClick(callback) {
            this.config.onClick = callback;
            return this;
        }
    }]);

    return ActionCellConfigurator;
}(_BaseCellConfigurator3.default);

exports.default = ActionCellConfigurator;