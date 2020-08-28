<template>
  <div id="post" class="view">
    <h1 v-if="editing.id !== 0">
      {{ post.title }}
    </h1>
    <a-input v-else
      v-model="editForm.title"
    />
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
          <div v-if="reply.replyId == null && editing.id === 0">
            <editor-form
              ref="editForm"
              :form="editForm"
              :hasTitle="false"
              submitText="edit post"
              :submitting="postSending"
              @submit="editPost"
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
      v-if="hasReply"
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
      postSending: false,
      editing: {},
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
      if (reply.replyId == null) {
        this.editing = { id: 0 }
        let { title, content } = this.post
        this.editForm = { title, content }
      }
    },

    async editPost() {
      console.log('edit post', this.editForm)
      this.postSending = true
      await this.req(`/post/${this.id}`, {
        method: 'put',
        data: this.editForm
      })
      this.postSending = false
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
