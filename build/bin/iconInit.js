/*
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-06-09 16:30:04
 * @Description: file description
 */
'use strict';

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8'); // 读取icon.scss文件
/**
  * 原始数据
  div {
    background: red;
    .a {
        color: green;
    }
  }
  .wrap .b {
    font-size: 19px;
  }

  * postcss.parse(fontFile).nodes解析后的数据
  [ Rule {
      raws: { before: '', between: ' ', semicolon: false, after: 'n' },
      type: 'rule',
      nodes: [ [Object], [Object] ],
      parent:
      Root {
        raws: [Object],
        type: 'root',
        nodes: [Circular],
        source: [Object] },
      source: { start: [Object], input: [Object], end: [Object] },
      selector: 'div' },
    Rule {
      raws: { before: 'n', between: ' ', semicolon: true, after: 'n' },
      type: 'rule',
      nodes: [ [Object] ],
      parent:
      Root {
        raws: [Object],
        type: 'root',
        nodes: [Circular],
        source: [Object] },
      source: { start: [Object], input: [Object], end: [Object] },
      selector: '.wrap .b' } ]

 */
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

/**
 * 原始数据
  .el-icon-ice-cream-round:before {
    content: "\e6a0";
  }

  .el-icon-ice-cream-square:before {
    content: "\e6a3";
  }

  classList ==> ['ice-cream-round','ice-cream-square',...]
 */
nodes.forEach((node) => {
  var selector = node.selector || ''; // .el-icon-ice-cream-round:before、.el-icon-ice-cream-square:before,...
  var reg = new RegExp(/\.el-icon-([^:]+):before/);
  var arr = selector.match(reg);

  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

// TODO: 倒序的原因暂时不了解
classList.reverse(); // 希望按 css 文件顺序倒序排列

/**
 * 文件内容
 * ['ice-cream-round','ice-cream-square',...]
 */
fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
