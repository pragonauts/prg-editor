/*
 * @author David Menger
 */

import PropTypes from 'prop-types';

export const ColsConfig = PropTypes.arrayOf(PropTypes.objectOf(
    PropTypes.any
));

export const StringOrFunc = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
]);

export default { ColsConfig, StringOrFunc };
