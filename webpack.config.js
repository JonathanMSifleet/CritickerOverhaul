module.exports = {
  // Specify the entry point for our app.
  entry: './src/main.ts',
  // Specify the output file containing our bundled code
  output: {
    filename: 'bundle.js'
  },
  module: {
    // Tell webpack how to load 'json' files. 
    // When webpack encounters a 'require()' statement
    // where a 'json' file is being imported, it will use
    // the json-loader
    loaders: [
      {
        test: /\.json$/, 
        loaders: ['json']
      }
    ]
  }
}