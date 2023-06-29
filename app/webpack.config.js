const path = require('path')

module.exports = {
    entry: './src/main.ts',
    mode: "development",
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
      filename: 'main.js',
      libraryTarget:'var', 
      library: 'cardnado',
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