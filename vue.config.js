module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://simplebbs.iterator-traits.com',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
