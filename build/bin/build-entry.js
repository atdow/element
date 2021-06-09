/**
 * 这里是代码生成，生成的代码放到src/index.js
 */
var Components = require('../../components.json');
var fs = require('fs');
var render = require('json-templater/string'); // json模板库
var uppercamelcase = require('uppercamelcase'); // 转大驼峰
var path = require('path');
var endOfLine = require('os').EOL;

var OUTPUT_PATH = path.join(__dirname, '../../src/index.js'); // 输出目录
// -------------模板start-------------------
var IMPORT_TEMPLATE = 'import {{name}} from \'../packages/{{package}}/index.js\';'; // import模板
var INSTALL_COMPONENT_TEMPLATE = '  {{name}}'; // component install模板
var MAIN_TEMPLATE = `/* Automatically generated by './build/bin/build-entry.js' */

{{include}}
import locale from 'element-ui/src/locale';
import CollapseTransition from 'element-ui/src/transitions/collapse-transition';

const components = [
{{install}},
  CollapseTransition
];

const install = function(Vue, opts = {}) {
  locale.use(opts.locale);
  locale.i18n(opts.i18n);

  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(InfiniteScroll);
  Vue.use(Loading.directive);

  Vue.prototype.$ELEMENT = {
    size: opts.size || '',
    zIndex: opts.zIndex || 2000
  };

  Vue.prototype.$loading = Loading.service;
  Vue.prototype.$msgbox = MessageBox;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$message = Message;

};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '{{version}}',
  locale: locale.use,
  i18n: locale.i18n,
  install,
  CollapseTransition,
  Loading,
{{list}}
};
`;
// -------------模板end-------------------

delete Components.font;

var ComponentNames = Object.keys(Components);

var includeComponentTemplate = []; // ["import {{name}} from \'../packages/{{package}}/index.js\';",...]
var installTemplate = []; // [`  componentName1`,`  componentName2`,...]
var listTemplate = []; // [`  componentName1`,`  componentName2`,...]

ComponentNames.forEach(name => {
  var componentName = uppercamelcase(name); // 转大驼峰

  /**
   * ["import {{name}} from \'../packages/{{package}}/index.js\';",...]
   */
  includeComponentTemplate.push(render(IMPORT_TEMPLATE, {
    name: componentName,
    package: name
  }));

  /**
   * ['  componentName1','  componentName2',...]
   */
  if (['Loading', 'MessageBox', 'Notification', 'Message', 'InfiniteScroll'].indexOf(componentName) === -1) {
    installTemplate.push(render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    }));
  }

  /**
   * [`  componentName1`,`  componentName2`,...]
   */
  if (componentName !== 'Loading') listTemplate.push(`  ${componentName}`);
});

var template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine), // import Pagination from '../packages/pagination/index.js';...
  install: installTemplate.join(',' + endOfLine), //  Pagination,Dialog,...
  version: process.env.VERSION || require('../../package.json').version, // 版本
  list: listTemplate.join(',' + endOfLine) //  Pagination,Dialog,...
});

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:', OUTPUT_PATH);

