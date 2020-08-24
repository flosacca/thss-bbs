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
  async check(jwt) {
    if (!jwt) {
      return false
    }
    try {
      await axios('/api/v1/hello-user', {
        headers: { 'Authorization': jwt }
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
        headers: { 'Authorization': jwt }
      })
    } catch {
      return false
    }
    console.log('jwt deleted')
    return true
  }
}
