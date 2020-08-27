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
          <div>{{ reply.id }} / {{ reply.nickname }} / {{ reply.updated }}</div>
          <div v-if="reply.replyId != null">&gt;&gt;{{ reply.replyId }}</div>
          <div v-html="render(reply)"></div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
const MarkdownIt = require('markdown-it')({
  html: true,
  linkify: true
})

export default {
  props: ['id'],

  data() {
    return {
      loading: true,
      post: {}
    }
  },

  computed: {
    hasReply() {
      let reply = this.post.reply
      return reply && reply.length !== 0
    }
  },

  created() {
    this.req(`/post/${this.id}`).then(data => {
      console.log(data)
      data.reply.unshift(data)
      this.post = data
      this.loading = false
    })
  },

  methods: {
    render(reply) {
      return MarkdownIt.render(reply.content)
    }
  }
}
</script>

<style lang="scss">
#post {
  flex: 0 1 800px;
  li {
    overflow: auto;
    a {
      color: inherit;
      font-weight: bold;
      &:hover {
        color: #1890ff;
      }
    }
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>
