// using webpack 4
// see https://itnext.io/how-to-optimise-your-serverless-typescript-webpack-eslint-setup-for-performance-86d052284505

const path = require('path');
const _ = require('lodash');
const slsw = require('serverless-webpack');

const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: {
    angular: './client/src/main.ts',
    auth: './backend/aws/handlers/auth.ts',
    deleteAccount: './backend/aws/handlers/deleteAccount.ts',
    getAllReviews: './backend/aws/handlers/getAllReviews.ts',
    getReview: './backend/aws/handlers/getReview.ts',
    login: './backend/aws/handlers/login.ts',
    private: './backend/aws/handlers/private.ts',
    public: './backend/aws/handlers/public.ts',
    signup: './backend/aws/handlers/signup.ts',
    uploadReviewPicture: './backend/aws/handlers/uploadReviewPicture.ts'
  },
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: true,
    cacheWithContext: false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    chunkFilename: '[id].[chunkhash].js'
  },
  target: 'node',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
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
        exclude: [[/node_modules/], [/.serverless/], [/.webpack/]],
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
