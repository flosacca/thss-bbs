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

    <a-form-model
      class="new-post"
      layout="vertical"
      ref="form"
      :model="form"
      :rules="rules"
      @submit.native.prevent
      @submit="submit"
      v-if="!loading || posts.length !== 0"
    >
      <a-form-model-item prop="title">
        <a-input placeholder="Title" v-model="form.title"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-textarea :rows="8" v-model="form.content"/>
      </a-form-model-item>
      <a-form-model-item>
        <a-button type="primary" html-type="submit">
          new post
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  inject: ['reload'],

  data() {
    return {
      loading: true,
      pagination: false,
      posts: [],
      form: {
        title: '',
        content: ''
      },
      rules: {
        title: [
          {
            required: true,
            message: 'Title can not be empty',
            trigger: 'change'
          }
        ]
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
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.req('/post', {
            method: 'post',
            data: this.form
          })
          this.reload()
        }
      })
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

  form.new-post {
    margin-top: 28px;
    & > :nth-child(1) {
      margin-bottom: 18px;
      & input {
      font-weight: bold;
      }
    }
    & > :nth-child(2) {
      margin-bottom: 12px;
    }
    [type=submit] {
      font-weight: bold;
      text-transform: capitalize;
      width: 100%;
    }
  }
}
</style>
