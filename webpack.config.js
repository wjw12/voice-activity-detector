const path = require('path');

module.exports = {
  mode: 'production',  // set to 'development' for debugging
  optimization: {
    minimize: true
  },
  entry: {
    vad: './src/vad-standalone.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "public"),
  },
  module: {
		rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
              "@babel/preset-env",
          ]
        }
      }
    ]
  },
  resolve: {
		extensions: ['.js']
  },
}