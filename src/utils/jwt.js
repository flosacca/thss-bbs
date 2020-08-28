import axios from 'axios'

export default {
  async get(auth) {
    if (!auth) {
      throw new TypeError()
    }
    let { data } = await axios.patch('/api/v1/login', auth)
    return data.jwt
  },

  async find(jwt) {
    if (jwt) {
      try {
        let { data } = await axios('/api/v1/user', {
          headers: { 'Authorization': jwt }
        })
        return data
      } catch {}
    }
    return null
  },

  async delete(jwt) {
    try {
      await axios.patch('/api/v1/logout', {}, {
        headers: { 'Authorization': jwt }
      })
    } catch {
      return false
    }
    return true
  }
}
