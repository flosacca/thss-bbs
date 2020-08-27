import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'

import router from '../router'
import Jwt from '../utils/jwt'

Vue.use(Vuex)

Vue.mixin({
  computed: Vuex.mapState(['loggedIn'])
})

export default new Vuex.Store({
  state: {
    loggedIn: false
  },

  mutations: {
    login(state) {
      state.loggedIn = true
    },

    logout(state) {
      state.loggedIn = false
    }
  },

  actions: {
    async login({ commit }, auth) {
      let jwt = cookies.get('jwt')
      try {
        jwt = await Jwt.get(auth)
        cookies.set('jwt', jwt)
      } catch {
        if (!await Jwt.check(jwt)) {
          return
        }
      }
      commit('login')
    },

    async logout({ commit }) {
      commit('logout')
      await Jwt.delete(cookies.get('jwt'))
      cookies.remove('jwt')
      router.push('/login')
    }
  }
})
