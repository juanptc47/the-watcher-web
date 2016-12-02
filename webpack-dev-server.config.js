const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'build');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');

const config = {
    // Entry points to the project
    entry: [
        'webpack/hot/dev-server',
        'webpack/hot/only-dev-server',
        path.join(__dirname, '/src/app/App.js')
    ],
    // Server Configuration options
    devServer: {
        contentBase: 'src/www', // Relative directory for base of server
        devtool: 'eval',
        hot: true, // Live-reload
        inline: true,
        port: 3000, // Port Number
        host: 'localhost', // Change to '0.0.0.0' for external facing server
    },
    devtool: 'eval',
    output: {
        path: buildPath, // Path of output file
        filename: 'app.js',
    },
    plugins: [
      // Enables Hot Modules Replacement
      new webpack.HotModuleReplacementPlugin(),
      // Allows error warnings but does not stop compiling.
      new webpack.NoErrorsPlugin(),
      // Moves files
      new TransferWebpackPlugin([
          {from: 'www'},
      ], path.resolve(__dirname, 'src')),
      new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
      }),
    ],
    resolve: {
        extensions: ['', '.js'],
        root: path.resolve('./src')
    },
    module: {
        loaders: [
            {test: /\.js?$/, loader: 'babel-loader', exclude: [nodeModulesPath], query: {presets: ['es2015']}},
            {test: /\.scss$/, loaders: [ 'style', 'css', 'sass']},
            {test: /\.css$/, loaders: [ 'style', 'css']},
            {test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/, loader: 'file-loader'},
            {test: /\.html$/, loader: 'underscore-template-loader', query: {engine: 'lodash',}},
            {test: /\.json$/, loaders: ['json']},
        ],
    },
};

module.exports = config;
