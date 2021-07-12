export default {
    mode: 'spa',
    head: {
        // title: '湖南高速隧道智能管控平台',
        title: '高速隧道智能管控平台',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ],
        script: [{src: '/jquery-1.7.1.min.js'}, {src: '/codebase/webVideoCtrl.js'},{src: '/qcxt.js'},{src: '/flv.min.js'}]
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
        '~/plugins/index',
        '~/plugins/drag',
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
        // '/api': {
        //     target: 'http://w7.qcxt.com:8060',
        //     // target: 'http://w8.qcxt.com:65036:65036',
        //     pathRewrite: {
        //         '^/api/': '/api'
        //     }
        // }
    // }
};
