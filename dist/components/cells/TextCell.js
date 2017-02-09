'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
    data: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.any).isRequired,
    config: _react2.default.PropTypes.shape({
        attr: _react2.default.PropTypes.string.isRequired,
        map: _react2.default.PropTypes.func
    }).isRequired
};

exports.default = TextCell;