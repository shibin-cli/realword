export default {
    router: {
        linkActiveClass:"active",
        extendRoutes(routes, resolve) {
            // 删除默认生成的路由
            routes.splice(0)
            routes.push(...[{
                path: '/',
                component: resolve(__dirname, 'pages/layout/index.vue'),
                children: [{
                    path: '/',
                    component: resolve(__dirname, 'pages/home'),
                    name: 'home'
                }, {
                    path: '/login',
                    component: resolve(__dirname, 'pages/login'),
                    name: 'login'
                }, {
                    path: '/register',
                    component: resolve(__dirname, 'pages/login'),
                    name: 'register'
                }, {
                    path: '/profile/:username',
                    component: resolve(__dirname, 'pages/profile'),
                    name: 'profile'
                }, {
                    path: '/settings',
                    component: resolve(__dirname, 'pages/settings'),
                    name: 'settings'
                }, {
                    path: '/editor',
                    component: resolve(__dirname, 'pages/editor'),
                    name: 'editor'
                }, {
                    path: '/editor/:slug',
                    component: resolve(__dirname, 'pages/editor'),
                    name: 'updateEditor'
                }, {
                    path: '/article/:slug',
                    component: resolve(__dirname, 'pages/article'),
                    name: 'article'
                }]
            }])
        }
    },
    plugins: ['~plugins/request.js', '~plugins/day.js'],
    loading: {
        color: '#5cb85c',
        height: '2px'
    },
    server: {
        port: 5001
    }
}