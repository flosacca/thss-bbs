<template>
  <div id="post" class="view">
    <h1>{{ post.title }}</h1>
    <a-list
      item-layout="vertical"
      :loading="loading"
      :data-source="post.reply"
      v-if="hasReply"
    >
      <template v-slot:renderItem="reply">
        <a-list-item>
          <div>
            {{ reply.nickname }} /
            #{{ reply.id }} /
            {{ reply.updated | formatDate('absolute') }}
            <span v-if="reply.userId === user.id">
              / <a @click="edit(reply)">edit</a>
            </span>
          </div>
          <div v-if="reply.replyId != null">
            &gt;&gt;{{ reply.replyId }}
          </div>
          <div v-html="render(reply)"></div>
        </a-list-item>
      </template>
    </a-list>

    <editor-form
      ref="form"
      :form="form"
      submitText="edit post"
      :submitting="posting"
      @submit="submit"
      v-if="editing === 'post'"
    />
  </div>
</template>

<script>
const MarkdownIt = require('markdown-it')({
  html: true,
  linkify: true
})

export default {
  inject: ['reload'],

  props: ['id'],

  data() {
    return {
      loading: true,
      editing: false,
      posting: false,
      post: {},
      form: {
        content: ''
      }
    }
  },

  computed: {
    hasReply() {
      let reply = this.post.reply
      return reply && reply.length !== 0
    }
  },

  created() {
    this.req(`/post/${this.id}`).then(post => {
      console.log(post)
      post.reply.unshift(post)
      this.post = post
      this.loading = false
    })
  },

  methods: {
    render(reply) {
      return MarkdownIt.render(reply.content)
    },

    edit(reply) {
      if (reply.title) {
        if (this.editing !== 'post') {
          this.editing = 'post'
          this.form = {
            title: this.post.title,
            content: this.post.content
          }
        }
        if (this.$refs.form) {
          this.$refs.form.focus()
        } else {
          this.$nextTick(() => {
            this.$refs.form.focus()
          })
        }
      } else {
        this.editing = 'reply'
      }
    },

    async submit() {
      console.log(this.form)
      this.posting = true
      await this.req(`/post/${this.id}`, {
        method: 'put',
        data: this.form
      })
      this.posting = false
      this.reload()
    }
  }
}
</script>

<style lang="scss">
#post {
  flex: 0 1 800px;
  li {
    overflow: auto;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
