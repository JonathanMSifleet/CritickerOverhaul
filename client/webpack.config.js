const path = require('path');
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import nodeExternals from 'webpack-node-externals';

module.exports = {
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.bundle.js'
  },
  devServer: {
    port: 3000,
    watchContentBase: true
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /nodeModules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new MiniCssExtractPlugin()
  ]
};
