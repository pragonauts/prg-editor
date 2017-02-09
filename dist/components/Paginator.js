"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Paginator(props) {
    return _react2.default.createElement(
        "nav",
        { className: "pagination is-centered" },
        _react2.default.createElement(
            "ul",
            { className: "pagination-list" },
            _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    "button",
                    {
                        type: "button",
                        className: "pagination-link button page-first",
                        disabled: props.page === 0,
                        onClick: function onClick() {
                            return props.onPageChange(0);
                        }
                    },
                    _react2.default.createElement("i", { className: "fa fa-angle-double-left", "aria-hidden": "true" })
                )
            ),
            _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    "span",
                    { className: "pagination-ellipsis" },
                    "\u2026"
                )
            ),
            _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    "button",
                    {
                        type: "button",
                        className: "pagination-link button page-prev",
                        disabled: props.page === 0,
                        onClick: function onClick() {
                            return props.onPageChange(props.page - 1);
                        }
                    },
                    _react2.default.createElement("i", { className: "fa fa-angle-left", "aria-hidden": "true" })
                )
            ),
            _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    "button",
                    {
                        type: "button",
                        className: "pagination-link button page-next",
                        disabled: props.page >= props.nextPage,
                        onClick: function onClick() {
                            return props.onPageChange(props.page + 1);
                        }
                    },
                    _react2.default.createElement("i", { className: "fa fa-angle-right", "aria-hidden": "true" })
                )
            ),
            _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    "span",
                    { className: "pagination-ellipsis" },
                    "\u2026"
                )
            ),
            _react2.default.createElement(
                "li",
                null,
                _react2.default.createElement(
                    "button",
                    {
                        type: "button",
                        className: "pagination-link button page-last",
                        disabled: props.page >= props.nextPage,
                        onClick: function onClick() {
                            return props.onPageChange(-1);
                        }
                    },
                    _react2.default.createElement("i", { className: "fa fa-angle-double-right", "aria-hidden": "true" })
                )
            )
        )
    );
}

Paginator.propTypes = {
    page: _react2.default.PropTypes.number,
    nextPage: _react2.default.PropTypes.number,
    onPageChange: _react2.default.PropTypes.func
};

Paginator.defaultProps = {
    page: 0,
    nextPage: 0,
    onPageChange: function onPageChange() {}
};

exports.default = Paginator;