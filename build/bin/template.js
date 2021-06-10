/*
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-06-10 16:12:51
 * @Description: file description
 */
const path = require('path');
const templates = path.resolve(process.cwd(), './examples/pages/template'); // E:\mydemo\element\examples\pages\template
// console.log('templates:', templates);
const chokidar = require('chokidar');
let watcher = chokidar.watch([templates]);

watcher.on('ready', function() {
  watcher
    .on('change', function() {
      exec('npm run i18n');
    });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
