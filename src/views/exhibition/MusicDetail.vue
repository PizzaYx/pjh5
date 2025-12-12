<template>
    <div class="exhibition-container">
        <van-nav-bar title="音乐" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div class="detail-page">
                <div class="info-panel">
                    <h2 class="title">{{ article?.title || pageTitle }}</h2>
                    <div class="meta-row">
                        <span class="meta-item">时间：{{ formatTime(article?.publishtime) || '-' }}</span>
                        <!-- <span class="meta-item">点击：{{ article?.click || 0 }}</span> -->
                    </div>
                </div>
                <div class="rich-content" v-html="article?.content || ''"></div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { articleApi } from '@/api/index'
import type { GetArticle } from '@/models'

const router = useRouter()
const route = useRoute()

const refreshing = ref(false)
const loading = ref(false)
const article = ref<GetArticle | null>(null)

const aid = computed(() => String(route.query.aid || ''))
const pageTitle = computed(() => String(route.query.title || '音乐'))

const onClickLeft = () => {
    router.back()
}

const fetchDetail = async () => {
    try {
        loading.value = true
        if (!aid.value) return
        const response = await articleApi.getArticle(aid.value)
        if (response.code === 1200 && response.data) {
            article.value = response.data
        }
    } catch (error) {
        console.error('获取音乐详情失败:', error)
    } finally {
        loading.value = false
    }
}

fetchDetail()

const onRefresh = () => {
    refreshing.value = true
    fetchDetail().finally(() => {
        refreshing.value = false
    })
}

const formatTime = (ts?: number) => {
    if (!ts) return ''
    const d = new Date(ts)
    if (isNaN(d.getTime())) return ''
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dd}`
}
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;

.exhibition-container {
    @include common.list-page-container;
}

@include common.navbar-title-lanhu;
@include common.back-icon;

.detail-page {
    padding: 0;
}

.info-panel {
    padding: 15px 12px;
}

.title {
    margin: 0;
    font-family: "Source Han Serif CN", "Songti SC", serif;
    font-weight: 600;
    font-size: 18px;
    color: #833408;
    line-height: 26px;
    text-align: left;
}

.meta-row {
    margin-top: 6px;
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #999;
}

.rich-content {
    padding: 0 12px 16px 12px;
}
.rich-content :deep(img) {
    max-width: 100%;
    height: auto;
    display: block;
}
.rich-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
}
.rich-content :deep(p) {
    line-height: 1.7;
    color: #333;
}
</style>

