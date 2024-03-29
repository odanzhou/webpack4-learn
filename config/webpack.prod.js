'use strict';

const webpack = require('webpack')
const path = require('path')
const { entry, commonPlugins, outputPath, rules } = require('./webpack.common')

const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin') // 速度分析
const TerserWebpackPlugin = require('terser-webpack-plugin') // 多线程压缩
const smp = new SpeedMeasureWebpackPlugin()
module.exports = smp.wrap({
  entry,
  output: {
    path: outputPath,
    filename: '[name]_[chunkhash:8].js'
  },
  mode: 'production', // 'development' || 'production' || 'none',
  module: {
    rules: [...rules]
  },
  plugins: [
    ...commonPlugins,
    // new webpack.optimize.ModuleConcatenationPlugin(), // 手动开启 scope hositing
    new webpack.DllReferencePlugin({
      manifest: require('../build/library/library.json')
    })
  ],
  optimization: {
    splitChunks: {
      // 基础库
      // cacheGroups: {
      //   commons: {
      //     test: /(react|react-dom)/,
      //     name: 'vendors',
      //     chunks: 'all'
      //   }
      // },
      // 公共引用
      minSize: 0,
      cacheGroups: {
        // 通过不同键值对来配置多个
        // 基础库
        vendors: {
          test: /(react|react-dom)/,
          // test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors', // 可以不传
        },
        // 公共饮用
        commons: {
          chunks: 'all',
          minChunks: 2,
          name: 'commons', // 可以不传
        }
      }
    },
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true,
        cache: true,
      })
    ]
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, '../node_modules/react/umd/react.production.min.js'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom/umd/react-dom.production.min.js'),
    },
    extensions: ['.js'],
    mainFields: ['main'],
  }
  // // 文件变化监听，默认false
  // watch: true,
  // // 只有开启了监听模式watchOptions才有意义
  // watchOptions: {
  //   // 不监听的文件或文件见，默认为空，支持正则匹配
  //   ignored: /node_modules/,
  //   // 监听到变化后会等300ms再去执行编译，默认300ms
  //   aggregateTimeout: 300,
  //   // 判断文件是否变化是通过不停询问系统制定文件是否发生变化实现的，默认每秒问 1000 次
  //   poll: 1000
  // },
  // stats: 'errors-only'
})