/**
 * @author David Menger
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Simple Bulma Modal window
 *
 * ## PropTypes
 *
 * | prop | type | purpose |
 * |------|------|---------|
 * | `onClosed` | `function` - **required** | Called, when user presses close
 * | `title` | `string|react` - **required** | Is shown as title
 * | `footer` | `string|react` | Is used as footer when `customBody === false`
 * | `customBody` | `boolean` | Enable to use own body and footer components (usefull for forms)
 *
 * @param {object} { onClosed, children, title, footer, customBody }
 * @returns {ReactDom}
 * @example
 * import { Modal } from 'prg-editor';
 *
 * // basic usage
 * <Modal
 *     title="Alert"
 *     onClosed={() => console.log('please close me')}
 * >
 *      <p className="title">Something Interesting!</p>
 * </Modal>
 *
 *
 * // providing own body
 * <Modal
 *     title="Alert"
 *     onClosed={() => console.log('please close me')}
 *     customBody
 * >
 *      <form>
 *          <section className="modal-card-body">
 *              <input name="input" />
 *          </section>
 *          <footer className="modal-card-foot">
 *              <button>Submit</button>
 *          </footer>
 *      </form>
 * </Modal>
 *
 */
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
