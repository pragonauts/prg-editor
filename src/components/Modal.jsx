/**
 * @author David Menger
 */

import React, { PropTypes } from 'react';

function Modal ({ onClosed, children, title, footer, customBody }) {

    let body;
    let foot = null;

    if (customBody) {
        body = children;
    } else {
        body = (<section className="modal-card-body">
            {children}
        </section>);
        foot = (<footer className="modal-card-foot">
            {footer}
        </footer>);
    }

    return (<div
        className="modal is-active"
        aria-hidden="false"
    >
        <div className="modal-background" />
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">{title}</p>
                <button
                    type="button"
                    className="delete close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => onClosed()}
                />
            </header>
            {body}
            {foot}
        </div>
    </div>);
}

Modal.propTypes = {
    onClosed: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.any]),
    footer: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]),
    title: PropTypes.string,
    customBody: PropTypes.bool
};

Modal.defaultProps = {
    onClosed: () => {},
    children: null,
    footer: null,
    title: null,
    customBody: false
};

export default Modal;
