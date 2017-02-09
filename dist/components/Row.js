'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tablePropTypes = require('./tablePropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Row(props) {
    var cols = props.colsConfig.map(function (config) {
        return _react2.default.createElement(
            'td',
            {
                key: config.id
            },
            _react2.default.createElement(config.Cell, {
                data: props.data,
                config: config
            })
        );
    });

    return _react2.default.createElement(
        'tr',
        null,
        cols
    );
}

Row.propTypes = {
    data: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.any).isRequired,
    colsConfig: _tablePropTypes.ColsConfig.isRequired
};

exports.default = Row;