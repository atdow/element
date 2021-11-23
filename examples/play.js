/*
 * @Author: atdow
 * @Date: 2021-06-08 15:32:01
 * @LastEditors: null
 * @LastEditTime: 2021-11-23 14:35:10
 * @Description: file description
 */
import Vue from 'vue';
import Element from 'main/index.js'; // ==>import Element from '../src/index.js'; (目录是build/webpack.demo.js)
import App from './play/index.vue';
import 'packages/theme-chalk/src/index.scss';

Vue.use(Element);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
