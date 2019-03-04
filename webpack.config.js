const path = require('path');

module.exports = {
  mode: 'development',
  entry: './jstutorials/src/index.jsx',
  devtool: 'inline-source-map',
  module: {
    rules: [{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'jstutorials/static/dist'),
  },
};
