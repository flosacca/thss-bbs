import axios from 'axios'

export default {
  async get(auth) {
    if (auth == null) {
      throw new TypeError()
    }
    let res = await axios.patch('/api/v1/login', auth)
    console.log('jwt got')
    return res.data.jwt
  },

  async check(jwt) {
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
  },

  async delete(jwt) {
    try {
      await axios.patch('/api/v1/logout', {}, {
        headers: { Authorization: jwt }
      })
    } catch {
      return false
    }
    console.log('jwt deleted')
    return true
  }
}
