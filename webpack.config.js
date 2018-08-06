const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './public/src/js/index.js'],
    
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'dist/js/bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};