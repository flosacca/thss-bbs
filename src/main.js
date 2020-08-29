import Vue from 'vue'
import axios from 'axios'
import cookies from 'vue-cookies'
import moment from 'moment'
import ContentEditable from 'vue-contenteditable'
import 'highlight.js/styles/github.css'
Vue.use(cookies)
Vue.use(ContentEditable)

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

import App from './App.vue'
import router from './router'
import store from './store'
import BaseItems from './components/BaseItems.vue'
import EditorForm from './components/EditorForm.vue'
Vue.component(BaseItems.name, BaseItems)
Vue.component(EditorForm.name, EditorForm)

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
    },

    formatDate(date, type) {
      date = moment(String(date))
      switch (type) {
        case 'relative':
          return date.fromNow()
        case 'absolute':
        default:
          return date.format('MM-DD HH:mm:ss')
      }
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
