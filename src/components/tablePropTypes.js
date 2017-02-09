/*
 * @author David Menger
 */

import React from 'react';

export const ColsConfig = React.PropTypes.arrayOf(React.PropTypes.objectOf(
    React.PropTypes.any
));

export const StringOrFunc = React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.func
]);

export default { ColsConfig, StringOrFunc };
