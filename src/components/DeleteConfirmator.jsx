
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from './Spinner';
import Modal from './Modal';
import AjaxErrorMessage from './AjaxErrorMessage';
import AjaxResource from '../AjaxResource';
import { StringOrFunc } from './tablePropTypes';

class DeleteConfirmator extends Component {

    constructor (props) {

        super(props);

        this.serverRequest = null;

        this.errorHandler = null;

        this.state = {
            loading: false
        };

        if (typeof props.resource === 'string') {
            this.resource = new AjaxResource(props.resource);
        } else {
            this.resource = props.resource;
        }

        this.mounted = true;
    }

    componentWillUnmount () {
        this.mounted = false;
    }

    onAjaxError (error) {
        if (!this.mounted) {
            return;
        }
        this.serverRequest = null;
        this.setState({ loading: false });

        if (this.errorHandler) {
            this.errorHandler.showError(error);
        }

        if (this.props.onDeleteDidFail) {
            this.props.onDeleteDidFail(error);
        }
    }

    onAjaxSuccess (data) {
        if (!this.mounted) {
            return;
        }
        this.serverRequest = null;
        this.setState({ loading: false });

        if (this.props.onDeleteDidFinish) {
            this.props.onDeleteDidFinish(data);
        }
    }

    onConfirm () {
        this.setState({ loading: true });

        this.resource.remove(this.props.id)
            .then(res => this.onAjaxSuccess(res))
            .catch(e => this.onAjaxError(e));
    }

    renderError () {
        return (<AjaxErrorMessage
            ref={(c) => { this.errorHandler = c; }}
            message={this.props.deleteErrorMessage}
            t={this.props.t}
        />);
    }

    render () {

        if (this.state.loading) {
            return (<div>
                <Spinner />
            </div>);
        }

        const { t, onDeleteDidFinish } = this.props;

        return (<Modal
            onClosed={() => onDeleteDidFinish()}
            customBody
            title={t('Delete item?')}
        >
            <section className="modal-card-body">
                {this.renderError()}
                <p>{t(this.props.deleteConfirmationMessage)}</p>
                <br />
                <br />
            </section>
            <footer className="modal-card-foot">
                <button
                    className="button is-danger"
                    onClick={() => this.onConfirm()}
                >
                    {t('Delete')}
                </button>
            </footer>
        </Modal>);
    }

}

DeleteConfirmator.propTypes = {
    onDeleteDidFinish: PropTypes.func,
    onDeleteDidFail: PropTypes.func,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    resource: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    t: PropTypes.func,
    deleteErrorMessage: StringOrFunc,
    deleteConfirmationMessage: StringOrFunc
};


DeleteConfirmator.defaultProps = {
    onDeleteDidFinish: () => {},
    onDeleteDidFail: () => {},
    t: a => a,
    deleteErrorMessage: 'Deletion failed.', // i18s
    deleteConfirmationMessage: 'Do you really want to remove the record?' // i18s
};

export default DeleteConfirmator;
