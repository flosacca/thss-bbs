import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'
import store from './store'

import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(VueAxios, axios)
Vue.use(VueCookies)

Vue.mixin({
  methods: {
    authorize() {
      let jwt = this.$cookies.get('jwt')
      this.axios.defaults.headers.common['Authorization'] = jwt
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
