import Vue from 'vue'
import axios from 'axios'
import cookies from 'vue-cookies'
import moment from 'moment'
import 'highlight.js/styles/github.css'
Vue.use(cookies)

// import Antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// Vue.use(Antd)
import Alert from 'ant-design-vue/lib/alert'
import Button from 'ant-design-vue/lib/button'
import FormModel from 'ant-design-vue/lib/form-model'
import Icon from 'ant-design-vue/lib/icon'
import Input from 'ant-design-vue/lib/input'
import Layout from 'ant-design-vue/lib/layout'
import List from 'ant-design-vue/lib/list'
import 'ant-design-vue/lib/alert/style/css'
import 'ant-design-vue/lib/button/style/css'
import 'ant-design-vue/lib/form-model/style/css'
import 'ant-design-vue/lib/icon/style/css'
import 'ant-design-vue/lib/input/style/css'
import 'ant-design-vue/lib/layout/style/css'
import 'ant-design-vue/lib/list/style/css'
Vue.use(Alert)
Vue.use(Button)
Vue.use(FormModel)
Vue.use(Icon)
Vue.use(Input)
Vue.use(Layout)
Vue.use(List)

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
