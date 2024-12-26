const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    addCard: './src/addCard.ts',
    nav: './src/lib/nav.ts'
  },
  devtool: 'source-map',
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
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './src/dist'),
    },
    client: {
      overlay: false,
    },
    compress: true,
    port: 9000,
  },
};