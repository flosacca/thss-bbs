import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'

import router from '../router'
import jwt from '../utils/jwt'

Vue.use(Vuex)

Vue.mixin({
  computed: Vuex.mapState(['loggedIn']),
  methods: Vuex.mapActions(['logout'])
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
      try {
        cookies.set('jwt', await jwt.get(auth))
      } catch {
        if (!await jwt.check(cookies.get('jwt'))) {
          return
        }
      }
      commit('login')
    },

    async logout({ commit }) {
      commit('logout')
      await jwt.delete(cookies.get('jwt'))
      cookies.remove('jwt')
      router.push('/login')
    }
  }
})
