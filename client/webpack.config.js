const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: './src/index.tsx',
  output: {
    filename: 'index.bundle.js',
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  target: 'web',
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils
      'react/jsx-runtime': 'preact/jsx-runtime'
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/inline'
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/favicon.ico'
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env.DEVELOPMENT': JSON.stringify(true),
      'process.env.SAVE_MONEY': JSON.stringify(true),
      'process.env.TMDB_KEY': JSON.stringify('2a6fdeb294b4f2342ca8a611d7ecab34')
    })
  ]
};
