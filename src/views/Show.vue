<template>
  <div id="post">
    <div v-html="post.content"></div>
    <a-list item-layout="vertical" :loading="loading" :data-source="post.reply">
      <template v-slot:renderItem="reply">
        <a-list-item>
          <div>{{ reply.id }} - {{ reply.nickname }} @ {{ reply.updated }}</div>
          <div>&gt;&gt;{{ reply.replyId }}</div>
          <div v-html="reply.content"></div>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      post: {}
    }
  },
  created() {
    this.getData(`/post/${this.id}`, {}, data => {
      this.post = data
      console.log(data)
    })
  }
}
</script>
