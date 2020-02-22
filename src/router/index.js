import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 懒加载
const routes = [{
  path: '/login',
  component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')
}, {
  path: '/home',
  component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home.vue'),
  redirect: '/welcome',
  children: [
    { path: '/welcome', component: () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome.vue') },
    { path: '/users', component: () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/user/Users.vue') },
    { path: '/rights', component: () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Rights.vue') },
    { path: '/roles', component: () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Roles.vue') },
    { path: '/categories', component: () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Cate.vue') },
    { path: '/params', component: () => import(/* webpackChunkName: "Cate_Params" */ '@/components/goods/Params.vue') },
    { path: '/goods', component: () => import(/* webpackChunkName: "GoodsList_Add" */ '@/components/goods/List.vue') },
    { path: '/goods/add', component: () => import(/* webpackChunkName: "GoodsList_Add" */ '@/components/goods/Add.vue') },
    { path: '/orders', component: () => import(/* webpackChunkName: "Order_Report" */ '@/components/order/Order.vue') },
    { path: '/reports', component: () => import(/* webpackChunkName: "Order_Report" */ '@/components/report/Report.vue') }

  ]
}
]

const router = new VueRouter({
  routes
})

// 路由导航守卫
// next，函数，表示放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()// 这是一条规则，删除报错
  // 获取token,后续需要判断token是否合法
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
