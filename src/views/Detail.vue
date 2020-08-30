<template>
  <div id="post" class="view">
    <template v-if="!loading">
      <template v-if="current !== top">
        <h1>{{ top.title }}</h1>
      </template>
      <template v-else>
        <a-input
          class="title"
          placeholder="Title"
          v-model="editForm.title"
        />
      </template>
    </template>

    <a-list
      class="floors"
      item-layout="vertical"
      :loading="loading"
      :data-source="floors"
      :pagination="pagination"
    >
      <template v-slot:renderItem="floor">
        <a-list-item class="floor">
          <reply-list
            :replies="floor"
            :current="current"
            :form="editForm"
            @edit="edit"
            @discard="discard"
            @reply="addReply"
            @submit="submitEdit"
          />
        </a-list-item>
      </template>
    </a-list>

    <template v-if="!loading && current == null">
      <div class="reply">
        <p>{{ hint }}</p>
        <editor-form
          ref="replyForm"
          :form="replyForm"
          :hasTitle="false"
          submitText="reply"
          :submitting="replying"
          @submit="newReply"
        />
      </div>
    </template>
  </div>
</template>

<script>
import ReplyList from './ReplyList.vue'

export default {
  props: ['id'],

  inject: ['reload'],

  components: {
    'reply-list': ReplyList
  },

  data() {
    return {
      loading: true,
      replying: false,
      current: null,
      replyTo: null,
      floors: [],
      editForm: {},
      replyForm: {}
    }
  },

  computed: {
    top() {
      let top = this.floors[0]
      return top && top[0]
    },

    hint() {
      if (this.replyTo == null) {
        return ''
      }
      let a = this.replyTo
      return `re: ${a.nickname} (${a.pos})`
    },

    pagination() {
      let total = this.floors.length
      let pageSize = 20
      return total > pageSize && {
        total,
        pageSize,
        onChange() {
          window.scroll(0, 0)
        }
      }
    }
  },

  created() {
    this.req(`/post/${this.id}`).then(post => {
      post.id = 0
      post.pos = '#1'
      let floors = [[post, []]]
      let index = {}
      post.reply.forEach(reply => {
        if (reply.replyId === 0) {
          let i = floors.length
          floors.push([reply, []])
          index[reply.id] = i
          reply.pos = `#${i + 1}`
        } else {
          let i = index[reply.replyId]
          let j = floors[i][1].length
          floors[i][1].push(reply)
          index[reply.id] = i
          reply.pos = `${i + 1}-${j + 1}`
        }
      })
      this.floors = floors
      this.replyTo = post
      this.loading = false
    })
  },

  methods: {
    edit(reply) {
      let { title, content } = reply
      if (title == null) {
        this.editForm = { content }
      } else {
        this.editForm = { title, content }
      }
      this.current = reply
    },

    discard() {
      this.current = null
    },

    addReply(reply) {
      this.discard()
      this.replyTo = reply
      this.$nextTick(() => {
        this.$refs.replyForm.focus()
      })
    },

    async submitEdit() {
      this.editSending = true
      let url = `/post/${this.id}`
      if (this.current !== this.top) {
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
      this.replying = true
      await this.req(`/post/${this.id}/reply`, {
        method: 'post',
        data: {
          ...this.replyForm,
          replyId: this.replyTo.id
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
  .title {
    font-weight: bold;
  }
  .reply {
    margin-top: 12px;
    .editor-form {
      margin-top: 12px;
    }
  }
  .floors {
    .floor {
      padding: 0;
      &:last-child {
        border-bottom: 1px solid #e8e8e8;
      }
    }
    & > .ant-list-pagination {
      margin: 0;
      padding: 18px 0;
      border-bottom: 1px solid #e8e8e8;
      * {
        font-weight: bold;
      }
    }
  }
}
</style>
