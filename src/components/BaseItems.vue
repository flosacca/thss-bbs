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
    }
  },

  render(createElement) {
    let a = []
    this.items.forEach(item => {
      if (Array.isArray(item)) {
        item = createElement(...item)
      }
      a.push(item)
      a.push(' / ')
    })
    if (a.length) {
      a.pop()
    }
    return createElement(this.tag, {}, a)
  }
}
</script>
