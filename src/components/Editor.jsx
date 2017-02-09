/**
 * @author David Menger
 */

import React, { PropTypes } from 'react';
import { ValidatorForm } from 'prg-form';
import Spinner from './Spinner';
import Modal from './Modal';
import AjaxErrorMessage from './AjaxErrorMessage';
import { StringOrFunc } from './tablePropTypes';
import AjaxResource from '../AjaxResource';

/**
 * Editor component
 * has theese props:
 *
 * - `validator` - required validator interface
 *   `{ validate: (data, ctx) => Promise, validateProp: (name, value, ctx, data) => Promise }`
 * - `updateErrorMessage` - default error message, when update fails
 * - `loadingErrorMessage` - default error message, when loading fails
 *
 * Not required, when running inside the {TableEditor}
 *
 * - `id` - identifier of item to edit
 * - `data` - data to edit (if provided, data are not loaded from resource)
 * - `resource` - API url or {AjaxResource} interface
 * - `t` - translator function
 * - `modalTitle` - boolean or string, which shows editor as Modal
 * - `onSubmitDidFinish` - success callback after submit
 * - `onSubmitDidFail` - error callback after submit
 *
 * @class Editor
 * @extends {React.Component}
 */
class Editor extends React.Component {

    constructor (props, context) {
        super(props, context);

        this.errorHandler = null;

        this.t = props.t || context.t || (w => w);
        this.resource = props.resource || context.resource;

        if (!this.resource) {
            throw new Error('');
        } else if (typeof this.resource === 'string') {
            this.resource = new AjaxResource(this.resource);
        }

        const id = props.id || context.editId;
        const loadedData = props.data || context.editData;

        this.state = {
            id,
            loadedData,
            loading: !loadedData && id,
            values: id && loadedData ? loadedData : {},
            loadingError: null
        };
    }

    componentWillMount () {
        if (this.state.loading) {
            this.loadData(true);
        }
    }

    componentWillUnmount () {
        this.resource.abort();
    }

    onDataLoad (data) {
        this.setState({
            loading: false,
            id: this.resource.getId(data),
            values: data,
            loadedData: data,
            loadingError: null
        });
    }

    onDataLoadError (e) {
        this.setState({
            loading: false,
            loadingError: e
        });
    }

    onSubmit (formData) {
        let promise;

        if (this.state.id) {
            promise = this.resource.update(this.state.id, formData);
        } else {
            promise = this.resource.create(formData);
        }

        promise.then(res => this.onAjaxSuccess(res))
            .catch(err => this.onAjaxError(err));
    }

    onValidationFailed () {
        this.setState({ loading: false });
    }

    onBeforeValidate (formData) {
        this.setState({ loading: true, values: formData });
    }

    onAjaxError (error) {
        this.setState({ loading: false });

        if (this.errorHandler) {
            this.errorHandler.showError(error);
        }
        if (this.props.onSubmitDidFail) {
            this.props.onSubmitDidFail(error);
        }
    }

    onAjaxSuccess (data) {
        this.serverRequest = null;

        let stay = true;

        if (this.context.onEditorDidFinish) {
            stay = this.context.onEditorDidFinish(data);
        }

        if (this.props.onSubmitDidFinish) {
            stay = this.props.onSubmitDidFinish(data);
        }

        const id = this.resource.getId(data);

        // keep loading, when component will exit
        if (stay) {
            this.setState({ loading: false, loadedData: data, values: data, id });
        }
    }

    onClosed () {
        if (this.context.onEditorDidFinish) {
            this.context.onEditorDidFinish(null);
        }

        if (this.props.onClosed) {
            this.props.onClosed(null);
        }
    }

    getContext () {
        let context = this.props.context;
        if (context && typeof context === 'object') {
            context = this.state.id ? context.update : context.create;
        }
        return context;
    }

    loadData (initial = false) {
        if (!initial) {
            this.setState({ loadingError: null, loading: true });
        }
        this.resource.getById(this.state.id)
                .then(data => this.onDataLoad(data))
                .catch(e => this.onDataLoadError(e));
    }

    renderError () {
        return (<AjaxErrorMessage
            ref={(c) => { this.errorHandler = c; }}
            message={this.props.updateErrorMessage}
            t={this.t}
        />);
    }

    render () {
        let content;
        const { id, loadingError } = this.state;

        if (loadingError) {
            content = (<AjaxErrorMessage
                ref={(c) => { this.errorHandler = c; }}
                message={this.props.loadingErrorMessage}
                error={loadingError}
                onTryAgain={() => this.loadData()}
                t={this.t}
            />);
        } else if (this.state.loading) {
            content = (<Spinner />);

        } else if (this.props.modalTitle || this.context.onEditorDidFinish) {
            let title = this.props.modalTitle;
            if (!title || typeof title === 'boolean') {
                title = id ? this.t('Edit item') : this.t('New item');
            }
            content = (<Modal
                onClosed={() => this.onClosed()}
                customBody
                title={title}
            >
                <section className="modal-card-body">
                    {this.renderError()}
                    {this.props.children}
                </section>
                <footer className="modal-card-foot">
                    <button
                        className="button is-primary"
                        formNoValidate
                        type="submit"
                    >
                        {this.t('Submit')}
                    </button>
                </footer>
            </Modal>);
        } else {
            content = (<span>
                {this.renderError()}
                {this.props.children}
                <button
                    className="button is-primary"
                    formNoValidate
                    type="submit"
                >
                    {this.t('Submit')}
                </button>
            </span>);
        }

        return (<ValidatorForm
            onSubmit={(...args) => this.onSubmit(...args)}
            onBeforeValidate={(...args) => this.onBeforeValidate(...args)}
            onValidationFailed={(...args) => this.onValidationFailed(...args)}
            validator={this.props.validator}
            className="form-editor"
            validatorContext={this.getContext()}
            t={this.t}
            values={this.state.values}
        >
            {content}
        </ValidatorForm>);
    }

}

Editor.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.any)
    ]),
    onSubmitDidFinish: PropTypes.func,
    onSubmitDidFail: PropTypes.func,
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    data: PropTypes.objectOf(PropTypes.any),
    resource: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    t: PropTypes.func,
    updateErrorMessage: StringOrFunc,
    loadingErrorMessage: StringOrFunc,
    validator: PropTypes.objectOf(PropTypes.any).isRequired,
    modalTitle: PropTypes.string,
    onClosed: PropTypes.func,
    context: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.shape({
            create: React.PropTypes.string,
            update: React.PropTypes.string
        })
    ])
};

Editor.defaultProps = {
    children: null,
    onSubmitDidFinish: null,
    onSubmitDidFail: null,
    id: null,
    data: null,
    loadingErrorMessage: 'Loading failed', // i18s
    updateErrorMessage: 'Submit failed.',  // i18s
    context: {
        create: 'create',
        update: 'update'
    },
    resource: null,
    modalTitle: null,
    onClosed: () => {},
    t: w => w
};

Editor.contextTypes = {
    resource: PropTypes.object,
    onEditorDidFinish: PropTypes.func,
    editId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    editData: PropTypes.object
};

export default Editor;
