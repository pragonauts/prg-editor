'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
    data: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.any).isRequired,
    config: _react2.default.PropTypes.shape({
        attr: _react2.default.PropTypes.string.isRequired,
        map: _react2.default.PropTypes.func,
        href: _react2.default.PropTypes.func,
        onClick: _react2.default.PropTypes.func,
        condition: _react2.default.PropTypes.func,
        label: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func]).isRequired
    }).isRequired
};

exports.default = ActionCell;