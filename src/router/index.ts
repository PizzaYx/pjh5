import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
            title: '首页',
            keepAlive: true,
        },
    },
    {
        path: '/project-list',
        name: 'ProjectList',
        component: () => import('@/views/ProjectList.vue'),
        meta: {
            title: '非遗项目',
            keepAlive: true, // 开启缓存，保持滚动位置
        },
    },
    {
        path: '/exhibition-list',
        name: 'ExhibitionList',
        component: () => import('@/views/ExhibitionList.vue'),
        meta: {
            title: '网上展厅',
            keepAlive: true,
        },
    },
    {
        path: '/exhibition-album',
        name: 'ExhibitionAlbum',
        component: () => import('@/views/exhibition/Album.vue'),
        meta: {
            title: '相册',
            keepAlive: true,
        },
    },
    {
        path: '/exhibition-album-detail',
        name: 'ExhibitionAlbumDetail',
        component: () => import('@/views/exhibition/AlbumDetail.vue'),
        meta: {
            title: '相册',
            keepAlive: false,
        },
    },
    {
        path: '/exhibition-music',
        name: 'ExhibitionMusic',
        component: () => import('@/views/exhibition/Music.vue'),
        meta: {
            title: '音乐',
            keepAlive: true,
        },
    },
    {
        path: '/exhibition-show',
        name: 'ExhibitionShow',
        component: () => import('@/views/exhibition/Show.vue'),
        meta: {
            title: '展览',
            keepAlive: true,
        },
    },
    {
        path: '/article-detail',
        name: 'ArticleDetail',
        component: () => import('@/views/common/ArticleDetail.vue'),
        meta: {
            title: '新闻',
            keepAlive: false,
        },
    },
    {
        path: '/exhibition-video',
        name: 'ExhibitionVideo',
        component: () => import('@/views/exhibition/Video.vue'),
        meta: {
            title: '视频',
            keepAlive: true,
        },
    },
    {
        path: '/exhibition-video-detail',
        name: 'ExhibitionVideoDetail',
        component: () => import('@/views/exhibition/VideoDetail.vue'),
        meta: {
            title: '视频',
            keepAlive: false,
        },
    },
    {
        path: '/inheritor-list',
        name: 'InheritorList',
        component: () => import('@/views/InheritorList.vue'),
        meta: {
            title: '非遗传承人',
            keepAlive: true,
        },
    },
    {
        path: '/news-list',
        name: 'NewsList',
        component: () => import('@/views/NewsList.vue'),
        meta: {
            title: '非遗动态',
            keepAlive: true,
        },
    },
    {
        path: '/news-detail',
        name: 'NewsDetail',
        component: () => import('@/views/NewsDetail.vue'),
        meta: {
            title: '非遗动态',
            keepAlive: false,
        },
    },
    {
        path: '/intangible-heritage-list',
        name: 'IntangibleHeritageList',
        component: () => import('@/views/IntangibleHeritageList.vue'),
        meta: {
            title: '非遗项目',
            keepAlive: false,
        },
    },
    {
        path: '/intangible-heritage-detail',
        name: 'IntangibleHeritageDetail',
        component: () => import('@/views/heritage/Detail.vue'),
        meta: {
            title: '非遗项目',
            keepAlive: false,
        },
    },
    {
        path: '/inheritor-detail',
        name: 'InheritorDetail',
        component: () => import('@/views/inheritor/Detail.vue'),
        meta: {
            title: '非遗传承人',
            keepAlive: false,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            title: '404',
        },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(_to, _from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

// 路由守卫
router.beforeEach((to, _from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = to.meta.title as string
    }

    // 这里可以添加登录验证等逻辑
    // const token = localStorage.getItem('token')
    // if (!token && to.path !== '/login') {
    //   next('/login')
    //   return
    // }

    next()
})

router.afterEach(() => {
    // 路由跳转后的处理
})

export default router
