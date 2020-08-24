<template>
  <div id="posts">
    <a-list
      item-layout="vertical"
      :loading="loading"
      :data-source="allPosts"
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
          </router-link> - {{ post.nickname }} @ {{ post.updated }}
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
const size = 10

function fillTitle(pageData) {
  pageData.posts.forEach(post => {
    if (/^\s*$/.test(post.title)) {
      post.title = '(blank)'
    }
  })
  return pageData
}

export default {
  data() {
    return {
      loading: true,
      pagination: false,
      pageData: {}
    }
  },

  computed: {
    page() {
      return Number(this.$route.query.page) || 1
    },

    allPosts() {
      let total = this.pageData.total || 0
      let all = Array(total).fill({})
      let posts = this.pageData.posts
      if (posts != null) {
        let page = this.pagination.current
        for (let i = 0; i < posts.length; ++i) {
          all[(page - 1) * size + i] = posts[i]
        }
      }
      return all
    }
  },

  created() {
    this.getPage(this.page, pageData => {
      this.pageData = fillTitle(pageData)
      this.loading = false
      this.pagination = {
        showQuickJumper: true,
        total: pageData.total,
        onChange: page => {
          this.$router.push({ query: { page } })
          this.updatePage(page)
        }
      }
      this.$set(this.pagination, 'current', this.page)
    })
  },

  methods: {
    async getPage(page, callback) {
      let pageData = await this.getData('/post', {
        page,
        size,
        orderByReply: true
      })
      if (callback != null) {
        callback(pageData)
      } else {
        return pageData
      }
    },

    async updatePage(page) {
      this.pagination.current = page
      this.loading = true
      let pageData = await this.getPage(page)
      this.pageData = fillTitle(pageData)
      this.loading = false
    },
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
