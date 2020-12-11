// using webpack 4
// see https://itnext.io/how-to-optimise-your-serverless-typescript-webpack-eslint-setup-for-performance-86d052284505

const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: './angular/main.ts',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    chunkFilename: '[id].[chunkhash].js'
  },
  target: 'node',
  module: {
    rules: [
      {
        // all files with a '.json' extension will be handled by the json-loader
        test: /\.json$/,
        loader: 'json5-loader'
      },
      {
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [[/.serverless/], [/.webpack/]],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
      eslintOptions: {
        cache: true
      }
    })
  ]
};
