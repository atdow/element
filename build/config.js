/*
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-06-09 14:59:02
 * @Description: file description
 */
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json'); // 所有组件引入的路径 {"pagination": "./packages/pagination/index.js",...}

// 这里导入的都是整个文件夹下的所有文件
var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));

// ----------------externals配置start----------------
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`element-ui/packages/${key}`] = `element-ui/lib/${key}`;
});

externals['element-ui/src/locale'] = 'element-ui/lib/locale';
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/utils/${file}`] = `element-ui/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/mixins/${file}`] = `element-ui/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`element-ui/src/transitions/${file}`] = `element-ui/lib/transitions/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;
// ----------------externals配置end----------------

// console.log('externals:', externals);

// 这里的alias是为了保证开发环境和线上环境统一
exports.alias = {
  main: path.resolve(__dirname, '../src'), // import Element from 'main/index.js'; ==> import Element from '../src/index.js';
  packages: path.resolve(__dirname, '../packages'),
  examples: path.resolve(__dirname, '../examples'),
  'element-ui': path.resolve(__dirname, '../')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date\.js/; // node_modules utils/popper.js utils/date.js
