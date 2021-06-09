/*
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-06-09 17:40:38
 * @Description: TODO 从目前的代码来看，还是以手动维护为主
 */
var fs = require('fs');
var path = require('path');
var version = process.env.VERSION || require('../../package.json').version; // 获取package.json的最新version
var content = { '1.4.13': '1.4', '2.0.11': '2.0', '2.1.0': '2.1', '2.2.2': '2.2', '2.3.9': '2.3', '2.4.11': '2.4', '2.5.4': '2.5', '2.6.3': '2.6', '2.7.2': '2.7', '2.8.2': '2.8', '2.9.2': '2.9', '2.10.1': '2.10', '2.11.1': '2.11', '2.12.0': '2.12', '2.13.2': '2.13', '2.14.1': '2.14' };
if (!content[version]) content[version] = '2.15'; // 版本更新，往历史中增加当前版本
fs.writeFileSync(path.resolve(__dirname, '../../examples/versions.json'), JSON.stringify(content));
