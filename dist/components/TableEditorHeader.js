'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFormChildren = getFormChildren;
exports.TableEditorHeader = TableEditorHeader;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _prgForm = require('prg-form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isEditor(child) {
    return child && typeof child.type === 'function' && child.type.name === 'Editor';
}

function hasForm(children) {
    if (isEditor(children)) {
        return true;
    } else if (Array.isArray(children)) {
        var formElement = children.filter(function (el) {
            return isEditor(el);
        });

        if (formElement.length === 1) {
            return true;
        }
    }

    return false;
}

function getFormChildren(children) {
    if (isEditor(children)) {
        return children;
    } else if (Array.isArray(children)) {
        var formElement = children.filter(function (el) {
            return isEditor(el);
        });

        if (formElement.length === 1) {
            return formElement[0];
        }
    }

    return null;
}

function getHeaderChildren(children) {
    if (children && children.type === 'header') {
        return children.props.children;
    } else if (!Array.isArray(children)) {
        return null;
    }

    var header = children.filter(function (el) {
        return el.type === 'header';
    });

    if (header.length !== 0) {
        return header[0].props.children;
    }
    return null;
}

function TableEditorHeader(_ref) {
    var disableAdd = _ref.disableAdd,
        children = _ref.children,
        onAddButtonClick = _ref.onAddButtonClick,
        onResetHeaderForm = _ref.onResetHeaderForm,
        onHeaderSubmit = _ref.onHeaderSubmit,
        t = _ref.t,
        filterChanged = _ref.filterChanged,
        params = _ref.params;


    var addButton = null;

    if (!disableAdd && hasForm(children)) {
        addButton = _react2.default.createElement(
            'button',
            {
                onClick: function onClick() {
                    return onAddButtonClick();
                },
                className: 'button is-primary add-button'
            },
            t('Add')
        );
    }

    var headersChildren = getHeaderChildren(children);

    return _react2.default.createElement(
        'div',
        { className: 'columns is-multiline is-mobile' },
        _react2.default.createElement(
            'div',
            { className: 'column editor-filters' },
            _react2.default.createElement(
                _prgForm.Form,
                {
                    className: 'form-filter',
                    onSubmit: function onSubmit() {
                        return onHeaderSubmit.apply(undefined, arguments);
                    },
                    values: params
                },
                _react2.default.createElement(
                    'div',
                    { className: 'field is-grouped' },
                    headersChildren,
                    filterChanged && _react2.default.createElement(
                        'p',
                        { className: 'control' },
                        _react2.default.createElement(
                            'button',
                            {
                                className: 'button is-void is-filter-reset',
                                type: 'button',
                                onClick: function onClick() {
                                    return onResetHeaderForm();
                                }
                            },
                            _react2.default.createElement('span', { className: 'delete' })
                        )
                    ),
                    headersChildren && _react2.default.createElement(
                        'p',
                        { className: 'control' },
                        _react2.default.createElement(
                            'button',
                            {
                                className: 'button',
                                formNoValidate: true, type: 'submit'
                            },
                            t('Filter')
                        )
                    )
                )
            )
        ),
        _react2.default.createElement(
            'div',
            { className: 'column is-one-quarter has-text-right' },
            addButton
        )
    );
}

TableEditorHeader.propTypes = {
    t: _react.PropTypes.func,
    disableAdd: _react.PropTypes.bool,
    filterChanged: _react.PropTypes.bool,
    children: _react.PropTypes.oneOfType([_react.PropTypes.any]),
    onAddButtonClick: _react.PropTypes.func.isRequired,
    onResetHeaderForm: _react.PropTypes.func.isRequired,
    onHeaderSubmit: _react.PropTypes.func.isRequired,
    params: _react.PropTypes.objectOf(_react.PropTypes.any)
};

TableEditorHeader.defaultProps = {
    t: function t(w) {
        return w;
    },
    disableAdd: false,
    filterChanged: false,
    children: null,
    params: null
};

exports.default = { TableEditorHeader: TableEditorHeader, getFormChildren: getFormChildren };