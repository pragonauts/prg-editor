/**
 * @author David Menger
 */

import React from 'react';

function TextCell ({ config, data }) {
    let value = data[config.attr];

    if (config.map) {
        value = config.map(value, data);
    }

    return <div>{value}</div>;

}

TextCell.propTypes = {
    data: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
    config: React.PropTypes.shape({
        attr: React.PropTypes.string.isRequired,
        map: React.PropTypes.func
    }).isRequired
};

export default TextCell;
