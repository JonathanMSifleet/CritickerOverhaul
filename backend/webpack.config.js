import path from 'path';
import nodeExternals from 'webpack-node-externals';
// runs TypeScript linting on separate process
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const webpack = {
  context: __dirname,
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  entry: {
    auth: './aws/handlers/auth.ts',
    deleteAccount: './aws/handlers/deleteAccount.ts',
    getAllReviews: './aws/handlers/getAllReviews.ts',
    getReview: './aws/handlers/getReview.ts',
    login: './aws/handlers/login.ts',
    private: './aws/handlers/private.ts',
    public: './aws/handlers/public.ts',
    setReviewPicture: './aws/handlers/setReviewPicture.ts',
    signup: './aws/handlers/signup.ts'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.json'],
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

export default webpack;
