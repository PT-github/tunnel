export default {
    mode: 'spa',
    head: {
        title: '智慧隧道监测与运营服务平台',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
        script: [ {src: '/qcxt.js'} ]
    },
    router: {
        middleware: [ 'auth' ]
    },
    loading: {color: '#fff'},
    loadingIndicator: '~/skeleton.html',
    server: {
        host: '0.0.0.0'
    },
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '~/plugins/index.less'
    ],
    plugins: [
        '~/plugins/element-ui',
        '~/plugins/framework-install',
        '~/plugins/index'
    ],
    build: {
        transpile: [ /^element-ui/ ],
        postcss: [
            require('postcss-px2rem')({
                remUnit: 75,
                remPrecision: 8
            }),
            require('autoprefixer')
        ],
        extend (config, ctx) {
        }
    },
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/proxy'
    ],
    axios: {
        proxy: true
    },
    // proxy: {
    //     '/api': {
    //         target: 'http://w8.qcxt.com:65036:65036',
    //         pathRewrite: {
    //             '^/api/': '/api'
    //         }
    //     }
    // }
};
