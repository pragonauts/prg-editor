'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Spinner = require('./Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _AjaxErrorMessage = require('./AjaxErrorMessage');

var _AjaxErrorMessage2 = _interopRequireDefault(_AjaxErrorMessage);

var _AjaxResource = require('../AjaxResource');

var _AjaxResource2 = _interopRequireDefault(_AjaxResource);

var _tablePropTypes = require('./tablePropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DeleteConfirmator = function (_Component) {
    _inherits(DeleteConfirmator, _Component);

    function DeleteConfirmator(props) {
        _classCallCheck(this, DeleteConfirmator);

        var _this = _possibleConstructorReturn(this, (DeleteConfirmator.__proto__ || Object.getPrototypeOf(DeleteConfirmator)).call(this, props));

        _this.serverRequest = null;

        _this.errorHandler = null;

        _this.state = {
            loading: false
        };

        if (typeof props.resource === 'string') {
            _this.resource = new _AjaxResource2.default(props.resource);
        } else {
            _this.resource = props.resource;
        }

        _this.mounted = true;
        return _this;
    }

    _createClass(DeleteConfirmator, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.mounted = false;
            this.resource.abort();
        }
    }, {
        key: 'onAjaxError',
        value: function onAjaxError(error) {
            if (!this.mounted) {
                return;
            }
            this.serverRequest = null;
            this.setState({ loading: false });

            if (this.errorHandler) {
                this.errorHandler.showError(error);
            }

            if (this.props.onDeleteDidFail) {
                this.props.onDeleteDidFail(error);
            }
        }
    }, {
        key: 'onAjaxSuccess',
        value: function onAjaxSuccess(data) {
            if (!this.mounted) {
                return;
            }
            this.serverRequest = null;
            this.setState({ loading: false });

            if (this.props.onDeleteDidFinish) {
                this.props.onDeleteDidFinish(data);
            }
        }
    }, {
        key: 'onConfirm',
        value: function onConfirm() {
            var _this2 = this;

            this.setState({ loading: true });

            this.resource.remove(this.props.id).then(function (res) {
                return _this2.onAjaxSuccess(res);
            }).catch(function (e) {
                return _this2.onAjaxError(e);
            });
        }
    }, {
        key: 'renderError',
        value: function renderError() {
            var _this3 = this;

            return _react2.default.createElement(_AjaxErrorMessage2.default, {
                ref: function ref(c) {
                    _this3.errorHandler = c;
                },
                message: this.props.deleteErrorMessage,
                t: this.props.t
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            if (this.state.loading) {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_Spinner2.default, null)
                );
            }

            var _props = this.props,
                t = _props.t,
                onDeleteDidFinish = _props.onDeleteDidFinish;


            return _react2.default.createElement(
                _Modal2.default,
                {
                    onClosed: function onClosed() {
                        return onDeleteDidFinish();
                    },
                    customBody: true,
                    title: t('Delete item?')
                },
                _react2.default.createElement(
                    'section',
                    { className: 'modal-card-body' },
                    this.renderError(),
                    _react2.default.createElement(
                        'p',
                        null,
                        t(this.props.deleteConfirmationMessage)
                    ),
                    _react2.default.createElement('br', null),
                    _react2.default.createElement('br', null)
                ),
                _react2.default.createElement(
                    'footer',
                    { className: 'modal-card-foot' },
                    _react2.default.createElement(
                        'button',
                        {
                            className: 'button is-danger',
                            onClick: function onClick() {
                                return _this4.onConfirm();
                            }
                        },
                        t('Delete')
                    )
                )
            );
        }
    }]);

    return DeleteConfirmator;
}(_react.Component);

DeleteConfirmator.propTypes = {
    onDeleteDidFinish: _react.PropTypes.func,
    onDeleteDidFail: _react.PropTypes.func,
    id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
    resource: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired,
    t: _react.PropTypes.func,
    deleteErrorMessage: _tablePropTypes.StringOrFunc,
    deleteConfirmationMessage: _tablePropTypes.StringOrFunc
};

DeleteConfirmator.defaultProps = {
    onDeleteDidFinish: function onDeleteDidFinish() {},
    onDeleteDidFail: function onDeleteDidFail() {},
    t: function t(a) {
        return a;
    },
    deleteErrorMessage: 'Deletion failed.',
    deleteConfirmationMessage: 'Do you really want to remove the record?' };

exports.default = DeleteConfirmator;