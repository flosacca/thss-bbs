const hljs = require('highlight.js')

const MarkdownIt = require('markdown-it')({
  html: true,
  linkify: true,
  highlight(code, lang) {
    let html = null
    if (lang && hljs.getLanguage(lang)) {
      try {
        html = hljs.highlight(lang, code).value
      } catch {}
    }
    if (html == null) {
      html = MarkdownIt.utils.escapeHtml(code)
    }
    return `<pre class="hljs"><code>${html}</code></pre>`
  }
})

export default {
  bold(text) {
    let style = { fontWeight: 'bold' }
    return ['span', { style }, text]
  },

  render(content) {
    return MarkdownIt.render(content)
  },

  mixin: {
    methods: {
      userLink(post) {
        let args = ['a', {}, post.nickname]
        args[1].on = {
          click: () => {
            let query = {}
            if (this.$route.path === '/') {
              query = { ...this.$route.query }
              delete query.page
            }
            query.userId = post.userId
            this.$router.push({ path: '/', query }).catch(e => e)
            this.reload()
          }
        }
        return args
      }
    }
  }
}
