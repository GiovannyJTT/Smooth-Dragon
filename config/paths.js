const path = require('path')

module.exports = {
    src: path.resolve(__dirname, '../src'), // source files (libgptjs, main scripts)
    build: path.resolve(__dirname, '../dist'), // production built files (compressed, images, html, etc.)
    static: path.resolve(__dirname, '../resources') // assets to be copied to the build production folder
}