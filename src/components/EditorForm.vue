<template>
  <a-form-model
    class="editor-form"
    layout="vertical"
    ref="form"
    :model="form"
    :rules="rules"
    @submit.native.prevent
    @submit="validate"
  >
    <a-form-model-item
      class="editor-form-title"
      prop="title"
      v-if="hasTitle"
    >
      <a-input
        placeholder="Title"
        v-model="form.title"
      />
    </a-form-model-item>

    <a-form-model-item
      class="editor-form-content"
    >
      <a-textarea
        ref="content"
        :rows="8"
        v-model="form.content"
      />
    </a-form-model-item>

    <a-form-model-item
      class="editor-form-submit"
    >
      <a-button
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        {{ submitText }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'editor-form',

  props: {
    form: {
      type: Object,
      required: true
    },
    hasTitle: {
      type: Boolean,
      default: true
    },
    submitText: {
      type: String,
      default: 'submit'
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    rules() {
      let res = {}
      if (this.hasTitle) {
        res.title = [
          {
            required: true,
            message: 'Title can not be empty',
            trigger: 'change'
          }
        ]
      }
      return res
    }
  },

  methods: {
    focus() {
      this.$refs.content.focus()
    },

    validate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.editor-form {
  margin: 18px 0 12px;
  .editor-form-title {
    margin-bottom: 6px;
    input {
      font-weight: bold;
    }
  }
  .editor-form-content {
    margin-bottom: 4px;
    [contentEditable=true] {
      height: 176px;
      overflow: auto;
    }
  }
  .editor-form-submit {
    margin: 0;
    padding: 0;
    [type=submit] {
      font-weight: bold;
      text-transform: capitalize;
      width: 100%;
      &[disabled] {
        cursor: default;
      }
    }
  }
}
</style>
