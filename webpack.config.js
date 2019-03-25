const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './jstutorials/editor_src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'code_editor.js',
    path: path.resolve(__dirname, 'jstutorials/static/js'),
  },
};
