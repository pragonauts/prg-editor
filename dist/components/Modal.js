'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Modal(_ref) {
    var onClosed = _ref.onClosed,
        children = _ref.children,
        title = _ref.title,
        footer = _ref.footer,
        customBody = _ref.customBody;


    var body = void 0;
    var foot = null;

    if (customBody) {
        body = children;
    } else {
        body = _react2.default.createElement(
            'section',
            { className: 'modal-card-body' },
            children
        );
        foot = _react2.default.createElement(
            'footer',
            { className: 'modal-card-foot' },
            footer
        );
    }

    return _react2.default.createElement(
        'div',
        {
            className: 'modal is-active',
            'aria-hidden': 'false'
        },
        _react2.default.createElement('div', { className: 'modal-background' }),
        _react2.default.createElement(
            'div',
            { className: 'modal-card' },
            _react2.default.createElement(
                'header',
                { className: 'modal-card-head' },
                _react2.default.createElement(
                    'p',
                    { className: 'modal-card-title' },
                    title
                ),
                _react2.default.createElement('button', {
                    type: 'button',
                    className: 'delete close',
                    'data-dismiss': 'modal',
                    'aria-label': 'Close',
                    onClick: function onClick() {
                        return onClosed();
                    }
                })
            ),
            body,
            foot
        )
    );
}

Modal.propTypes = {
    onClosed: _propTypes2.default.func,
    children: _propTypes2.default.oneOfType([_propTypes2.default.any]),
    footer: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.arrayOf(_propTypes2.default.element)]),
    title: _propTypes2.default.string,
    customBody: _propTypes2.default.bool
};

Modal.defaultProps = {
    onClosed: function onClosed() {},
    children: null,
    footer: null,
    title: null,
    customBody: false
};

exports.default = Modal;