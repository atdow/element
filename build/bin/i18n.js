/*
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-06-09 17:29:52
 * @Description: file description
 */
'use strict';

var fs = require('fs');
var path = require('path');
/**
{
    "lang": "zh-CN",
    "pages": {
      "index": {
        "1": "网站快速成型工具",
        ...
      },
      "component": {},
      "theme": {
        "1": "官方主题",
        ...
      },
      "theme-preview": {
        "1": "返回"
      },
      "theme-nav": {},
      "changelog": {
        "1": "更新日志",
        ...
      },
      "design": {
        "1": "设计原则",
        ...
      },
      "guide": {
        "1": "设计原则",
        ...
      },
      "nav": {
        "1": "导航",
        ...
      },
      "resource": {
        "1": "资源",
         ...
      }
    }
  },
  ...
]
 */
var langConfig = require('../../examples/i18n/page.json');

langConfig.forEach(lang => {
  /**
   * lang
    {
      "lang": "zh-CN",
      "pages": {
        "index": {
          "1": "网站快速成型工具",
          ...
        },
        "component": {},
        ...
      }
    }
  */
  try {
    /*
      {
        dev : 0 ,
        mode : 33206 ,
        nlink : 1 ,
        uid : 0 ,
        gid : 0 ,
        rdev : 0 ,
        ino : 0 ,
        size : 378(字节) ,
        atime : Tue Jun 10 2014 13:57:13 GMT +0800 <中国标准时间> ,
        mtime : Tue Jun 13 2014 09:48:31 GMT +0800 <中国标准时间> ,
        ctime : Tue Jun 10 2014 13:57:13 GMT +0800 <中国标准时间>
      }
    */
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    // page ==> index
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`); // index.tpl、component.tpl...
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`); // index.vue、component.vue...
    var content = fs.readFileSync(templatePath, 'utf8'); // 读取index.tpl、component.tpl等文件内容
    /**
      {
        "1": "网站快速成型工具",
        "2": "Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库",
        "3": "指南",
        ...
      }
    */
    var pairs = lang.pages[page];

    Object.keys(pairs).forEach(key => {
      /**
        模板：
          <h1><%= 1 ></h1>
          <p><%= 2 ></p>
          ...
        替换后的内容：
          <h1>网站快速成型工具</h1>
          <p>Element，一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库</p>
          ...
       */
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });

    fs.writeFileSync(outputPath, content); // `examples/pages/template/${ page }.tpl` ==> `examples/pages/${ lang.lang }/${ page }.vue
  });
});
