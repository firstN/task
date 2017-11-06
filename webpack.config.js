const { CheckerPlugin } = require('awesome-typescript-loader');

let path,
  webpack,
  del,
  HtmlWebpackPlugin,
  ExtractTextPlugin;

path = require('path');
webpack = require('webpack');
del = require('del');
HtmlWebpackPlugin = require('html-webpack-plugin');
ExtractTextPlugin = require("extract-text-webpack-plugin");

const env = (process.env.NODE_ENV).replace(/[ ]/g, '');
const envProduction = env === 'production';
const envDevelopment = env === 'development';

// ***************** NODE_ENV diagnostics //
console.log(`Current NODE_ENV mode: ${env}`);
console.log();
const hr = `Match for "development" mode: ${envDevelopment}`.replace(/[a-z": ]/gi, '*');
console.log(hr);
console.log(`Check for regex issues`);
console.log(`Match for "production" mode: ${envProduction}`);
console.log(`Match for "development" mode: ${envDevelopment}`);
console.log(hr);
console.log();
// ************************************** //

const namespace = {
  jsBundle: 'bundle.js',
  cssBundle: 'styles.css'
}

// remove all files from "dist" folder
del('./dist/**');
del('./npm-debug.log');

// webpack config object
const config = {
  output: {
    path: __dirname + '/dist',
    filename: namespace.jsBundle
  },
  entry: './src/main.js',
  module: {
    loaders: [
      // Controller Scripts
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
          }
        ]
      },
      {
        test: /test\.js$/,
        loader: 'mocha-loader'
      },
      {
        test: /\.jsx$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015', 'react'] }
        }]
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          tsconfig: './tsconfig.json'
        }
      },
      { test: /\.coffee$/, loader: "coffeescript-loader" },

      // Model Data
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.yaml$/,
        use: [
          { loader: 'json-loader' },
          { loader: 'yaml-loader' },
        ]
      },

      // View Template Engines
      {
        test: /\.html$/,
        use: { loader: 'html-loader', options: { attrs: [':data-src'] } }
      },
      { test: /\.ejs$/, loader: 'ejs-loader' },
      { test: /\.jade$/, loader: 'jade-loader' },

      // View CSS Engines
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader' },
            { loader: 'stylus-loader' }
          ],
          fallback: 'style-loader'
        })
      },
      // View Image Engines
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=img/[name].[ext]',
          'img-loader'
        ]
      } // need some stability checks
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.jade'
    }),
    new CheckerPlugin(),
    new ExtractTextPlugin(namespace.cssBundle),
    new webpack.ProvidePlugin({
      _: 'underscore',
      JQ: 'jquery'
    })
  ],
  devtool: (envDevelopment ? 'source-map' : false),
  devServer: {
    compress: false,
    port: 2080,
  }
}

if (envProduction) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = config;