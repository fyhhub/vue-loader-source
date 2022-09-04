const { VueLoaderPlugin } = require('./vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/main.js',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: path.resolve(__dirname, './vue-loader/index.js')
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new webpack.DefinePlugin({
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: true
      })
    ]
}