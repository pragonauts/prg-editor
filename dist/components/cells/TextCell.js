'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TextCell(_ref) {
    var config = _ref.config,
        data = _ref.data;

    var value = data[config.attr];

    if (config.map) {
        value = config.map(value, data);
    }

    return _react2.default.createElement(
        'div',
        null,
        value
    );
}

TextCell.propTypes = {
    data: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
    config: _propTypes2.default.shape({
        attr: _propTypes2.default.string.isRequired,
        map: _propTypes2.default.func
    }).isRequired
};

exports.default = TextCell;