/**
 * @author David Menger
 */

import React from 'react';

class ErrorMessage extends React.Component {

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
    children: React.PropTypes.oneOfType([
        React.PropTypes.element,
        React.PropTypes.arrayOf(React.PropTypes.any),
        React.PropTypes.string
    ]),
    onCloseRequested: React.PropTypes.func
};

ErrorMessage.defaultProps = {
    children: null,
    onCloseRequested: () => {}
};

export default ErrorMessage;
