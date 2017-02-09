'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _prgForm = require('prg-form');

var _Spinner = require('./Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Modal = require('./Modal');

var _Modal2 = _interopRequireDefault(_Modal);

var _AjaxErrorMessage = require('./AjaxErrorMessage');

var _AjaxErrorMessage2 = _interopRequireDefault(_AjaxErrorMessage);

var _tablePropTypes = require('./tablePropTypes');

var _AjaxResource = require('../AjaxResource');

var _AjaxResource2 = _interopRequireDefault(_AjaxResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Editor = function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor(props, context) {
        _classCallCheck(this, Editor);

        var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props, context));

        _this.errorHandler = null;

        _this.t = props.t || context.t || function (w) {
            return w;
        };
        _this.resource = props.resource || context.resource;

        if (!_this.resource) {
            throw new Error('');
        } else if (typeof _this.resource === 'string') {
            _this.resource = new _AjaxResource2.default(_this.resource);
        }

        var id = props.id || context.editId;
        var loadedData = props.data || context.editData;

        _this.state = {
            id: id,
            loadedData: loadedData,
            loading: !loadedData && id,
            values: id && loadedData ? loadedData : {},
            loadingError: null
        };
        return _this;
    }

    _createClass(Editor, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            if (this.state.loading) {
                this.loadData(true);
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.resource.abort();
        }
    }, {
        key: 'onDataLoad',
        value: function onDataLoad(data) {
            this.setState({
                loading: false,
                id: this.resource.getId(data),
                values: data,
                loadedData: data,
                loadingError: null
            });
        }
    }, {
        key: 'onDataLoadError',
        value: function onDataLoadError(e) {
            this.setState({
                loading: false,
                loadingError: e
            });
        }
    }, {
        key: 'onSubmit',
        value: function onSubmit(formData) {
            var _this2 = this;

            var promise = void 0;

            if (this.state.id) {
                promise = this.resource.update(this.state.id, formData);
            } else {
                promise = this.resource.create(formData);
            }

            promise.then(function (res) {
                return _this2.onAjaxSuccess(res);
            }).catch(function (err) {
                return _this2.onAjaxError(err);
            });
        }
    }, {
        key: 'onValidationFailed',
        value: function onValidationFailed() {
            this.setState({ loading: false });
        }
    }, {
        key: 'onBeforeValidate',
        value: function onBeforeValidate(formData) {
            this.setState({ loading: true, values: formData });
        }
    }, {
        key: 'onAjaxError',
        value: function onAjaxError(error) {
            this.setState({ loading: false });

            if (this.errorHandler) {
                this.errorHandler.showError(error);
            }
            if (this.props.onSubmitDidFail) {
                this.props.onSubmitDidFail(error);
            }
        }
    }, {
        key: 'onAjaxSuccess',
        value: function onAjaxSuccess(data) {
            this.serverRequest = null;

            var stay = true;

            if (this.context.onEditorDidFinish) {
                stay = this.context.onEditorDidFinish(data);
            }

            if (this.props.onSubmitDidFinish) {
                stay = this.props.onSubmitDidFinish(data);
            }

            var id = this.resource.getId(data);

            if (stay) {
                this.setState({ loading: false, loadedData: data, values: data, id: id });
            }
        }
    }, {
        key: 'onClosed',
        value: function onClosed() {
            if (this.context.onEditorDidFinish) {
                this.context.onEditorDidFinish(null);
            }

            if (this.props.onClosed) {
                this.props.onClosed(null);
            }
        }
    }, {
        key: 'getContext',
        value: function getContext() {
            var context = this.props.context;
            if (context && (typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object') {
                context = this.state.id ? context.update : context.create;
            }
            return context;
        }
    }, {
        key: 'loadData',
        value: function loadData() {
            var _this3 = this;

            var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!initial) {
                this.setState({ loadingError: null, loading: true });
            }
            this.resource.getById(this.state.id).then(function (data) {
                return _this3.onDataLoad(data);
            }).catch(function (e) {
                return _this3.onDataLoadError(e);
            });
        }
    }, {
        key: 'renderError',
        value: function renderError() {
            var _this4 = this;

            return _react2.default.createElement(_AjaxErrorMessage2.default, {
                ref: function ref(c) {
                    _this4.errorHandler = c;
                },
                message: this.props.updateErrorMessage,
                t: this.t
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var content = void 0;
            var _state = this.state,
                id = _state.id,
                loadingError = _state.loadingError;


            if (loadingError) {
                content = _react2.default.createElement(_AjaxErrorMessage2.default, {
                    ref: function ref(c) {
                        _this5.errorHandler = c;
                    },
                    message: this.props.loadingErrorMessage,
                    error: loadingError,
                    onTryAgain: function onTryAgain() {
                        return _this5.loadData();
                    },
                    t: this.t
                });
            } else if (this.state.loading) {
                content = _react2.default.createElement(_Spinner2.default, null);
            } else if (this.props.modalTitle || this.context.onEditorDidFinish) {
                var title = this.props.modalTitle;
                if (!title || typeof title === 'boolean') {
                    title = id ? this.t('Edit item') : this.t('New item');
                }
                content = _react2.default.createElement(
                    _Modal2.default,
                    {
                        onClosed: function onClosed() {
                            return _this5.onClosed();
                        },
                        customBody: true,
                        title: title
                    },
                    _react2.default.createElement(
                        'section',
                        { className: 'modal-card-body' },
                        this.renderError(),
                        this.props.children
                    ),
                    _react2.default.createElement(
                        'footer',
                        { className: 'modal-card-foot' },
                        _react2.default.createElement(
                            'button',
                            {
                                className: 'button is-primary',
                                formNoValidate: true,
                                type: 'submit'
                            },
                            this.t('Submit')
                        )
                    )
                );
            } else {
                content = _react2.default.createElement(
                    'span',
                    null,
                    this.renderError(),
                    this.props.children,
                    _react2.default.createElement(
                        'button',
                        {
                            className: 'button is-primary',
                            formNoValidate: true,
                            type: 'submit'
                        },
                        this.t('Submit')
                    )
                );
            }

            return _react2.default.createElement(
                _prgForm.ValidatorForm,
                {
                    onSubmit: function onSubmit() {
                        return _this5.onSubmit.apply(_this5, arguments);
                    },
                    onBeforeValidate: function onBeforeValidate() {
                        return _this5.onBeforeValidate.apply(_this5, arguments);
                    },
                    onValidationFailed: function onValidationFailed() {
                        return _this5.onValidationFailed.apply(_this5, arguments);
                    },
                    validator: this.props.validator,
                    className: 'form-editor',
                    validatorContext: this.getContext(),
                    t: this.t,
                    values: this.state.values
                },
                content
            );
        }
    }]);

    return Editor;
}(_react2.default.Component);

Editor.propTypes = {
    children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.arrayOf(_react.PropTypes.any)]),
    onSubmitDidFinish: _react.PropTypes.func,
    onSubmitDidFail: _react.PropTypes.func,
    id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    data: _react.PropTypes.objectOf(_react.PropTypes.any),
    resource: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
    t: _react.PropTypes.func,
    updateErrorMessage: _tablePropTypes.StringOrFunc,
    loadingErrorMessage: _tablePropTypes.StringOrFunc,
    validator: _react.PropTypes.objectOf(_react.PropTypes.any).isRequired,
    modalTitle: _react.PropTypes.string,
    onClosed: _react.PropTypes.func,
    context: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.shape({
        create: _react2.default.PropTypes.string,
        update: _react2.default.PropTypes.string
    })])
};

Editor.defaultProps = {
    children: null,
    onSubmitDidFinish: null,
    onSubmitDidFail: null,
    id: null,
    data: null,
    loadingErrorMessage: 'Loading failed',
    updateErrorMessage: 'Submit failed.',
    context: {
        create: 'create',
        update: 'update'
    },
    resource: null,
    modalTitle: null,
    onClosed: function onClosed() {},
    t: function t(w) {
        return w;
    }
};

Editor.contextTypes = {
    resource: _react.PropTypes.object,
    onEditorDidFinish: _react.PropTypes.func,
    editId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    editData: _react.PropTypes.object
};

exports.default = Editor;