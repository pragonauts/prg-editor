/*
 * @author David Menger
 */

const karmaConfigurator = require('./test/karmaConfigurator');

module.exports = function karmaConfig (config) {
    config.set(karmaConfigurator(false));
};
