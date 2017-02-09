/*
 * @author David Menger
 */

const karmaConfigurator = require('./karmaConfigurator');

module.exports = function karmaCoverageConfig (config) {
    config.set(karmaConfigurator(false, true));
};
