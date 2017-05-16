/**
 * @author David Menger
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import DeleteConfirmator from './DeleteConfirmator';
import AjaxResource from '../AjaxResource';
import AjaxErrorMessage from './AjaxErrorMessage';
import { ColsConfig, StringOrFunc } from './tablePropTypes';
import Paginator from './Paginator';
import { TableEditorHeader, getFormChildren } from './TableEditorHeader';

/**
 * Main datagrid component
 * Accepts theese props:
 *
 * ## Props
 *
 * | prop | type | description |
 * |------|------|-------------|
 * | `params` | `Object` | Initial data for query |
 * | `colsConfig` | `Object[]` - **required** | output from {TableBuilder} to show in table
 * | `resource` | `string|AjaxResource` - **required** | url of resource or {AjaxResource}
 * | `t` | `function` | translator function (`word => word`)
 * | `loadingErrorMessage` | `string` | string to show when loading fails
 * | `deleteErrorMessage` | `string` | string to show in delete confirmation alert
 * | `limit` | `number` | required number of entries
 * | `disableAdd` | `boolean` | which determins to show an add button
 * | `onParamsChange` | `function` | switches component to controlled state
 *
 * ## Controlled TableEditor - managing state from the outside
 *
 * For controlling component state you can provide `onParamsChange` prop and manually
 * set the `params` property. So you can delegate controlling state to the React Router.
 *
 * @class TableEditor
 * @extends {Component}
 * @example
 * <TableEditor
 *     colsConfig={tableBuilder.getColsConfig()}
 *     resource="/api/models/:id?someQuery=1"
 * >
 *     <Editor
 *         validator={validator}
 *         context={{
 *             create: validator.CONTEXT_CREATE,
 *             update: validator.CONTEXT_UPDATE
 *         }}
 *     >
 *         <Input name="text" />
 *     </Editor>
 * </TableEditor>
 *
 * // or with filter form at the header
 * <TableEditor
 *     colsConfig={tableBuilder.getColsConfig()}
 *     resource="/api/models/:id?someQuery=1"
 * >
 *     <header>
 *         <Input
 *             name="search"
 *             placeholder="Search"
 *             controlClass="is-expanded"
 *             iconBefore={<i className="fa fa-search" aria-hidden="true" />}
 *         />
 *     </header>
 *     <Editor
 *         validator={validator}
 *     >
 *         <Input name="text" />
 *     </Editor>
 * </TableEditor>
 */
class TableEditor extends Component {

    constructor (props) {
        super(props);

        this.serverRequest = null;

        this.headerForm = null;

        this.errorHandler = null;

        this.state = {
            editorOpened: false,
            confirmingRemove: false,
            loading: true,
            data: [],
            params: {
                offset: 0,
                order: 1,
                orderBy: null,
                limit: props.limit
            },
            nextOffset: 0,
            editData: null,
            editId: null,
            deleteId: null,
            filterChanged: false
        };

        let defaultOrder = {};

        props.colsConfig.some((col) => {
            if (col.orderByDefault && col.orderBy) {
                defaultOrder = {
                    order: col.order,
                    orderBy: col.orderBy
                };
                return true;
            }
            return false;
        });

        if (typeof props.resource === 'string') {
            this.resource = new AjaxResource(props.resource);
        } else {
            this.resource = props.resource;
        }

        if (typeof props.params === 'object') {
            Object.assign(this.state.params, defaultOrder, props.params);
        } else {
            Object.assign(this.state.params, defaultOrder);
        }
    }

    getChildContext () {
        return {
            resource: this.resource,
            onEditorDidFinish: data => this.onEditorDidFinish(data),
            editId: this.state.editId,
            editData: this.state.editData,
            t: this.props.t
        };
    }

    componentDidMount () {
        this.loadData(this.state.params, true);
    }

    componentWillReceiveProps (props) {
        if (this.props.params !== props.params) {
            this.loadData(props.params);
        }
    }

    componentWillUnmount () {
        this.resource.abort();
    }

    onAjaxError (error) {
        if (error && `${error.statusText}` === 'abort') {
            // request was aborted
            return;
        }
        console.error(error); // eslint-disable-line
        this.setState({ loading: false, error });
        this.errorHandler.showError(error);
    }

    onAjaxSuccess (data) {
        const params = Object.assign({}, this.state.params, {
            offset: data.offset || this.state.params.offset
        });

        this.setState({
            loading: false,
            data: data.data,
            nextOffset: data.nextOffset,
            params
        });
    }

    onAddButtonClick () {
        this.setState({ editId: null, editData: null, editorOpened: true });
    }

    onEditorDidFinish (data = null) {
        this.setState({ editorOpened: false });
        if (data !== null) {
            this.requestDataLoad();
        }
    }

    onDeleteConfirmationFinished (data) {
        this.setState({ confirmingRemove: false });
        if (data !== null) {
            this.requestDataLoad();
        }
    }

    onDeleteConfirmationClosed () {
        this.setState({ confirmingRemove: false });
    }

    onHeaderSubmit (params) {
        this.setState({ filterChanged: true });
        this.requestDataLoad(Object.assign({}, params, { page: 0 }));
    }

    requestDataLoad (params = {}, overrideParams = false) {
        let newParams;
        if (overrideParams) {
            newParams = params;
        } else {
            newParams = Object.assign({}, this.state.params, params);
        }

        if (this.props.onParamsChange !== null) {
            this.props.onParamsChange(newParams);
        } else {
            this.loadData(newParams);
        }
    }

    loadData (params = {}, initial = false) {

        if (!initial) {
            this.setState({
                loading: true,
                params,
                data: [],
                nextOffset: 0
            });
        }

        this.resource.getAll(params)
            .then(data => this.onAjaxSuccess(data))
            .catch(err => this.onAjaxError(err));
    }

    resetHeaderForm () {
        const { order, orderBy } = this.state.params;
        this.setState({ filterChanged: false });
        this.requestDataLoad({ offset: 0, order, orderBy, limit: this.props.limit }, true);
    }

    /**
     * Open editor with given item
     *
     * @param {string|Object} idOrData - identifier or object
     *
     * @memberOf TableEditor
     */
    edit (idOrData) {
        let editId;
        let editData = null;

        if (typeof idOrData === 'object') {
            editId = this.resource.getId(idOrData);
            editData = idOrData;
        } else {
            editId = idOrData;
        }

        this.setState({ editId, editData, editorOpened: true });
    }

    /**
     * Open delete confirmation dialog
     *
     * @param {string|Object} idOrData - identifier or object
     *
     * @memberOf TableEditor
     */
    delete (idOrData) {
        const deleteId = typeof idOrData === 'object' ? this.resource.getId(idOrData) : idOrData;
        this.setState({ deleteId, confirmingRemove: true });
    }

    renderEditor () {
        return getFormChildren(this.props.children);
    }

    renderRemovalConfirmation () {
        return (<DeleteConfirmator
            id={this.state.deleteId}
            resource={this.props.resource}
            t={this.props.t}
            onDeleteDidFinish={data => this.onDeleteConfirmationFinished(data)}
            deleteErrorMessage={this.props.deleteErrorMessage}
        />);
    }

    renderError () {
        return (<AjaxErrorMessage
            ref={(c) => {
                this.errorHandler = c;
            }}
            message={this.props.loadingErrorMessage}
            t={this.props.t}
            onTryAgain={() => this.requestDataLoad()}
        />);
    }

    renderPaginator () {
        const { offset, limit } = this.state.params;
        const page = offset / limit;

        return (<Paginator
            page={page}
            nextPage={this.state.nextOffset ? page + 1 : 0}
            onPageChange={p => this.requestDataLoad({ offset: p >= 0 ? p * limit : -1 })}
        />);
    }

    renderTable () {
        const { t, disableAdd, colsConfig } = this.props;
        const { filterChanged, params, loading, data } = this.state;

        return (<div>
            <TableEditorHeader
                t={t}
                disableAdd={disableAdd}
                filterChanged={filterChanged}
                onAddButtonClick={() => this.onAddButtonClick()}
                onResetHeaderForm={() => this.resetHeaderForm()}
                onHeaderSubmit={(...args) => this.onHeaderSubmit(...args)}
                params={params}
            >{this.props.children}</TableEditorHeader>
            {this.renderPaginator()}
            <Table
                data={data}
                colsConfig={colsConfig}
                loading={loading}
                order={params.order}
                orderBy={params.orderBy}
                onOrderChange={(orderBy, order) => this.requestDataLoad({ order, orderBy })}
            />
            {this.renderPaginator()}
        </div>);
    }

    render () {
        return (<div className="container is-fluid is-fullwidth is-self-top">
            {this.renderError()}
            {this.renderTable()}
            {this.state.editorOpened
                ? this.renderEditor() : null}
            {this.state.confirmingRemove
                ? this.renderRemovalConfirmation() : null}
        </div>);
    }

}

TableEditor.propTypes = {
    children: PropTypes.oneOfType([PropTypes.any]),
    colsConfig: ColsConfig.isRequired,
    params: PropTypes.objectOf(PropTypes.any),
    resource: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    t: PropTypes.func,
    loadingErrorMessage: StringOrFunc,
    deleteErrorMessage: StringOrFunc,
    limit: PropTypes.number,
    disableAdd: PropTypes.bool,
    onParamsChange: PropTypes.func
};

TableEditor.childContextTypes = {
    resource: PropTypes.object,
    onEditorDidFinish: PropTypes.func.isRequired,
    editId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    editData: PropTypes.object,
    t: PropTypes.func
};

TableEditor.defaultProps = {
    children: null,
    params: null,
    t: a => a,
    loadingErrorMessage: 'Loading failed', // i18s
    deleteErrorMessage: 'Delete failed', // i18s
    disableAdd: false,
    limit: 20,
    onParamsChange: null
};

export default TableEditor;
