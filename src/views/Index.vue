<template>
  <div id="posts" class="view">
    <a-list
      item-layout="vertical"
      :loading="loading"
      :data-source="posts"
      :pagination="pagination"
    >
      <template v-slot:renderItem="post">
        <a-list-item class="post-item">
          <base-items :items="headerItems(post)"/>
        </a-list-item>
      </template>
    </a-list>

    <editor-form
      ref="form"
      :form="form"
      submitText="new post"
      :submitting="posting"
      @submit="submit"
      v-if="!loading || posts.length !== 0"
    />
  </div>
</template>

<script>
import Utils from './utils'

export default {
  inject: ['reload'],

  mixins: [Utils.mixin],

  data() {
    return {
      loading: true,
      posting: false,
      pagination: false,
      posts: [],
      form: {
        title: '',
        content: ''
      }
    }
  },

  computed: {
    page() {
      let v = this.$route.query.page
      return v == null ? 1 : Number(v)
    },

    size() {
      let v = this.$route.query.size
      return v == null ? 20 : Number(v)
    },

    userId() {
      let v = this.$route.query.userId
      return v == null ? 0 : Number(v)
    }
  },

  watch: {
    '$route.query': {
      handler(cur, old) {
        for (let key of ['size', 'userId']) {
          if (cur[key] !== old[key]) {
            return this.reload()
          }
        }
        this.updatePage()
      }
    }
  },

  created() {
    this.getPage(this.page).then(pageData => {
      this.assignPage(this.page, pageData)
      this.loading = false
      this.pagination = {
        showQuickJumper: true,
        total: pageData.total,
        pageSize: this.size,
        onChange: page => {
          this.$router.push({
            query: {
              ...this.$route.query,
              page
            }
          })
          window.scroll(0, 0)
          this.updatePage()
        }
      }
      this.$set(this.pagination, 'current', this.page)
    })
  },

  methods: {
    routerLink(post) {
      let args = ['router-link', {}, post.title]
      args[1].props = {
        to: `/posts/${post.id}`
      }
      return args
    },

    headerItems(post) {
      return [
        this.routerLink(post),
        this.userLink(post),
        this.formatDate(post.lastRepliedTime)
      ]
    },

    async updatePage() {
      if (!this.hasPage(this.page)) {
        this.loading = true
        let pageData = await this.getPage(this.page)
        this.assignPage(this.page, pageData)
        this.loading = false
      }
      this.pagination.current = this.page
    },

    async getPage(page) {
      let pageData = await this.req('/post', {
        params: {
          page,
          size: this.size,
          userId: this.userId,
          orderByReply: true
        }
      })
      return pageData
    },

    hasPage(page) {
      return !!this.posts[(page - 1) * this.size]
    },

    assignPage(page, pageData) {
      pageData.posts.forEach((post, i) => {
        if (/^\s*$/.test(post.title)) {
          post.title = '(blank)'
        }
        this.$set(this.posts, (page - 1) * this.size + i, post)
      })
    },

    async submit() {
      this.posting = true
      await this.req('/post', {
        method: 'post',
        data: this.form
      })
      this.posting = false
      this.reload()
    }
  }
}
</script>

<style lang="scss">
#posts {
  flex: 0 1 800px;
  .post-item {
    overflow: auto;
    a {
      color: rgba(6, 36, 63, 0.7);
      font-weight: bold;
      &:first-child {
        color: inherit;
      }
      &:hover {
        color: #1890ff;
      }
    }
  }
  .editor-form {
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid #e8e8e8;
  }
  .ant-list-pagination * {
    font-weight: bold;
  }
}
</style>
