/**
 * @author David Menger
 */

import React from 'react';
import PropTypes from 'prop-types';

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
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.shape({
        attr: PropTypes.string.isRequired,
        map: PropTypes.func,
        href: PropTypes.func,
        onClick: PropTypes.func,
        condition: PropTypes.func,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ]).isRequired
    }).isRequired
};

export default ActionCell;
