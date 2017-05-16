/**
 * @author David Menger
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';
import { StringOrFunc } from './tablePropTypes';

class AjaxErrorMessage extends Component {

    constructor (props) {
        super(props);
        this.state = {
            error: props.error
        };
    }

    onTryAgain () {
        this.setState({ error: null });
        this.props.onTryAgain();
    }

    showError (jqXHR) {
        this.setState({ error: jqXHR });
    }

    render () {
        if (!this.state.error) {
            return null;
        }

        let error;

        if (typeof this.props.message === 'function') {
            error = this.props.message(this.state.error);
        } else {
            error = this.props.t(this.props.message);
        }

        let tryAgainButton = null;

        if (this.props.onTryAgain) {
            tryAgainButton = (<button
                type="button"
                className="button is-danger is-inverted is-outlined try-again"
                onClick={() => this.onTryAgain()}
            >{this.props.t('Try it again')}</button>);
        }

        return (<ErrorMessage
            onCloseRequested={() => this.setState({ error: null })}
        >
            <div className="columns is-vcentered">
                <div className="column is-narrow">
                    {error}
                </div>
                {tryAgainButton && <div className="column is-narrow">
                    {tryAgainButton}
                </div>}
            </div>
        </ErrorMessage>);
    }

}

AjaxErrorMessage.propTypes = {
    message: StringOrFunc.isRequired,
    t: PropTypes.func,
    onTryAgain: PropTypes.func,
    error: PropTypes.oneOfType([PropTypes.any])
};

AjaxErrorMessage.defaultProps = {
    t: a => a,
    onTryAgain: null,
    error: null
};

export default AjaxErrorMessage;
