module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'axios': 'axios',
            'element-ui': 'ELEMENT'
        }
    }
}