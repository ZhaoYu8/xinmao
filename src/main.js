import App from './App.vue';
import http from './api/index'
import global from './global/global'
import router from './router';
import store from './store'
Vue.prototype.$post = http.post
Vue.prototype.$global = global
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
