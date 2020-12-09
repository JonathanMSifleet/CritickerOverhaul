const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
module.exports = {
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  devtool: 'cheap-module-eval-source-map',
  // Specify the entry point for our app.
  entry: './angular/main.ts',
  resolve: {
    extensions: ['.mjs', '.json', '.ts'],
    symlinks: false,
    cacheWithContext: false,
  },
  // Specify the output file containing our bundled code
  output: {
    libraryTarget: 'commonjs',
    filename: 'bundle.js'
  },
  target: 'node',
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [{
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      test: /\.(tsx?)$/,
      loader: 'ts-loader',
      exclude: [
        [
          'node_modules',
          '.serverless',
          '.webpack'
        ]
      ],
      options: {
        transpileOnly: true,
        experimentalWatchApi: true
      },
    }],
    // all files with a '.json' extension will be handled by the json-loader
    loaders: [
      {
        test: /\.json$/,
        loaders: ['json']
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
  ],
}