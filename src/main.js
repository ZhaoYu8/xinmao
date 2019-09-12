import Vue from 'vue';
import App from './App.vue';
// import './global/element'; // 按需加载
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import ElementUI from 'element-ui';
import http from './api/index'
import global from './global/global'
import router from './router';
import store from './store'
Vue.use(ElementUI)
Vue.prototype.$post = http.post
Vue.prototype.$global = global
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
