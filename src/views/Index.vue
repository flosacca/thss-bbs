<template>
  <div id="posts" class="view">
    <a-list
      item-layout="vertical"
      :loading="loading"
      :data-source="posts"
      :pagination="pagination"
    >
      <template v-slot:renderItem="post">
        <a-list-item>
          <router-link :to="`/posts/${post.id}`">
            {{ post.title }}
          </router-link> /
          {{ post.nickname }} /
          #{{ post.id }} /
          {{ post.lastRepliedTime | formatDate('absolute') }}
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
export default {
  inject: ['reload'],

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
      return Number(this.$route.query.page) || 1
    },

    size() {
      return Number(this.$route.query.size) || 20
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
          this.updatePage(page)
        }
      }
      this.$set(this.pagination, 'current', this.page)
    })
  },

  methods: {
    async updatePage(page) {
      this.$router.push({ query: { ...this.$route.query, page } })
      window.scroll(0, 0)
      if (!this.hasPage(page)) {
        this.loading = true
        let pageData = await this.getPage(page)
        this.assignPage(page, pageData)
        this.loading = false
      }
      this.pagination.current = page
    },

    async getPage(page) {
      let pageData = await this.req('/post', {
        params: {
          page,
          size: this.size,
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
      console.log('new post', this.form)
      this.posting = true
      await this.req('/post', {
        method: 'post',
        data: this.form
      })
      /* await new Promise(r => setTimeout(r, 2000)) */
      this.posting = false
      this.reload()
    }
  }
}
</script>

<style lang="scss">
#posts {
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
  }
}
</style>
