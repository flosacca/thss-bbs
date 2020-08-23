<template>
  <a-button @click="login">log in</a-button>
</template>

<script>
export default {
  methods: {
    async login() {
      let auth = await this.axios('http://localhost:1888/auth.json')
      await this.$store.dispatch('login', auth.data)
      if (this.loggedIn) {
        this.$router.push('/')
      }
    }
  }
}
</script>
