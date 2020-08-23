<template>
  <a-list :data-source="posts" :loading="loading">
    <template v-slot:renderItem="post">
      <a-list-item>
        <a-list-item-meta>
          <template v-slot:title>
            <a href="#">{{ post.title }}</a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
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
    this.authorize()
    this.axios('/api/v1/post')
      .then(({ data }) => {
        this.loading = false
        this.posts = data.posts
      })
      .catch(e => {
        console.log(e.response)
      })
  }
}
</script>
