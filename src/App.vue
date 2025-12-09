<template>
    <div id="app">
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
            </keep-alive>
            <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import api from '@/api'

onMounted(async () => {
    console.log('Vue3 H5 项目启动成功！')

    // 初始化时获取 Token
    try {
        await api.auth.getToken()
    } catch (error) {
        console.error('获取 Token 失败:', error)
    }
})
</script>

<style lang="scss">
#app {
    width: 100%;
    min-height: 100vh;
}
</style>
