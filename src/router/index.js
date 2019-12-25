import VueRouter from 'vue-router';
export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: (resolve) => require(['@/components/common/Home'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [
        {
          path: '/dashboard',
          component: (resolve) => require(['@/page/dashboard/Dashboard'], resolve),
          meta: {
            title: '系统首页'
          }
        },
        {
          path: '/404',
          component: (resolve) => require(['@/page/404'], resolve),
          meta: {
            title: '404'
          }
        },
        {
          path: '/customer',
          component: (resolve) => require(['@/page/cust/Customer'], resolve),
          meta: {
            title: '客户列表'
          }
        },
        {
          path: '/product',
          component: (resolve) => require(['@/page/product/Product'], resolve),
          meta: {
            title: '产品列表'
          }
        },
        {
          path: '/order',
          component: (resolve) => require(['@/page/order/Order'], resolve),
          meta: {
            title: '订单管理'
          }
        },
        {
          path: '/addOrder',
          component: (resolve) => require(['@/page/order/AddOrder'], resolve),
          meta: {
            title: '新增订单'
          }
        },
        {
          path: '/orderDetail',
          component: (resolve) => require(['@/page/order/OrderDetail'], resolve),
          meta: {
            title: '订单详情'
          }
        },
        {
          path: '/user',
          component: (resolve) => require(['@/page/user/User'], resolve),
          meta: {
            title: '员工管理'
          }
        }
      ]
    },
    {
      path: '/login',
      component: (resolve) => require(['@/page/Login'], resolve),
      meta: {
        title: '登录页'
      }
    },
    {
      path: '/print',
      component: (resolve) => require(['@/page/print/print'], resolve),
      meta: {
        title: '打印'
      }
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
});
