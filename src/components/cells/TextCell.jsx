/**
 * @author David Menger
 */

import React from 'react';
import PropTypes from 'prop-types';

function TextCell ({ config, data }) {
    let value = data[config.attr];

    if (config.map) {
        value = config.map(value, data);
    }

    return <div>{value}</div>;

}

TextCell.propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    config: PropTypes.shape({
        attr: PropTypes.string.isRequired,
        map: PropTypes.func
    }).isRequired
};

export default TextCell;
