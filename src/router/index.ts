import { createRouter, createWebHistory } from 'vue-router'
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
        path: '/intangible-heritage-list',
        name: 'IntangibleHeritageList',
        component: () => import('@/views/IntangibleHeritageList.vue'),
        meta: {
            title: '非遗项目',
            keepAlive: true,
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
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

// 路由守卫
router.beforeEach((to, from, next) => {
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

