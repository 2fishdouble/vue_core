import {createRouter, createWebHistory} from 'vue-router'
// 路由push replace  router-link上面设置 to/replace

// 编程式路由导航即脱离router-link的跳转，通过router实例的push、replace方法实现

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/layout',
            component: () => import('@/views/Layout.vue'),
            children: [
                {
                    path: 'dog',
                    component: () => import('@/views/Dog.vue')
                },
                {
                    path: 'cat',
                    component: () => import('@/views/Cat.vue')
                },
                {
                    path: 'hk',
                    component: () => import('@/views/HkMap.vue')
                },
                {
                    path: 'sc',
                    component: () => import('@/views/Sichuan.vue')
                },
                {
                    path: 'lion',
                    component: () => import('@/views/Lion.vue')
                },
                {
                    path: 'hook',
                    component: () => import('@/views/Hooks.vue')
                },
                {
                    path: 'style',
                    component: () => import('@/views/Style.vue')
                },
                {
                    path: 'sass',
                    component: () => import('@/views/SassStyle.vue')
                },
                {
                    path: 'screen',
                    component: () => import('@/views/Screen.vue')
                },
            ]
        },

        {
            path: '/',
            redirect: '/login'
        },
    ]
})
