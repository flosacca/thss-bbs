<template>
  <a-list
    class="reply-list"
    item-layout="vertical"
    :data-source="replies"
  >
    <template v-slot:renderItem="reply">
      <a-list-item class="reply-item">
        <base-items tag="p" :items="headerItems(reply)"/>

        <div v-if="editing(reply)">
          <editor-form
            :form="form"
            :hasTitle="false"
            submitText="OK"
            :submitting="editSending"
            @submit="submitEdit"
          />
        </div>
        <div v-else>
          <p v-if="reply.id !== 0">
            {{ '>>' + reply.replyId }}
          </p>
          <div v-html="render(reply)"></div>
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
const hljs = require('highlight.js')

const MarkdownIt = require('markdown-it')({
  html: true,
  linkify: true,
  highlight(code, lang) {
    let html = null
    if (lang && hljs.getLanguage(lang)) {
      try {
        html = hljs.highlight(lang, code).value
      } catch {}
    }
    if (html == null) {
      html = MarkdownIt.utils.escapeHtml(code)
    }
    return `<pre class="hljs"><code>${html}</code></pre>`
  }
})

export default {
  name: 'reply-list',

  props: ['replies', 'current', 'form'],

  data() {
    return {
      editSending: false
    }
  },

  methods: {
    render(reply) {
      return MarkdownIt.render(reply.content)
    },

    edit(reply) {
      this.$emit('edit', reply)
    },

    editing(reply) {
      return reply === this.current
    },

    discard() {
      this.$emit('discard')
    },

    addReply(reply) {
      this.$emit('reply', reply)
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
        this.formatDate(reply.updated)
      ]
      if (reply.userId === this.user.id) {
        items.push(this.editLink(reply))
      }
      items.push(this.replyLink(reply))
      return items
    },

    submitEdit() {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss">
.reply-list {
  p {
    margin-bottom: 12px;
  }
  pre {
    overflow: auto;
    font-size: 95%;
  }
  .reply-item {
    overflow: auto;
    &:not(:first-child) {
      margin-left: 24px;
    }
    .editor-form {
      margin: 16px 0 4px;
      .editor-form-content {
        margin-bottom: 0;
      }
    }
  }
}
</style>
