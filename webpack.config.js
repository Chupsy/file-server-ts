const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/app.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node', // use require() & use NodeJs CommonJS style
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  externalsPresets: {
    node: true // in order to ignore built-in modules like path, fs, etc. 
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: { 
        "@controllers": "/src/controllers",
        "@helpers": "/src/helpers",
        "@presentations": "/src/presentations",
        "@validators": "/src/presentations/validators",
        "@persistence": "/src/persistence",
        "@domain": "/src/domain",
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};