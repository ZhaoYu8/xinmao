module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      axios: 'axios',
      'element-ui': 'ELEMENT',
      antv: 'antv'
    }
  },
  devServer: {
    port: '8001',
    open: true
  }
};
