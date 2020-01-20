import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'

// 全局样式
import '@/assets/css/global.css'

// 引入axios
import axios from 'axios'
// 将axios挂载到vue
Vue.prototype.$http = axios
// 配置请求根路径
axios.defaults.baseURL = 'http://49.232.174.50:8888/api/private/v1'

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
