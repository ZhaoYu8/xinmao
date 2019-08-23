import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: () => import('../components/common/Home.vue'),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/dashboard',
          component: () => import('../components/page/Dashboard.vue'),
          meta: {
            title: '系统首页'
          }
        },
        {
          path: '/404',
          component: () => import('../components/page/404.vue'),
          meta: {
            title: '404'
          }
        }
      ]
    },
    {
      path: '/login',
      component: () => import('../components/page/Login.vue'),
      meta: {
        title: '登录页'
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})