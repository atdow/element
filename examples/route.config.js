import navConfig from './nav.config'; // 组件nav左侧菜单栏路由配置
import langs from './i18n/route';

const LOAD_MAP = {
  'zh-CN': name => {
    // 这些都是固定的写法
    return r => require.ensure([], () =>
      r(require(`./pages/zh-CN/${name}.vue`)),
    'zh-CN');
  },
  'en-US': name => {
    return r => require.ensure([], () =>
      r(require(`./pages/en-US/${name}.vue`)),
    'en-US');
  },
  'es': name => {
    return r => require.ensure([], () =>
      r(require(`./pages/es/${name}.vue`)),
    'es');
  },
  'fr-FR': name => {
    return r => require.ensure([], () =>
      r(require(`./pages/fr-FR/${name}.vue`)),
    'fr-FR');
  }
};

// 加载vue文件
const load = function(lang, path) {
  return LOAD_MAP[lang](path);
};
/**
 * require.ensure（dependencies：String []，callback：function（require），errorCallback：function（error），chunkName：String）
  第一个参数的依赖关系是一个数组，代表了当前需要进来的模块的一些依赖;
  第二个参数回调就是一个回调函数其中需要注意的是，这个回调函数有一个参数要求，通过这个要求就可以在回调函数内动态引入其他模块值得注意的是，
    虽然这个要求是回调函数的参数，理论上可以换其他名称，但是实际上是不能换的，否则WebPack就无法静态分析的时候处理它;
  第三个参数errorCallback比较好理解，就是处理错误的回调;
  第四个参数chunkName则是指定打包的组块名称。
 */
const LOAD_DOCS_MAP = {
  'zh-CN': path => {
    // 这些都是固定的写法
    return r => require.ensure([], () =>
      r(require(`./docs/zh-CN${path}.md`)),
    'zh-CN');
  },
  'en-US': path => {
    return r => require.ensure([], () =>
      r(require(`./docs/en-US${path}.md`)),
    'en-US');
  },
  'es': path => {
    return r => require.ensure([], () =>
      r(require(`./docs/es${path}.md`)),
    'es');
  },
  'fr-FR': path => {
    return r => require.ensure([], () =>
      r(require(`./docs/fr-FR${path}.md`)),
    'fr-FR');
  }
};
// 加载docs(md)
const loadDocs = function(lang, path) {
  return LOAD_DOCS_MAP[lang](path);
};

const registerRoute = (navConfig) => {
  let route = [];
  // 这里的index是按lang进行分类的
  Object.keys(navConfig).forEach((lang, index) => {
    let navs = navConfig[lang];
    // 组件按lang分类路由的父路由
    route.push({
      path: `/${ lang }/component`,
      redirect: `/${ lang }/component/installation`,
      component: load(lang, 'component'),
      children: [] // 挂载子路由
    });
    navs.forEach(nav => {
      if (nav.href) return; // 只有href的，就是普通的链接，不需要生成路由
      // 如果有分组，"组件"
      if (nav.groups) {
        nav.groups.forEach(group => {
          group.list.forEach(nav => {
            addRoute(nav, lang, index);
          });
        });
      } else if (nav.children) {
        // 如果有children，"开发指南"
        nav.children.forEach(nav => {
          addRoute(nav, lang, index);
        });
      } else {
        // 这里应该是为了兼容，暂时没发现调用的地方
        addRoute(nav, lang, index);
      }
    });
  });
  function addRoute(page, lang, index) {
    const component = page.path === '/changelog' // 更新日志
      ? load(lang, 'changelog')
      : loadDocs(lang, page.path); // 组件对应的其实加载的是md文件
    let child = {
      path: page.path.slice(1), // 去掉前面的"/"
      meta: {
        title: page.title || page.name,
        description: page.description, // undefined
        lang
      },
      name: 'component-' + lang + (page.title || page.name), // component-zh-CNContainer 布局容器
      component: component.default || component
    };
    // console.log('child:', child);
    route[index].children.push(child); // 注入组件按lang分类路由的父路由
  }

  return route;
};

// 组件按lang分类生成的路由
let route = registerRoute(navConfig);

// 指南、主题、资源、首页首页路由生成
const generateMiscRoutes = function(lang) {
  // 指南
  let guideRoute = {
    path: `/${ lang }/guide`, // 指南
    redirect: `/${ lang }/guide/design`,
    component: load(lang, 'guide'),
    children: [{
      path: 'design', // 设计原则
      name: 'guide-design' + lang,
      meta: { lang },
      component: load(lang, 'design')
    }, {
      path: 'nav', // 导航
      name: 'guide-nav' + lang,
      meta: { lang },
      component: load(lang, 'nav')
    }]
  };
  // 主题
  let themeRoute = {
    path: `/${ lang }/theme`,
    component: load(lang, 'theme-nav'),
    children: [
      {
        path: '/', // 主题管理
        name: 'theme' + lang,
        meta: { lang },
        component: load(lang, 'theme')
      },
      {
        path: 'preview', // 主题预览编辑
        name: 'theme-preview-' + lang,
        meta: { lang },
        component: load(lang, 'theme-preview')
      }]
  };
  // 资源
  let resourceRoute = {
    path: `/${ lang }/resource`, // 资源
    meta: { lang },
    name: 'resource' + lang,
    component: load(lang, 'resource')
  };
  // 首页
  let indexRoute = {
    path: `/${ lang }`, // 首页
    meta: { lang },
    name: 'home' + lang,
    component: load(lang, 'index')
  };

  return [guideRoute, resourceRoute, themeRoute, indexRoute];
};

// 混入主要路由资源（导航栏，除了组件）
langs.forEach(lang => {
  route = route.concat(generateMiscRoutes(lang.lang));
});

// play首页
route.push({
  path: '/play',
  name: 'play',
  component: require('./play/index.vue')
});

let userLanguage = localStorage.getItem('ELEMENT_LANGUAGE') || window.navigator.language || 'en-US';
let defaultPath = '/en-US';
if (userLanguage.indexOf('zh-') !== -1) {
  defaultPath = '/zh-CN';
} else if (userLanguage.indexOf('es') !== -1) {
  defaultPath = '/es';
} else if (userLanguage.indexOf('fr') !== -1) {
  defaultPath = '/fr-FR';
}

// defaultPath混入
route = route.concat([{
  path: '/',
  redirect: defaultPath
}, {
  path: '*',
  redirect: defaultPath
}]);

export default route;
