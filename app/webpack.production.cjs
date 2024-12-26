const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts',
    addCard: './src/addCard.ts',
    nav: './src/lib/nav.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './src/dist'),
  }
};