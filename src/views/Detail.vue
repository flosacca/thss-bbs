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
      :hasTitle="false"
      submitText="new reply"
      :submitting="posting"
      @submit="submit"
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
    },

    async submit() {
      console.log('new reply', this.form)
      this.posting = true
      await this.req(`/post/${this.id}/reply`, {
        method: 'post',
        data: {
          ...this.form,
          replyId: 0
        }
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
