/* eslint import/no-extraneous-dependencies: 0 */

const path = require('path');

module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        path: path.join(__dirname, 'public', 'assets'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        // dont forget to switch commons
        alias: {
        //    react: 'preact-compat',
        //    'react-dom': 'preact-compat'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules(\\|\/)(?!(prg-[a-z]+)(\\|\/)).*/i,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', 'es2015'],
                            cacheDirectory: true
                        }
                    }
                ]
            }
        ]
    }
};
