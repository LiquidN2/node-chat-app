const path = require('path');

module.exports = {
    entry: {
        index: ['babel-polyfill', './public/src/js/index.js'],
        chat: ['babel-polyfill', './public/src/js/chat.js']
    },
    
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'dist/js/[name].js'
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