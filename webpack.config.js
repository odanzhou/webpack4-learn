'use strict';

const path = require('path')
const webpack = require('webpack')


const config = {
  // entry: 打包输入
  entry: {
    start: [
      'react-hot-loader/patch'
    ],
    bundle: './src/index.js',
    search: './src/search.js'
  },
  // output: 打包输出位置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // 占位符默认main
    chunkFilename: '[name].js', // 中间生成的chunk，如按需加载
  },

  mode: 'development', // 'development' || 'production' || 'none'
  // loaders: 处理webpack原生不能处理的文件（模块），原生只支持js和json
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(woff|woff2|otf|ttf)$/,
        use: [
          'file-loader' // 可以用url-loader
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  watch: true, // 文件监听，自动构建出新的输出文件
  watchOptions: {
    ignored: /node_modules/, // 忽略包的文件监听
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist', // 引入一些静态资源文件，如index.html
    hot: true,
    port: 8090,
    // inline: true, // false 则使用iframe的模式
    // lazy: true, // 报错，原因未知
  }
}


module.exports = config