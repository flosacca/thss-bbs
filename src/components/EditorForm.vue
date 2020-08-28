<template>
  <a-form-model
    class="editor-form"
    layout="vertical"
    ref="form"
    :model="model"
    :rules="rules"
    @submit.native.prevent
    @submit="forward"
  >
    <a-form-model-item
      class="editor-form-title"
      prop="title"
      v-if="title"
    >
      <a-input placeholder="Title" v-model="model.title"/>
    </a-form-model-item>
    <a-form-model-item
      class="editor-form-content"
    >
      <a-textarea :rows="8" v-model="model.content"/>
      <!-- <contenteditable
        tag="div"
        class="ant-input"
        v-model="model.content"
        :noHTML="false"
      /> -->
    </a-form-model-item>
    <a-form-model-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="submitting"
      >
        {{ submit }}
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'editor-form',

  props: {
    model: {
      type: Object,
      required: true
    },
    title: {
      type: Boolean,
      default: true
    },
    submit: {
      type: String,
      default: 'submit'
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      rules: {
        title: [
          {
            required: true,
            message: 'Title can not be empty',
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    validate(...args) {
      return this.$refs.form.validate(...args)
    },

    forward(event) {
      this.$emit(event.type, event)
    }
  }
}
</script>

<style lang="scss">
.editor-form {
  margin-top: 28px;
  .editor-form-title {
    margin-bottom: 18px;
    input {
      font-weight: bold;
    }
  }
  .editor-form-content {
    margin-bottom: 12px;
    [contentEditable=true] {
      height: 176px;
      overflow: auto;
    }
  }
  [type=submit] {
    font-weight: bold;
    text-transform: capitalize;
    width: 100%;
    &[disabled] {
      cursor: default;
    }
  }
}
</style>
