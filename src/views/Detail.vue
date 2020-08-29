<template>
  <div id="post" class="view" v-if="hasReply">
    <a-input
      class="title"
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
          <base-items :items="headerItems(reply)"/>
          <!-- <div>
            {{ reply.nickname }} /
            #{{ reply.id }} /
            {{ reply.updated | formatDate('absolute') }}
            <span v-if="reply.userId === user.id">
              / <a @click="edit(reply)">edit</a>
            </span>
          </div> -->

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
      replyId: 0,
      post: {},
      replyForm: {},
      editForm: {}
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

    discard() {
      this.current = null
    },

    addReply(reply) {
      this.discard()
      this.replyId = reply.id
      this.$nextTick(() => {
        this.$refs.replyForm.focus()
      })
    },

    editLink(reply) {
      let args = ['a', {}]
      if (this.current !== reply) {
        args[1].on = {
          click: () => this.edit(reply)
        }
        args[2] = ['edit']
      } else {
        args[1].on = {
          click: () => this.discard()
        }
        args[2] = ['discard']
      }
      return args
    },

    replyLink(reply) {
      let args = ['a', {}, 'reply']
      args[1].on = {
        click: () => this.addReply(reply)
      }
      return args
    },

    headerItems(reply) {
      let items = [
        reply.nickname,
        `#${reply.id}`,
        this.$options.filters.formatDate(reply.updated)
      ]
      if (reply.userId === this.user.id) {
        items.push(this.editLink(reply))
      }
      items.push(this.replyLink(reply))
      return items
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
          replyId: this.replyId
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
  input.title {
    font-weight: bold;
  }
}
</style>
