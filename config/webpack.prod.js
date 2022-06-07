const paths = require('./paths')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common,
    {
        mode: 'production',
        devtool: false,

        output: {
            path: paths.build,
            publicPath: './',
            filename: '[name].[contenthash].bundle.js'
        },

        plugins: [
            // will extract css into separate files. style-loader is for devel, MiniCssExtracPlugin is for production. They cannot be used together
            new MiniCssExtractPlugin({
                filename: 'styles/[name].[contenthash].css',
                chunkFilename: '[id].css'
            })
        ],

        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { importLoaders: 1 }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                }
            ]
        },

        // minifying javascript and css
        optimization: {
            minimizer: [
                new TerserJSPlugin({}),
                new OptimizeCSSAssetsPlugin({})
            ],

            /**
             * The build output will have several chunks, this option ensures the parts use
             * the webpack runtime instead of having their own.
             * 
             * It also gives long-term caching: the chunks will only change when actual code changes (not the webpack runtime)
             */
            runtimeChunk: 'single',

            /**
             * Separates common dependencies in one shared bundle. Ex: react is not going to change as often as the app code,
             * so we can cache its chunk separately
             */
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom|lodash)[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        },

        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    }
)