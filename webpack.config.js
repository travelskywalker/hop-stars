'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Uglify = require("uglifyjs-webpack-plugin");
const path = require('path');
var dir = path.resolve(__dirname, 'dist');

module.exports = {

  entry: {
    client: ['./src/app.ts'],
    vendor: ['pixi.js', 'rxjs'],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: '[hash].bundle.js',
    chunkFilename: 'migames.engine.js',
    path: dir,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        },
      }
    }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new CleanWebpackPlugin([
      dir
    ]),
    new CopyWebpackPlugin([{ from: './src/assets', to: './assets'}]),
    new HtmlWebpackPlugin({
      template: 'src/index.prod.html'
    }),
    new Uglify()
  ]
};