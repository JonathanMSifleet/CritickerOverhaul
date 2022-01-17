// runs TypeScript linting on separate process
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  entry: slsw.lib.entries,
  target: 'node',
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    symlinks: true,
    cacheWithContext: false
  },
  output: {
    asyncChunks: true,
    path: path.join(__dirname, '.webpack'),
    chunkFilename: '[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: 'ts-loader',
        exclude: [[/node_modules/], [/.serverless/], [/.webpack/], [/client/]],
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './aws/**/*.ts'
      },
      typescript: true
    })
  ]
};
