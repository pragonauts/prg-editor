/**
 * @author David Menger
 */

import React from 'react';
import Row from './Row';
import Spinner from './Spinner';
import { ColsConfig } from './tablePropTypes';

function renderArrow (order) {
    switch (order) {
        case 1:
            return <i className="fa fa-sort-asc" aria-hidden="true" />;
        case -1:
            return <i className="fa fa-sort-desc" aria-hidden="true" />;
        default:
            return null;
    }
}

class Table extends React.Component {

    orderBy (columnAttr, order = 0) {
        let nextOrder;
        let orderChanged = this.props.orderBy !== columnAttr;

        if (order === 0) {
            nextOrder = 0;
        } else if (orderChanged) {
            nextOrder = order;
        } else {
            orderChanged = true;
            nextOrder = this.props.order * -1;
        }

        if (orderChanged && this.props.onOrderChange) {
            this.props.onOrderChange(columnAttr, nextOrder);
        }
    }

    /**
     * Renders column of table header
     *
     * @param {Object} config
     * @param {number} index
     */
    renderHeaderColumn (config, index) {
        let content;

        if (config.orderBy) {
            let order = 0;

            if (this.props.orderBy === config.orderBy) {
                order = parseInt(this.props.order, 10);
            }

            content = (<button
                type="button"
                className="button is-void"
                onClick={() => this.orderBy(config.orderBy, config.order)}
            >
                {config.name}{renderArrow(order)}
            </button>);
        } else {
            content = (<button type="button" className="button is-void" disabled>
                {config.name}
            </button>);
        }

        return (<th key={index}>
            {content}
        </th>);
    }

    renderHeader () {
        return this.props.colsConfig
            .map((config, index) => this.renderHeaderColumn(config, index));
    }

    renderBody () {
        if (this.props.loading) {
            const colSpan = this.props.colsConfig.length;

            return (<tr><td colSpan={colSpan} className="loading"><Spinner /></td></tr>);
        }

        if (!this.props.data) {
            return null;
        }

        return this.props.data
            .map((row, i) => <Row
                data={row}
                colsConfig={this.props.colsConfig}
                key={row[this.props.idKey] || i}
            />);
    }

    render () {
        const header = this.renderHeader();
        const body = this.renderBody();

        return (<table className="table">
            <thead className="thead-default">
                <tr>{header}</tr>
            </thead>
            <tbody>
                {body}
            </tbody>
        </table>);
    }

}

Table.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.objectOf(
        React.PropTypes.any
    )),
    colsConfig: ColsConfig.isRequired,
    loading: React.PropTypes.bool,
    order: React.PropTypes.oneOf([-1, 0, 1, '-1', '0', '1']),
    orderBy: React.PropTypes.string,
    onOrderChange: React.PropTypes.func,
    idKey: React.PropTypes.string
};

Table.defaultProps = {
    order: 0,
    idKey: 'id'
};

export default Table;
