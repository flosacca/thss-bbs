import axios from 'axios'

export default {
  async get(auth) {
    if (!auth) {
      throw new TypeError()
    }
    let { data } = await axios.patch('/api/v1/login', auth)
    console.log('jwt got')
    return data.jwt
  },

  async find(jwt) {
    if (jwt) {
      try {
        let { data } = await axios('/api/v1/user', {
          headers: { 'Authorization': jwt }
        })
        console.log(data)
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
    console.log('jwt deleted')
    return true
  }
}
