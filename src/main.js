import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'

// 全局样式
import '@/assets/css/global.css'
// 树形表格插件
import TreeTable from 'vue-table-with-tree-grid'
// 引入axios
import axios from 'axios'

axios.defaults.baseURL = 'http://152.136.139.149:8888/api/private/v1'// 配置请求根路径
// 拦截器,判断token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios// 将axios挂载到vue

Vue.config.productionTip = false// 组织启动生产消息，在true时会在控制台报告

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
