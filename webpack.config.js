var path = require('path');
var webpack = require('webpack');

module.exports = {
  externals: { Clappr : "Clappr" },
  entry: path.resolve(__dirname, 'src/context_menu.js'),
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['css-loader', 'sass-loader?includePaths[]=' + path.resolve(__dirname, './src/public')],
        include: path.resolve(__dirname, 'src')
      },
      {
        test: /\.html/,
        loader: 'html-loader?minimize=false'
      }
    ],
  },
  resolve: { extensions: ['.js'] },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "latest/",
    filename: 'clappr-context-menu-plugin.js',
    library: 'ContextMenuPlugin',
    libraryTarget: 'umd',
  },
}
