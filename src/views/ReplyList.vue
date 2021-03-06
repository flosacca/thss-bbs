<template>
  <div class="reply-list">
    <div class="reply-item">
      <base-items tag="p" :items="headerItems(replies[0])"/>
      <template v-if="editing(replies[0])">
        <editor-form
          :form="form"
          :hasTitle="false"
          submitText="OK"
          :submitting="editSending"
          @submit="submitEdit"
        />
      </template>
      <template v-else>
        <div v-html="render(replies[0])"></div>
      </template>
    </div>

    <a-list
      :class="{ 'no-last-border': !pagination }"
      item-layout="vertical"
      :data-source="replies[1]"
      :pagination="pagination"
      v-if="replies[1].length !== 0"
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
            <template v-if="table[reply.replyId].replyId !== 0">
              <base-items tag="p" delimiter="" :items="hint(reply)"/>
            </template>
            <div v-html="render(reply)"/>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
import Utils from './utils'

export default {
  name: 'reply-list',

  props: ['replies', 'current', 'form'],

  inject: ['reload'],

  mixins: [Utils.mixin],

  data() {
    return {
      editSending: false
    }
  },

  computed: {
    table() {
      let table = {}
      let a = this.replies
      if (a && a[1]) {
        [a[0], ...a[1]].forEach(reply => {
          table[reply.id] = reply
        })
      }
      return table
    },

    pagination() {
      let total = this.replies[1].length
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
    hint(reply) {
      let a = this.table[reply.replyId]
      return ['re: ', Utils.bold(a.nickname)]
    },

    render(reply) {
      return Utils.render(reply.content)
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
        this.userLink(reply),
        Utils.bold(reply.pos),
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
    .editor-form {
      margin: 8px 0 4px;
      .editor-form-content {
        margin-bottom: 0;
      }
    }
    & > p:first-child a {
      color: rgba(12, 72, 127, 0.9);
      &:first-child {
        color: rgba(6, 36, 63, 0.7);
        font-weight: bold;
      }
      &:hover {
        color: #1890ff;
      }
    }
  }
  li.reply-item {
    margin-left: 14px;
    padding: 4px 0;
    p {
      margin-bottom: 4px;
      &:last-child {
        margin-bottom: 2px;
      }
    }
  }
  div.reply-item {
    padding: 8px 0;
    &:not(:last-child) {
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .ant-list-pagination {
    margin: 0;
    padding: 14px 0;
  }
}

#app {
  .no-last-border li:last-child {
    border-bottom: none;
  }
}
</style>
