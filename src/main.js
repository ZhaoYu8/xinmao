import App from './App.vue';
import http from './api/index'
import global from './global/global'
import router from './router';
import store from './store'
Vue.prototype.$post = http.post
Vue.prototype.$global = global
Vue.prototype.bus=new Vue();
Vue.config.productionTip = false;
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 后台管理系统`;
  next();
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
