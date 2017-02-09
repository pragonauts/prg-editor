/**
 * @author David Menger
 */

import React from 'react';
import { ColsConfig } from './tablePropTypes';

function Row (props) {
    const cols = props.colsConfig
        .map(config => (<td
            key={config.id}
        ><config.Cell
            data={props.data}
            config={config}
        /></td>));

    return (<tr>{cols}</tr>);
}

Row.propTypes = {
    data: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
    colsConfig: ColsConfig.isRequired
};

export default Row;
