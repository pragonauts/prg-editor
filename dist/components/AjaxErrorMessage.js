'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ErrorMessage = require('./ErrorMessage');

var _ErrorMessage2 = _interopRequireDefault(_ErrorMessage);

var _tablePropTypes = require('./tablePropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AjaxErrorMessage = function (_Component) {
    _inherits(AjaxErrorMessage, _Component);

    function AjaxErrorMessage(props) {
        _classCallCheck(this, AjaxErrorMessage);

        var _this = _possibleConstructorReturn(this, (AjaxErrorMessage.__proto__ || Object.getPrototypeOf(AjaxErrorMessage)).call(this, props));

        _this.state = {
            error: props.error
        };
        return _this;
    }

    _createClass(AjaxErrorMessage, [{
        key: 'onTryAgain',
        value: function onTryAgain() {
            this.setState({ error: null });
            this.props.onTryAgain();
        }
    }, {
        key: 'showError',
        value: function showError(jqXHR) {
            this.setState({ error: jqXHR });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            if (!this.state.error) {
                return null;
            }

            var error = void 0;

            if (typeof this.props.message === 'function') {
                error = this.props.message(this.state.error);
            } else {
                error = this.props.t(this.props.message);
            }

            var tryAgainButton = null;

            if (this.props.onTryAgain) {
                tryAgainButton = _react2.default.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'button is-danger is-inverted is-outlined try-again',
                        onClick: function onClick() {
                            return _this2.onTryAgain();
                        }
                    },
                    this.props.t('Try it again')
                );
            }

            return _react2.default.createElement(
                _ErrorMessage2.default,
                {
                    onCloseRequested: function onCloseRequested() {
                        return _this2.setState({ error: null });
                    }
                },
                _react2.default.createElement(
                    'div',
                    { className: 'columns is-vcentered' },
                    _react2.default.createElement(
                        'div',
                        { className: 'column is-narrow' },
                        error
                    ),
                    tryAgainButton && _react2.default.createElement(
                        'div',
                        { className: 'column is-narrow' },
                        tryAgainButton
                    )
                )
            );
        }
    }]);

    return AjaxErrorMessage;
}(_react.Component);

AjaxErrorMessage.propTypes = {
    message: _tablePropTypes.StringOrFunc.isRequired,
    t: _react.PropTypes.func,
    onTryAgain: _react.PropTypes.func,
    error: _react.PropTypes.oneOfType([_react.PropTypes.any])
};

AjaxErrorMessage.defaultProps = {
    t: function t(a) {
        return a;
    },
    onTryAgain: null,
    error: null
};

exports.default = AjaxErrorMessage;