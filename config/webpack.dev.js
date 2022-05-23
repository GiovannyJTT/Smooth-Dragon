const paths = require('./paths')
const webpack = require('webpack')
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js')

module.exports = merge(common,
    {
        // set the mode to development or production
        mode: 'development',

        // control how the sourcemap are generated
        devtool: 'inline-source-map',

        // run a server for quick test
        devServer: {
            historyApiFallback: true,
            static: paths.build,
            open: true,
            compress: true,
            hot: true,
            port: 8080
        },

        plugins: [
            // useful for only updating what has changed
            new webpack.HotModuleReplacementPlugin()
        ]
    }
)