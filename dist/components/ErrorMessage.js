'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorMessage = function (_React$Component) {
    _inherits(ErrorMessage, _React$Component);

    function ErrorMessage() {
        _classCallCheck(this, ErrorMessage);

        return _possibleConstructorReturn(this, (ErrorMessage.__proto__ || Object.getPrototypeOf(ErrorMessage)).apply(this, arguments));
    }

    _createClass(ErrorMessage, [{
        key: 'onCloseRequested',
        value: function onCloseRequested() {
            if (typeof this.props.onCloseRequested === 'function') {
                this.props.onCloseRequested();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: 'notification is-danger', role: 'alert' },
                _react2.default.createElement('button', {
                    type: 'button',
                    className: 'delete',
                    'aria-label': 'Close',
                    onClick: function onClick(e) {
                        return _this2.onCloseRequested(e);
                    }
                }),
                _react2.default.createElement(
                    'span',
                    { className: 'text' },
                    this.props.children
                )
            );
        }
    }]);

    return ErrorMessage;
}(_react2.default.Component);

ErrorMessage.propTypes = {
    children: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.element, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.any), _react2.default.PropTypes.string]),
    onCloseRequested: _react2.default.PropTypes.func
};

ErrorMessage.defaultProps = {
    children: null,
    onCloseRequested: function onCloseRequested() {}
};

exports.default = ErrorMessage;