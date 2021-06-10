<!--
 * @Author: atdow
 * @Date: 2021-06-09 16:34:15
 * @LastEditors: null
 * @LastEditTime: 2021-06-10 16:01:37
 * @Description: file description
-->

# 启动命令
```json
{
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    "dev": "npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
}
```
1. build:file
    * `build/bin/iconInit.js`: 将`packages/theme-chalk/src/icon.scss`文件抽离成`['ice-cream-round','ice-cream-square',...]`输出到`examples/icon.json`
    * `build/bin/build-entry.js`：根据`components.json`生成模板到`src/index.js`(组件引入和注册等)
    * `build/bin/i18n.js`：将`examples/pages/template/${ page }.tpl`模板根据`examples/i18n/page.json`文件替换内容，并将生成的内容输出到`examples/pages/${ lang.lang }/${ page }.vue`(主要解决国际化)
    *`build/bin/version.js`：从`package.json`的最新`version`,如果版本更新，往历史中增加当前版本，同时将版本对象信息写入到`examples/versions.json`
2. dev
    * `build/webpack.demo.js`：执行example工程(element官网)，需要注意里面包含了`build/config.js`，使用了`alias：为了保证开发环境和线上环境统一`
    * `build/bin/template.js`：监听`examples/pages/template`模板文件变化，如果变化，则执行`build/bin/i18n.js`，更新文件










