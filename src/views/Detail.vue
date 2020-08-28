<template>
  <div id="post" class="view" v-if="hasReply">
    <a-input
      v-if="editing(post)"
      v-model="editForm.title"
    />
    <h1 v-else>
      {{ post.title }}
    </h1>

    <a-list
      item-layout="vertical"
      :loading="loading"
      :data-source="post.reply"
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

          <div v-if="editing(reply)">
            <editor-form
              ref="editForm"
              :form="editForm"
              :hasTitle="false"
              submitText="OK"
              :submitting="editSending"
              @submit="editSubmit"
            />
          </div>
          <div v-else>
            <div v-if="reply.replyId != null">
              &gt;&gt;{{ reply.replyId }}
            </div>
            <div v-html="render(reply)"></div>
          </div>
        </a-list-item>
      </template>
    </a-list>

    <editor-form
      ref="replyForm"
      :form="replyForm"
      :hasTitle="false"
      submitText="new reply"
      :submitting="replying"
      @submit="newReply"
      v-if="current == null"
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
      replying: false,
      editSending: false,
      current: null,
      post: {},
      replyForm: {
        content: ''
      },
      editForm: {
        title: '',
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
      let { title, content } = reply
      if (title == null) {
        this.editForm = { content }
      } else {
        this.editForm = { title, content }
      }
      this.current = reply
    },

    editing(reply) {
      return reply === this.current
    },

    async editSubmit() {
      console.log('edit', this.editForm)
      this.editSending = true
      let url = `/post/${this.id}`
      if (this.current !== this.post) {
        url += `/reply/${this.current.id}`
      }
      await this.req(url, {
        method: 'put',
        data: this.editForm
      })
      this.editSending = false
      this.reload()
    },

    async newReply() {
      console.log('new reply', this.replyForm)
      this.replying = true
      await this.req(`/post/${this.id}/reply`, {
        method: 'post',
        data: {
          ...this.replyForm,
          replyId: 0
        }
      })
      this.replying = false
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
