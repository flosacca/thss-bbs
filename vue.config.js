module.exports = {
  // chainWebpack: config => {
  //   config.module.rules.delete('eslint');
  // },
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
