/**
 * @author David Menger
 */

import React from 'react';

function Paginator (props) {
    return (<nav className="pagination is-centered">
        <ul className="pagination-list">
            <li>
                <button
                    type="button"
                    className="pagination-link button page-first"
                    disabled={props.page === 0}
                    onClick={() => props.onPageChange(0)}
                >
                    <i className="fa fa-angle-double-left" aria-hidden="true" />
                </button>
            </li>
            <li><span className="pagination-ellipsis">&hellip;</span></li>
            <li>
                <button
                    type="button"
                    className="pagination-link button page-prev"
                    disabled={props.page === 0}
                    onClick={() => props.onPageChange(props.page - 1)}
                >
                    <i className="fa fa-angle-left" aria-hidden="true" />
                </button>
            </li>
            <li>
                <button
                    type="button"
                    className="pagination-link button page-next"
                    disabled={props.page >= props.nextPage}
                    onClick={() => props.onPageChange(props.page + 1)}
                >
                    <i className="fa fa-angle-right" aria-hidden="true" />
                </button>
            </li>
            <li><span className="pagination-ellipsis">&hellip;</span></li>
            <li>
                <button
                    type="button"
                    className="pagination-link button page-last"
                    disabled={props.page >= props.nextPage}
                    onClick={() => props.onPageChange(-1)}
                >
                    <i className="fa fa-angle-double-right" aria-hidden="true" />
                </button>
            </li>
        </ul>
    </nav>);
}

Paginator.propTypes = {
    page: React.PropTypes.number,
    nextPage: React.PropTypes.number,
    onPageChange: React.PropTypes.func
};

Paginator.defaultProps = {
    page: 0,
    nextPage: 0,
    onPageChange: () => {}
};

export default Paginator;
