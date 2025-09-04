const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/ChatWidget.tsx',
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
    filename: 'ChatWidget.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ChatWidget',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};