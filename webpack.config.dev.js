'use strict';

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
var dir = path.resolve(__dirname, 'dist');

module.exports = {

  entry: './src/app.ts',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    path: dir,
    filename: 'main_bundle.js'
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  },
  devServer: {
    contentBase: './src',
    stats: {
      warnings: false
    },
    host: '0.0.0.0',
    port: '3001'
  }
};