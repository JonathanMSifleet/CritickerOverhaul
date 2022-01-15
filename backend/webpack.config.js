const path = require('path');
// runs TypeScript linting on separate process
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: 'development',
  // devtool: 'eval-cheap-source-map',
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
    symlinks: true,
    cacheWithContext: false
  },
  output: {
    asyncChunks: true,
    libraryTarget: 'umd',
    path: path.join(__dirname, '.webpack'),
    chunkFilename: '[id].[chunkhash].js'
  },
  target: 'node',
  module: {
    rules: [
      {
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [[/node_modules/], [/.serverless/], [/.webpack/]],
        options: {
          transpileOnly: true
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './aws/**/*.{ts,tsx,js,jsx}'
      },
      typescript: true
    })
  ]
};
