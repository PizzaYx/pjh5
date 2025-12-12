<template>
    <div class="exhibition-container">
        <van-nav-bar title="视频" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div class="detail-page">
                <div class="player">
                    <video
                        v-if="video?.videourl"
                        class="player-video"
                        :src="video?.videourl"
                        :poster="video?.imgurl"
                        controls
                        playsinline
                        webkit-playsinline
                    />
                </div>

                <div class="info-panel">
                    <h2 class="title">{{ video?.title || pageTitle }}</h2>
                    <div class="meta-row">
                        <span class="meta-item">时间：{{ video?.friendlyTime || formatTime(video?.publishtime) || '-' }}</span>
                        <!-- <span class="meta-item">点击：{{ video?.c_num || 0 }}</span> -->
                    </div>
                    <p class="desc">{{ video?.intro || '' }}</p>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { articleApi } from '@/api/index'
import type { VideoCommentData } from '@/models'

const router = useRouter()
const route = useRoute()

const refreshing = ref(false)
const loading = ref(false)
const video = ref<VideoCommentData | null>(null)

const aid = computed(() => String(route.query.aid || ''))
const pageTitle = computed(() => String(route.query.title || '视频'))
const type = computed(() => Number(route.query.type || 0))

const onClickLeft = () => {
    router.back()
}

const fetchDetail = async () => {
    try {
        loading.value = true
        if (!aid.value) {
            return
        }
        const response = await articleApi.getArticleDetail(aid.value, type.value)
        if (response.code === 1200 && response.data) {
            video.value = response.data
        }
    } catch (error) {
        console.error('获取视频详情失败:', error)
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
    try {
        const d = new Date(ts)
        if (isNaN(d.getTime())) return ''
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${dd}`
    } catch {
        return ''
    }
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

.player {
    width: 100%;
    background: #000;
    margin-top: 12px;
}

.player-video {
    width: 100%;
    height: 240px;
    display: block;
    background: #000;
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

.desc {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
}
</style>

