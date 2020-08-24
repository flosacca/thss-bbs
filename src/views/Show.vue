<template>
  <div v-html="this.content"></div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      content: null
    }
  },
  created() {
    this.getData(`/post/${this.id}`, {}, data => {
      this.content = data.content
      console.log(data)
    })
  }
}
</script>
