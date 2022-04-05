/* eslint-disable @typescript-eslint/no-var-requires */

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

process.traceDeprecation = true;

module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  entry: './src/index.tsx',
  output: {
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  stats: {
    errorDetails: true
  },
  target: 'web',
  devServer: {
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        },
        extractComments: false
      }),
      '...',
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
    ],
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
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
        exclude: '/node_modules/',
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/assets/favicon.ico'
    }),
    new MiniCssExtractPlugin(),
    new webpack.DefinePlugin({
      'process.env.DEVELOPMENT': JSON.stringify(true),
      'process.env.TMDB_KEY': JSON.stringify('2a6fdeb294b4f2342ca8a611d7ecab34')
    })
  ]
};
