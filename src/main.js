import Vue from 'vue';
import App from './App.vue';
// import './global/element'; // 按需加载
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import ElementUI from 'element-ui';
import http from './api/index'
import global from './global/global'
import router from './router';

Vue.use(ElementUI)

Vue.prototype.$post = http.post
Vue.prototype.$global = global
Vue.config.productionTip = false;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 管理`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
      next();
    }
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
