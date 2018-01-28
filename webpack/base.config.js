const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outDir = path.resolve(__dirname, '../dist');
const filesToCopy = [
  {from: path.resolve(__dirname, '../src/icons'), to: outDir},
  {from: path.resolve(__dirname, '../src/manifest.json'), to: outDir},
  {from: path.resolve(__dirname, '../src/browserconfig.xml'), to: outDir},
];

const extractSass = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  // disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  entry: [path.resolve(__dirname, '../src/index.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(scss)$/,
        use: extractSass.extract({
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS modules
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    // publicPath: '/built/',
    filename: '[hash].bundle.js',
    devtoolModuleFilenameTemplate: '[resource-path]', // copied from Mathias, see: https://webpack.github.io/docs/configuration.html#output-devtoolmodulefilenametemplate
  },
  resolve: {
    extensions: ['.js'],
  },
  stats: {
    colors: true,
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new CopyWebpackPlugin(filesToCopy, {copyUnmodified: false}),
  ],
};
