<template>
  <div id="login" class="view">
    <h1>log in</h1>
    <a-alert
      type="error"
      :message="message"
      closable
      @close="() => { this.error = false }"
      v-if="error"
    />
    <a-form-model
      layout="vertical"
      ref="form"
      :model="form"
      :rules="rules"
      @submit.native.prevent
      @submit="submit"
    >
      <a-form-model-item prop="username">
        <a-input
          placeholder="Username"
          v-model="form.username"
        >
          <template v-slot:prefix><a-icon type="user"/></template>
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input
          type="password"
          placeholder="Password"
          v-model="form.password"
        >
          <template v-slot:prefix><a-icon type="lock"/></template>
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" html-type="submit">log in</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  inject: ['reload'],

  data() {
    return {
      error: false,
      message: 'Incorrect username or password.',
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: 'Please input username',
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please input password',
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.$store.dispatch('login', this.form)
          if (this.loggedIn) {
            this.$router.push('/')
            this.reload()
          } else {
            this.error = true
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
#login {
  flex: 0 1 400px;
  h1 {
    margin-bottom: 24px;
    text-transform: capitalize;
  }
  form {
    margin-top: 24px;
    & > * {
      margin-bottom: 18px;
    }
  }
  label {
    color: rgba(0, 0, 0, 0.5);
    font-weight: bold;
  }
  svg {
    color: rgba(0, 0, 0, 0.25);
  }
  button {
    width: 100%;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>
