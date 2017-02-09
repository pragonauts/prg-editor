/*
 * @author David Menger
 */

const context = require.context('./test', true, /\.jsx?$/);

context.keys().forEach(context);
