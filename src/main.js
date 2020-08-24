import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import cookies from 'vue-cookies'

import App from './App.vue'
import router from './router'
import store from './store'

import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(VueAxios, axios)
Vue.use(cookies)

Vue.mixin({
  methods: {
    authorize() {
      let jwt = cookies.get('jwt')
      axios.defaults.headers.common['Authorization'] = jwt
    },
    async getData(path, params, next = v => v) {
      try {
        let res = await this.axios('/api/v1' + path, {
          params,
          headers: {
            'Authorization' : cookies.get('jwt')
          }
        })
        return next(res.data)
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
