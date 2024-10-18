const path = require('path');

module.exports = {
    entry: {
    },

    output: {
        filename: '[name].js',
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, 'dist'),
        library: 'apipackage-library',
        libraryTarget: 'umd'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
        rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
    }
};