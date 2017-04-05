/**
 * @author David Menger
 */

import React, { PropTypes } from 'react';
import { Form } from 'prg-form';

function isEditor (child) {
    return child
        && typeof child.type === 'function'
        && child.type.name === 'Editor';
}

function hasForm (children) {
    if (isEditor(children)) {
        return true;
    } else if (Array.isArray(children)) {
        const formElement = children
            .filter(el => isEditor(el));

        if (formElement.length === 1) {
            return true;
        }
    }

    return false;
}

export function getFormChildren (children) {
    if (isEditor(children)) {
        return children;
    } else if (Array.isArray(children)) {
        const formElement = children
            .filter(el => isEditor(el));

        if (formElement.length === 1) {
            return formElement[0];
        }
    }

    return null;
}

function getHeaderChildren (children) {
    if (children && children.type === 'header') {
        return children.props.children;
    } else if (!Array.isArray(children)) {
        return null;
    }

    const header = children
        .filter(el => el.type === 'header');

    if (header.length !== 0) {
        return header[0].props.children;
    }
    return null;
}

export function TableEditorHeader ({
    disableAdd,
    children,
    onAddButtonClick,
    onResetHeaderForm,
    onHeaderSubmit,
    t,
    filterChanged,
    params
}) {

    let addButton = null;

    if (!disableAdd && hasForm(children)) {
        addButton = (<button
            onClick={() => onAddButtonClick()}
            className="button is-primary add-button"
        >{t('Add')}</button>);
    }

    const headersChildren = getHeaderChildren(children);

    return (<div className="columns is-multiline is-mobile">
        <div className="column editor-filters">
            <Form
                className="form-filter"
                onSubmit={(...args) => onHeaderSubmit(...args)}
                values={params}
            >
                <div className="field is-grouped">
                    {headersChildren}
                    {filterChanged && <p className="control">
                        <button
                            className="button is-void is-filter-reset"
                            type="button"
                            onClick={() => onResetHeaderForm()}
                        ><span className="delete" /></button>
                    </p>}
                    {headersChildren && <p className="control">
                        <button
                            className="button"
                            formNoValidate type="submit"
                        >
                            {t('Filter')}
                        </button>
                    </p>}
                </div>
            </Form>
        </div>
        <div className="column is-one-quarter has-text-right">
            {addButton}
        </div>
    </div>);
}

TableEditorHeader.propTypes = {
    t: PropTypes.func,
    disableAdd: PropTypes.bool,
    filterChanged: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.any]),
    onAddButtonClick: PropTypes.func.isRequired,
    onResetHeaderForm: PropTypes.func.isRequired,
    onHeaderSubmit: PropTypes.func.isRequired,
    params: PropTypes.objectOf(PropTypes.any)
};

TableEditorHeader.defaultProps = {
    t: w => w,
    disableAdd: false,
    filterChanged: false,
    children: null,
    params: null
};

export default { TableEditorHeader, getFormChildren };
