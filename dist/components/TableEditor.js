'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

var _DeleteConfirmator = require('./DeleteConfirmator');

var _DeleteConfirmator2 = _interopRequireDefault(_DeleteConfirmator);

var _AjaxResource = require('../AjaxResource');

var _AjaxResource2 = _interopRequireDefault(_AjaxResource);

var _AjaxErrorMessage = require('./AjaxErrorMessage');

var _AjaxErrorMessage2 = _interopRequireDefault(_AjaxErrorMessage);

var _tablePropTypes = require('./tablePropTypes');

var _Paginator = require('./Paginator');

var _Paginator2 = _interopRequireDefault(_Paginator);

var _TableEditorHeader = require('./TableEditorHeader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableEditor = function (_Component) {
    _inherits(TableEditor, _Component);

    function TableEditor(props) {
        _classCallCheck(this, TableEditor);

        var _this = _possibleConstructorReturn(this, (TableEditor.__proto__ || Object.getPrototypeOf(TableEditor)).call(this, props));

        _this.serverRequest = null;

        _this.headerForm = null;

        _this.errorHandler = null;

        _this.state = {
            editorOpened: false,
            confirmingRemove: false,
            loading: true,
            data: [],
            params: {
                offset: 0,
                order: 1,
                orderBy: null,
                limit: props.limit
            },
            nextOffset: 0,
            editData: null,
            editId: null,
            deleteId: null,
            filterChanged: false
        };

        var defaultOrder = {};

        props.colsConfig.some(function (col) {
            if (col.orderByDefault && col.orderBy) {
                defaultOrder = {
                    order: col.order,
                    orderBy: col.orderBy
                };
                return true;
            }
            return false;
        });

        if (typeof props.resource === 'string') {
            _this.resource = new _AjaxResource2.default(props.resource);
        } else {
            _this.resource = props.resource;
        }

        if (_typeof(props.params) === 'object') {
            Object.assign(_this.state.params, defaultOrder, props.params);
        } else {
            Object.assign(_this.state.params, defaultOrder);
        }
        return _this;
    }

    _createClass(TableEditor, [{
        key: 'getChildContext',
        value: function getChildContext() {
            var _this2 = this;

            return {
                resource: this.resource,
                onEditorDidFinish: function onEditorDidFinish(data) {
                    return _this2.onEditorDidFinish(data);
                },
                editId: this.state.editId,
                editData: this.state.editData
            };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.loadData({}, true);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.resource.abort();
        }
    }, {
        key: 'onAjaxError',
        value: function onAjaxError(error) {
            if (error && '' + error.statusText === 'abort') {
                return;
            }
            console.error(error);
            this.setState({ loading: false, error: error });
            this.errorHandler.showError(error);
        }
    }, {
        key: 'onAjaxSuccess',
        value: function onAjaxSuccess(data) {
            var params = Object.assign({}, this.state.params, {
                offset: data.offset || this.state.params.offset
            });

            this.setState({
                loading: false,
                data: data.data,
                nextOffset: data.nextOffset,
                params: params
            });
        }
    }, {
        key: 'onAddButtonClick',
        value: function onAddButtonClick() {
            this.setState({ editId: null, editData: null, editorOpened: true });
        }
    }, {
        key: 'onEditorDidFinish',
        value: function onEditorDidFinish() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            this.setState({ editorOpened: false });
            if (data !== null) {
                this.loadData();
            }
        }
    }, {
        key: 'onDeleteConfirmationFinished',
        value: function onDeleteConfirmationFinished(data) {
            this.setState({ confirmingRemove: false });
            if (data !== null) {
                this.loadData();
            }
        }
    }, {
        key: 'onDeleteConfirmationClosed',
        value: function onDeleteConfirmationClosed() {
            this.setState({ confirmingRemove: false });
        }
    }, {
        key: 'onHeaderSubmit',
        value: function onHeaderSubmit(params) {
            this.setState({ filterChanged: true });
            this.loadData(Object.assign({}, params, { page: 0 }));
        }
    }, {
        key: 'loadData',
        value: function loadData() {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var _this3 = this;

            var initial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
            var overrideParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var newParams = void 0;
            if (overrideParams) {
                newParams = params;
            } else if (initial) {
                newParams = this.state.params;
            } else {
                newParams = Object.assign({}, this.state.params, params);
            }
            if (!initial) {
                this.setState({
                    loading: true,
                    params: newParams,
                    data: [],
                    nextOffset: 0
                });
            }

            this.resource.getAll(newParams).then(function (data) {
                return _this3.onAjaxSuccess(data);
            }).catch(function (err) {
                return _this3.onAjaxError(err);
            });
        }
    }, {
        key: 'resetHeaderForm',
        value: function resetHeaderForm() {
            var _state$params = this.state.params,
                order = _state$params.order,
                orderBy = _state$params.orderBy;

            this.setState({ filterChanged: false });
            this.loadData({ offset: 0, order: order, orderBy: orderBy, limit: this.props.limit }, false, true);
        }
    }, {
        key: 'edit',
        value: function edit(idOrData) {
            var editId = void 0;
            var editData = null;

            if ((typeof idOrData === 'undefined' ? 'undefined' : _typeof(idOrData)) === 'object') {
                editId = this.resource.getId(idOrData);
                editData = idOrData;
            } else {
                editId = idOrData;
            }

            this.setState({ editId: editId, editData: editData, editorOpened: true });
        }
    }, {
        key: 'delete',
        value: function _delete(idOrData) {
            var deleteId = (typeof idOrData === 'undefined' ? 'undefined' : _typeof(idOrData)) === 'object' ? this.resource.getId(idOrData) : idOrData;
            this.setState({ deleteId: deleteId, confirmingRemove: true });
        }
    }, {
        key: 'renderEditor',
        value: function renderEditor() {
            return (0, _TableEditorHeader.getFormChildren)(this.props.children);
        }
    }, {
        key: 'renderRemovalConfirmation',
        value: function renderRemovalConfirmation() {
            var _this4 = this;

            return _react2.default.createElement(_DeleteConfirmator2.default, {
                id: this.state.deleteId,
                resource: this.props.resource,
                t: this.props.t,
                onDeleteDidFinish: function onDeleteDidFinish(data) {
                    return _this4.onDeleteConfirmationFinished(data);
                },
                deleteErrorMessage: this.props.deleteErrorMessage
            });
        }
    }, {
        key: 'renderError',
        value: function renderError() {
            var _this5 = this;

            return _react2.default.createElement(_AjaxErrorMessage2.default, {
                ref: function ref(c) {
                    _this5.errorHandler = c;
                },
                message: this.props.loadingErrorMessage,
                t: this.props.t,
                onTryAgain: function onTryAgain() {
                    return _this5.loadData();
                }
            });
        }
    }, {
        key: 'renderPaginator',
        value: function renderPaginator() {
            var _this6 = this;

            var _state$params2 = this.state.params,
                offset = _state$params2.offset,
                limit = _state$params2.limit;

            var page = offset / limit;

            return _react2.default.createElement(_Paginator2.default, {
                page: page,
                nextPage: this.state.nextOffset ? page + 1 : 0,
                onPageChange: function onPageChange(p) {
                    return _this6.loadData({ offset: p >= 0 ? p * limit : -1 });
                }
            });
        }
    }, {
        key: 'renderTable',
        value: function renderTable() {
            var _this7 = this;

            var _props = this.props,
                t = _props.t,
                disableAdd = _props.disableAdd,
                colsConfig = _props.colsConfig;
            var _state = this.state,
                filterChanged = _state.filterChanged,
                params = _state.params,
                loading = _state.loading,
                data = _state.data;


            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _TableEditorHeader.TableEditorHeader,
                    {
                        t: t,
                        disableAdd: disableAdd,
                        filterChanged: filterChanged,
                        onAddButtonClick: function onAddButtonClick() {
                            return _this7.onAddButtonClick();
                        },
                        onResetHeaderForm: function onResetHeaderForm() {
                            return _this7.resetHeaderForm();
                        },
                        onHeaderSubmit: function onHeaderSubmit() {
                            return _this7.onHeaderSubmit.apply(_this7, arguments);
                        },
                        params: params
                    },
                    this.props.children
                ),
                this.renderPaginator(),
                _react2.default.createElement(_Table2.default, {
                    data: data,
                    colsConfig: colsConfig,
                    loading: loading,
                    order: params.order,
                    orderBy: params.orderBy,
                    onOrderChange: function onOrderChange(orderBy, order) {
                        return _this7.loadData({ order: order, orderBy: orderBy });
                    }
                }),
                this.renderPaginator()
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'container is-fluid is-fullwidth is-self-top' },
                this.renderError(),
                this.renderTable(),
                this.state.editorOpened ? this.renderEditor() : null,
                this.state.confirmingRemove ? this.renderRemovalConfirmation() : null
            );
        }
    }]);

    return TableEditor;
}(_react.Component);

TableEditor.propTypes = {
    children: _react.PropTypes.oneOfType([_react.PropTypes.any]),
    colsConfig: _tablePropTypes.ColsConfig.isRequired,
    params: _react.PropTypes.objectOf(_react.PropTypes.any),
    resource: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]).isRequired,
    t: _react.PropTypes.func,
    loadingErrorMessage: _tablePropTypes.StringOrFunc,
    deleteErrorMessage: _tablePropTypes.StringOrFunc,
    limit: _react.PropTypes.number,
    disableAdd: _react.PropTypes.bool
};

TableEditor.childContextTypes = {
    resource: _react.PropTypes.object,
    onEditorDidFinish: _react.PropTypes.func.isRequired,
    editId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
    editData: _react.PropTypes.object
};

TableEditor.defaultProps = {
    children: null,
    params: null,
    t: function t(a) {
        return a;
    },
    loadingErrorMessage: 'Loading failed',
    deleteErrorMessage: 'Delete failed',
    disableAdd: false,
    limit: 20
};

exports.default = TableEditor;