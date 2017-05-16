'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMPTY_HREF = '#';

function ActionCell(_ref) {
    var config = _ref.config,
        data = _ref.data;
    var attr = config.attr,
        map = config.map,
        _onClick = config.onClick,
        condition = config.condition;


    var value = data[attr];

    if (map) {
        value = map(value, data);
    }

    var href = EMPTY_HREF;
    var label = config.label;

    if (config.href) {
        href = config.href(value, data);
    } else if (!_onClick) {
        href = value;
    }

    if (typeof label === 'function') {
        label = label(value, data);
    }

    if (condition && !condition(value, data)) {
        return null;
    }

    return _react2.default.createElement(
        'a',
        {
            href: href,
            onClick: function onClick(e) {
                if (_onClick) {
                    if (href === EMPTY_HREF) {
                        e.preventDefault();
                    }
                    _onClick(value, data, e);
                }
            }
        },
        label
    );
}

ActionCell.propTypes = {
    data: _propTypes2.default.objectOf(_propTypes2.default.any).isRequired,
    config: _propTypes2.default.shape({
        attr: _propTypes2.default.string.isRequired,
        map: _propTypes2.default.func,
        href: _propTypes2.default.func,
        onClick: _propTypes2.default.func,
        condition: _propTypes2.default.func,
        label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]).isRequired
    }).isRequired
};

exports.default = ActionCell;