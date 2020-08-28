import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'

import router from '../router'
import Jwt from '../utils/jwt'

Vue.use(Vuex)

Vue.mixin({
  computed: Vuex.mapState(['loggedIn', 'user'])
})

export default new Vuex.Store({
  state: {
    loggedIn: false,
    user: null
  },

  mutations: {
    login(state, user) {
      state.loggedIn = true
      state.user = user
    },

    logout(state) {
      state.loggedIn = false
      state.user = null
    }
  },

  actions: {
    async login({ commit }, auth) {
      let jwt = null
      try {
        jwt = await Jwt.get(auth)
        cookies.set('jwt', jwt)
      } catch {
        jwt = cookies.get('jwt')
      }
      let user = await Jwt.find(jwt)
      if (user) {
        commit('login', user)
      }
    },

    async logout({ commit }) {
      commit('logout')
      await Jwt.delete(cookies.get('jwt'))
      cookies.remove('jwt')
      router.push('/login')
    }
  }
})
