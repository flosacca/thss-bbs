import Vue from 'vue'
import axios from 'axios'
import cookies from 'vue-cookies'
Vue.use(cookies)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    async req(path, { ...options }) {
      try {
        let res = await axios('/api/v1' + path, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization' : cookies.get('jwt')
          }
        })
        return res.data
      } catch (e) {
        console.log(e.response)
      }
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
