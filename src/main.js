import Vue from 'vue'
import axios from 'axios'
import cookies from 'vue-cookies'
import moment from 'moment'
Vue.use(cookies)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.filter('formatDate', (date, type) => {
  date = moment(String(date))
  switch (type) {
    case 'relative':
      return date.fromNow()
    case 'absolute':
    default:
      return date.format('YYYY-MM-DD HH:mm:ss')
  }
})

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
