<template>
  <div id="posts">
    <a-list
      item-layout="vertical"
      :loading="loading"
      :data-source="posts"
      :pagination="pagination"
    >
      <template v-slot:renderItem="post">
        <a-list-item>
          <!-- <a-list-item-meta>
            <template v-slot:title>
              <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
            </template>
          </a-list-item-meta> -->
          <router-link :to="`/posts/${post.id}`">
            {{ post.title }}
          </router-link> /
          {{ post.nickname }} / #{{ post.id }} / @{{ post.lastRepliedTime }}
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
const size = 10

export default {
  data() {
    return {
      loading: true,
      pagination: false,
      posts: []
    }
  },

  computed: {
    page() {
      return Number(this.$route.query.page) || 1
    },
  },

  created() {
    this.getPage(this.page, pageData => {
      this.assignPage(this.page, pageData)
      this.loading = false
      this.pagination = {
        // showQuickJumper: true,
        total: pageData.total,
        pageSize: size,
        onChange: page => {
          this.updatePage(page)
        }
      }
      this.$set(this.pagination, 'current', this.page)
    })
  },

  methods: {
    async updatePage(page) {
      this.$router.push({ query: { page } })
      if (!this.hasPage(page)) {
        this.loading = true
        let pageData = await this.getPage(page)
        this.assignPage(page, pageData)
        this.loading = false
      }
      this.pagination.current = page
    },

    async getPage(page, next = v => v) {
      let pageData = await this.getData('/post', {
        page,
        size,
        orderByReply: true
      })
      return next(pageData)
    },

    hasPage(page) {
      return !!this.posts[(page - 1) * size]
    },

    assignPage(page, pageData) {
      pageData.posts.forEach((post, i) => {
        if (/^\s*$/.test(post.title)) {
          post.title = '(blank)'
        }
        this.$set(this.posts, (page - 1) * size + i, post)
      })
    }
  }
}
</script>

<style lang="scss">
#posts {
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
