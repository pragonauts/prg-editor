'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StringOrFunc = exports.ColsConfig = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ColsConfig = exports.ColsConfig = _propTypes2.default.arrayOf(_propTypes2.default.objectOf(_propTypes2.default.any));

var StringOrFunc = exports.StringOrFunc = _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]);

exports.default = { ColsConfig: ColsConfig, StringOrFunc: StringOrFunc };