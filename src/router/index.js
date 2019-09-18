import VueRouter from 'vue-router'
export default new VueRouter({
  routes: [{
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: resolve => require(['@/components/common/Home'], resolve),
    meta: {
      title: '自述文件'
    },
    children: [{
      path: '/dashboard',
      component: resolve => require(['@/components/page/Dashboard'], resolve),
      meta: {
        title: '系统首页'
      }
    },
    {
      path: '/404',
      component: resolve => require(['@/components/page/404'], resolve),
      meta: {
        title: '404'
      }
    },
    {
      path: '/customer',
      component: resolve => require(['@/components/cust/Customer'], resolve),
      meta: {
        title: '客户列表'
      }
    },
    {
      path: '/project',
      component: resolve => require(['@/components/project/Project'], resolve),
      meta: {
        title: '产品列表'
      }
    },
    {
      path: '/order',
      component: resolve => require(['@/components/order/Order'], resolve),
      meta: {
        title: '订单管理'
      }
    },
    {
      path: '/addOrder',
      component: resolve => require(['@/components/order/AddOrder'], resolve),
      meta: {
        title: '新增订单'
      }
    },
    {
      path: '/user',
      component: resolve => require(['@/components/user/User'], resolve),
      meta: {
        title: '员工管理'
      }
    }
    ]
  },
  {
    path: '/login',
    component: resolve => require(['@/components/page/Login'], resolve),
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