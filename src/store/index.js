import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import cookies from 'vue-cookies'

Vue.use(Vuex)

async function getJwt(auth) {
  if (auth == null) {
    throw new TypeError()
  }
  let res = await axios.patch('/api/v1/login', auth)
  console.log('jwt get')
  return res.data.jwt
}

async function checkJwt(jwt) {
  if (jwt == null) {
    return false
  }
  try {
    await axios('/api/v1/hello-user', {
      headers: { Authorization: jwt }
    })
  } catch {
    return false
  }
  console.log('jwt checked')
  return true
}

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
    async login({ commit }, auth = null) {
      try {
        cookies.set('jwt', await getJwt(auth))
      } catch {
        if (!await checkJwt(cookies.get('jwt'))) {
          return
        }
      }
      commit('login')
    }
  },
  modules: {
  }
})
