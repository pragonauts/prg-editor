'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StringOrFunc = exports.ColsConfig = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColsConfig = exports.ColsConfig = _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.objectOf(_react2.default.PropTypes.any));

var StringOrFunc = exports.StringOrFunc = _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func]);

exports.default = { ColsConfig: ColsConfig, StringOrFunc: StringOrFunc };