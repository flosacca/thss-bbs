<script>
export default {
  name: 'base-items',

  props: {
    items: {
      type: Array,
      default: () => []
    },
    tag: {
      type: String,
      default: 'div'
    },
    delimiter: {
      type: String,
      default: ' / '
    }
  },

  render(h) {
    let a = []
    this.items.forEach(item => {
      if (item != null) {
        if (Array.isArray(item)) {
          item = h(...item)
        }
        a = a.concat([item, this.delimiter])
      }
    })
    if (a.length) {
      a.pop()
    }
    return h(this.tag, {}, a)
  }
}
</script>
