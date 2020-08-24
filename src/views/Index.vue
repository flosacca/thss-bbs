<template>
  <div id="posts">
    <a-list item-layout="vertical" :loading="loading" :data-source="posts">
      <template v-slot:renderItem="post">
        <a-list-item>
          <!-- <a-list-item-meta>
            <template v-slot:title>
              <router-link :to="`/posts/${post.id}`">{{ post.title }}</router-link>
            </template>
          </a-list-item-meta> -->
          <router-link :to="`/posts/${post.id}`">
            <span>{{ post.title }}</span> - {{ post.nickname }} @ {{ post.updated }}
          </router-link>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      posts: []
    }
  },
  created() {
    this.getData('/post', {
      size: 20,
      orderByReply: true
    }, data => {
      this.loading = false
      data.posts.forEach(post => {
        if (/^\s*$/.test(post.title)) {
          post.title = '(empty)'
        }
      })
      this.posts = data.posts
      console.log(data)
    })
  }
}
</script>

<style lang="scss">
#posts {
  li {
    overflow: auto;
    a {
      color: inherit;
      &:hover {
        color: #1890ff;
      }
      span {
        font-weight: bold;
      }
    }
  }
}
</style>
