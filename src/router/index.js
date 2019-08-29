import VueRouter from 'vue-router'
const Home = () => import('../components/common/Home.vue')
const Dashboard = () => import('../components/page/Dashboard.vue')
const page404 = () => import('../components/page/404.vue')
const Customer = () => import('../components/page/Customer.vue')
const Login = () => import('../components/page/Login.vue')
export default new VueRouter({
  routes: [{
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: Home,
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/dashboard',
          component: Dashboard,
          meta: {
            title: '系统首页'
          }
        },
        {
          path: '/404',
          component: page404,
          meta: {
            title: '404'
          }
        },
        {
          path: '/customer',
          component: Customer,
          meta: {
            title: '客户列表'
          }
        }
      ]
    },
    {
      path: '/login',
      component: Login,
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