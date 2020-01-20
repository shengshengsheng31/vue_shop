import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/users',
    component: Users
  }
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
