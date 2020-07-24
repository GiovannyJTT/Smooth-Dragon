const paths = require('./paths')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // Webpack will start looking in here
    entry: [paths.src + '/index.js'],

    // Webpack will put the bundle (compressed file) and resources (images) here
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    // Customization of the webpack build process
    plugins: [
        // cleans build folder and unused resources when re-building
        new CleanWebpackPlugin(),

        // copy resources from target to destination
        new copyWebpackPlugin(
            {
                from: paths.static,
                to: 'assets',
                ignore: ['*.DS_Store']
            }
        ),

        // generates an html file from the template
        new HtmlWebpackPlugin(
            {
                title: 'Smooth Dragon: WebGL app using Threejs for smoothing technique',  // inject this tittle when generating the html
                template: paths.src + '/html/template.html',  // input file
                filename: 'index.html'  // output file
            }
        )
    ],

    // define how modules are treated for this project
    module: {
        rules: [
            // use babel transcompiler for making javasctipt files compatible with old webbrowsers
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },

            // inject css into the head 
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: {sourceMap: true } }
                ]
            },

            // copy images into the build folder
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    context: 'src' // prevent display of src/ in filename
                }
            },

            // inline font files
            {
                test: /\.(woff(2)?|eot|ttf|otf|)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: '[path][name].[ext]',
                    context: 'src' // prevent display of src/ in filename  
                }
            }
        ]
    }
}
