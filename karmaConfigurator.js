/*
 * @author David Menger
 */

require('webpack');
const webpackConfig = require('./webpack.config');
const path = require('path');

function karmaConfigurator (debug = false, coverage = false) {

    const webpack = Object.assign({}, webpackConfig, {
        devtool: '#inline-source-map', // just do inline source maps instead of the default
        watch: debug,
        externals: {
            cheerio: 'window',
            'react/lib/ExecutionEnvironment': true,
            'react/lib/ReactContext': true,
            'react/addons': true
        }
    });

    // fakin sinon
    Object.assign(webpack.module, {
        noParse: [
            /node_modules\/sinon\//
        ]
    });

    if (coverage) {
        webpack.module.rules = webpack.module.rules
            .map((mod) => {
                Object.assign(mod, {
                    use: mod.use.map((use) => {
                        if (!use.loader.match(/^babel/)) {
                            return module;
                        }
                        Object.assign(use.options, {
                            plugins: ['istanbul']
                        });
                        return use;
                    })
                });
                return mod;
            });
    }

    const config = {
        browsers: ['Chrome', 'Firefox'],
        singleRun: !debug,
        frameworks: ['mocha', 'sinon'],
        files: [
            'webpack.tests.js'
        ],
        plugins: [
            'karma-mocha',
            'karma-webpack',
            'karma-spec-reporter',
            'karma-chrome-launcher',
            'karma-safari-launcher',
            'karma-firefox-launcher',
            'karma-opera-launcher',
            'karma-sinon'
        ],
        preprocessors: {
            'webpack.tests.js': ['webpack']
        },
        webpack,
        reporters: ['spec'],
        webpackServer: {
            noInfo: true
        }
    };

    if (coverage) {
        config.plugins.push('karma-sourcemap-loader', 'karma-coverage');

        Object.assign(config, {
            coverageReporter: {
                // specify a common output directory
                dir: path.join(__dirname, 'coverage'),
                reporters: [
                    // reporters not supporting the `file` property
                    { type: 'json', file: 'coverage-public.json', subdir: brwsr => `${brwsr}`.replace(/\s.*$/, '') },
                    { type: 'lcov' }
                    // { type: 'html', subdir: 'report-html' }
                ],
                instrumenterOptions: {
                    istanbul: { noCompact: true }
                }
            },
            preprocessors: {
                'webpack.tests.js': ['webpack', 'sourcemap']
            },
            reporters: ['spec', 'coverage']
        });
    }

    return config;
}

module.exports = karmaConfigurator;
