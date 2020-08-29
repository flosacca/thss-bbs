<template>
  <a-list
    class="reply-list"
    :class="{ 'no-last-border': !pagination }"
    item-layout="vertical"
    :data-source="replies"
    :pagination="pagination"
  >
    <template v-slot:renderItem="reply">
      <a-list-item class="reply-item">
        <base-items tag="p" :items="headerItems(reply)"/>

        <template v-if="editing(reply)">
          <editor-form
            :form="form"
            :hasTitle="false"
            submitText="OK"
            :submitting="editSending"
            @submit="submitEdit"
          />
        </template>
        <template v-else>
          <p v-if="reply.replyId">
            {{ '>>' + reply.replyId }}
          </p>
          <div v-html="render(reply)"></div>
        </template>
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

  computed: {
    pagination() {
      let total = this.replies.length
      let pageSize = 5
      return total > pageSize && {
        size: 'small',
        showQuickJumper: true,
        total,
        pageSize
      }
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
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 4px;
    }
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
  .ant-list-pagination {
    margin: 14px 0;
  }
}

#app {
  .no-last-border li:last-child {
    border-bottom: none;
  }
}
</style>
