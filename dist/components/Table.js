'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Row = require('./Row');

var _Row2 = _interopRequireDefault(_Row);

var _Spinner = require('./Spinner');

var _Spinner2 = _interopRequireDefault(_Spinner);

var _tablePropTypes = require('./tablePropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function renderArrow(order) {
    switch (order) {
        case 1:
            return _react2.default.createElement('i', { className: 'fa fa-sort-asc', 'aria-hidden': 'true' });
        case -1:
            return _react2.default.createElement('i', { className: 'fa fa-sort-desc', 'aria-hidden': 'true' });
        default:
            return null;
    }
}

var Table = function (_Component) {
    _inherits(Table, _Component);

    function Table() {
        _classCallCheck(this, Table);

        return _possibleConstructorReturn(this, (Table.__proto__ || Object.getPrototypeOf(Table)).apply(this, arguments));
    }

    _createClass(Table, [{
        key: 'orderBy',
        value: function orderBy(columnAttr) {
            var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var nextOrder = void 0;
            var orderChanged = this.props.orderBy !== columnAttr;

            if (order === 0) {
                nextOrder = 0;
            } else if (orderChanged) {
                nextOrder = order;
            } else {
                orderChanged = true;
                nextOrder = this.props.order * -1;
            }

            if (orderChanged && this.props.onOrderChange) {
                this.props.onOrderChange(columnAttr, nextOrder);
            }
        }
    }, {
        key: 'renderHeaderColumn',
        value: function renderHeaderColumn(config, index) {
            var _this2 = this;

            var content = void 0;

            if (config.orderBy) {
                var order = 0;

                if (this.props.orderBy === config.orderBy) {
                    order = parseInt(this.props.order, 10);
                }

                content = _react2.default.createElement(
                    'button',
                    {
                        type: 'button',
                        className: 'button is-void',
                        onClick: function onClick() {
                            return _this2.orderBy(config.orderBy, config.order);
                        }
                    },
                    config.name,
                    renderArrow(order)
                );
            } else {
                content = _react2.default.createElement(
                    'button',
                    { type: 'button', className: 'button is-void', disabled: true },
                    config.name
                );
            }

            return _react2.default.createElement(
                'th',
                { key: index },
                content
            );
        }
    }, {
        key: 'renderHeader',
        value: function renderHeader() {
            var _this3 = this;

            return this.props.colsConfig.map(function (config, index) {
                return _this3.renderHeaderColumn(config, index);
            });
        }
    }, {
        key: 'renderBody',
        value: function renderBody() {
            var _this4 = this;

            if (this.props.loading) {
                var colSpan = this.props.colsConfig.length;

                return _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'td',
                        { colSpan: colSpan, className: 'loading' },
                        _react2.default.createElement(_Spinner2.default, null)
                    )
                );
            }

            if (!this.props.data) {
                return null;
            }

            return this.props.data.map(function (row, i) {
                return _react2.default.createElement(_Row2.default, {
                    data: row,
                    colsConfig: _this4.props.colsConfig,
                    key: row[_this4.props.idKey] || i
                });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var header = this.renderHeader();
            var body = this.renderBody();

            return _react2.default.createElement(
                'table',
                { className: 'table' },
                _react2.default.createElement(
                    'thead',
                    { className: 'thead-default' },
                    _react2.default.createElement(
                        'tr',
                        null,
                        header
                    )
                ),
                _react2.default.createElement(
                    'tbody',
                    null,
                    body
                )
            );
        }
    }]);

    return Table;
}(_react.Component);

Table.propTypes = {
    data: _propTypes2.default.arrayOf(_propTypes2.default.objectOf(_propTypes2.default.any)),
    colsConfig: _tablePropTypes.ColsConfig.isRequired,
    loading: _propTypes2.default.bool,
    order: _propTypes2.default.oneOf([-1, 0, 1, '-1', '0', '1']),
    orderBy: _propTypes2.default.string,
    onOrderChange: _propTypes2.default.func,
    idKey: _propTypes2.default.string
};

Table.defaultProps = {
    order: 0,
    idKey: 'id'
};

exports.default = Table;