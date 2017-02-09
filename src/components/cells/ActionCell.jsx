/**
 * @author David Menger
 */

import React from 'react';

const EMPTY_HREF = '#';

function ActionCell ({ config, data }) {

    const { attr, map, onClick, condition } = config;

    let value = data[attr];

    if (map) {
        value = map(value, data);
    }

    let href = EMPTY_HREF;
    let label = config.label;

    if (config.href) {
        href = config.href(value, data);
    } else if (!onClick) {
        href = value;
    }

    if (typeof label === 'function') {
        label = label(value, data);
    }

    if (condition && !condition(value, data)) {
        return null;
    }

    return (<a
        href={href}
        onClick={(e) => {
            if (onClick) {
                if (href === EMPTY_HREF) {
                    e.preventDefault();
                }
                onClick(value, data, e);
            }
        }}
    >{label}</a>);
}

ActionCell.propTypes = {
    data: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
    config: React.PropTypes.shape({
        attr: React.PropTypes.string.isRequired,
        map: React.PropTypes.func,
        href: React.PropTypes.func,
        onClick: React.PropTypes.func,
        condition: React.PropTypes.func,
        label: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.func
        ]).isRequired
    }).isRequired
};

export default ActionCell;
