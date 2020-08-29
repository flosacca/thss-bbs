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
      if (item != null) {
        if (Array.isArray(item)) {
          item = createElement(...item)
        }
        a = a.concat([item, ' / '])
      }
    })
    if (a.length) {
      a.pop()
    }
    return createElement(this.tag, {}, a)
  }
}
</script>
