/**
 * @author David Menger
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorMessage extends Component {

    onCloseRequested () {
        if (typeof this.props.onCloseRequested === 'function') {
            this.props.onCloseRequested();
        }
    }

    render () {
        return (<div className="notification is-danger" role="alert">
            <button
                type="button"
                className="delete"
                aria-label="Close"
                onClick={e => this.onCloseRequested(e)}
            />
            <span className="text">{this.props.children}</span>
        </div>);
    }

}

ErrorMessage.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.any),
        PropTypes.string
    ]),
    onCloseRequested: PropTypes.func
};

ErrorMessage.defaultProps = {
    children: null,
    onCloseRequested: () => {}
};

export default ErrorMessage;
