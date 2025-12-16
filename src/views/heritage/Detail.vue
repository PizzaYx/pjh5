<template>
    <div class="heritage-detail-container">
        <van-nav-bar :title="detailName" fixed placeholder z-index="999" :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div class="detail-page">
                <div class="media">
                    <van-swipe class="media-swipe" :autoplay="0">
                        <van-swipe-item v-for="(m, idx) in mediaSlides" :key="`${m.type}-${idx}`">
                            <img v-if="m.type === 'image'" :src="m.url" class="media-img" loading="lazy"
                                @click="handlePreview(idx)" />
                            <video v-else class="media-video" :src="m.url" controls playsinline webkit-playsinline
                                preload="metadata"></video>
                        </van-swipe-item>
                    </van-swipe>
                </div>

                <div class="info-panel">
                    <h2 class="title">{{ detail?.name || pageTitle }}</h2>
                    <div class="meta">
                        <div class="meta-row">
                            <span class="meta-label">类别：</span><span class="meta-value">{{ detail?.category || '-'
                            }}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">级别：</span><span class="meta-value">{{ detail?.level || '-'
                            }}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">属地：</span><span class="meta-value">{{ detail?.region || '-'
                            }}</span>
                        </div>
                        <div class="meta-row">
                            <span class="meta-label">保护单位：</span><span class="meta-value">{{ detail?.protectionUnit ||
                                '-'
                            }}</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3 class="section-title">简介</h3>
                        <p class="section-content">{{ detail?.intro || '-' }}</p>
                    </div>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showImagePreview } from 'vant'
import api from '@/api/index'
import { HeritageItem } from '@/models'

const router = useRouter()
const route = useRoute()

const refreshing = ref(false)
const loading = ref(false)
const detail = ref<HeritageItem | null>(null)

const id = computed(() => String(route.query.id || ''))
const pageTitle = computed(() => String(route.query.title || '非遗项目'))
const detailName = computed(() => detail.value?.name || pageTitle.value)

/** 返回上一页 */
const onClickLeft = () => {
    router.back()
}

/** 根据路由 query 的 id 拉取详情数据并填充 detail */
const fetchDetail = async () => {
    try {
        loading.value = true
        if (!id.value) {
            showToast('缺少项目ID')
            return
        }
        const response = await api.heritage.getHeritageById(id.value)
        if (response.code === 1200 && response.data) {
            detail.value = response.data
        } else {
            showToast(response.msg || '获取详情失败')
        }
    } catch (error) {
        console.error('获取非遗详情失败:', error)
        showToast('获取详情失败')
    } finally {
        loading.value = false
    }
}

fetchDetail()

/** 下拉刷新：重新请求详情数据并重置刷新状态 */
const onRefresh = () => {
    refreshing.value = true
    fetchDetail().finally(() => {
        refreshing.value = false
    })
}

const mediaSlides = computed(() => {
    const raw: any = detail.value || {}
    const list = Array.isArray(raw.imgList) ? raw.imgList : []
    const slides: Array<{ type: 'image' | 'video'; url: string }> = []

    if (list.length) {
        const sorted = [...list].sort((a: any, b: any) => {
            const ao = Number(a?.sortOrder ?? Number.MAX_SAFE_INTEGER)
            const bo = Number(b?.sortOrder ?? Number.MAX_SAFE_INTEGER)
            return ao - bo
        })
        for (const item of sorted) {
            const url = String(item?.image || '')
            if (!url) continue
            const isVideo = /\.(mp4|m3u8|avi|mov|webm)$/i.test(url)
            slides.push({ type: isVideo ? 'video' : 'image', url })
        }
    }
    return slides
})

/** 打开图片预览，从当前点击的图片开始浏览 */
const handlePreview = (index: number) => {
    const images = mediaSlides.value.filter((m) => m.type === 'image').map((m) => m.url)
    if (!images.length) return
    const imageIndexMap = mediaSlides.value
        .map((m, i) => (m.type === 'image' ? i : -1))
        .filter((i) => i >= 0)
    const start = Math.max(0, imageIndexMap.indexOf(index))
    showImagePreview({
        images,
        startPosition: start,
    })
}

</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;
@use '@/styles/variables.scss' as *;

.heritage-detail-container {
    @include common.list-page-container;
}

@include common.navbar-title-lanhu;
@include common.back-icon;

.detail-page {
    padding: 12px;
}

.media {
    background: transparent;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.media-swipe {
    width: 100%;
    height: 200px;
}

.media-img,
.media-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: #000;
}

.media-swipe :deep(.van-swipe__indicators) {
    bottom: 8px;
}

.media-swipe :deep(.van-swipe__indicator) {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 1);
    border-radius: 50px;
    opacity: 0.5;
}

.media-swipe :deep(.van-swipe__indicator--active) {
    width: 18px;
    height: 4px;
    background: rgba(131, 52, 8, 1);
    border-radius: 50px;
    opacity: 1;
}

.info-panel {
    padding: 12px;
    background: rgba(252, 249, 242, 0.9);
    border-radius: 8px;
    margin-top: 12px;
}

.title {
    margin: 0;
    font-family: $font-family-serif;
    font-weight: 600;
    font-size: 18px;
    color: #833408;
    line-height: 25px;
    text-align: left;
}

.meta {
    margin-top: 6px;
}

.meta-row {
    display: flex;
    gap: 4px;
    font-family: $font-family-serif;
    font-weight: 400;
    font-size: 14px;
    color: #3D3D3D;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.meta-label {
    // opacity: 0.8;
    color: #3D3D3D;
}

.meta-value {
    color: #3D3D3D;
}

.section {
    margin-top: 10px;
}

.section-title {
    margin: 0;
    font-family: $font-family-serif;
    font-weight: 600;
    font-size: 18px;
    color: #833408;
    line-height: 25px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

.section-content {
    margin-top: 6px;
    font-family: $font-family-serif;
    font-weight: 400;
    font-size: 14px;
    color: #3D3D3D;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    white-space: pre-wrap;
}
</style>
