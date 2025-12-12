<template>
    <div class="exhibition-container">
        <van-nav-bar title="相册" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <div class="detail-page">
                <div class="gallery">
                    <van-swipe class="gallery-swipe" :autoplay="3000" indicator-color="white">
                        <van-swipe-item v-for="(img, idx) in images" :key="img.id" @click="handlePreview(idx)">
                            <img :src="img.imgpath" :alt="img.title || pageTitle" class="gallery-img" loading="lazy" />
                        </van-swipe-item>
                    </van-swipe>
                </div>

                <div class="info-panel">
                    <h2 class="album-title">{{ photos?.title || pageTitle }}</h2>
                    <div class="meta-row">
                        <span class="meta-item">时间：{{ photos?.timestamp || '-' }}</span>
                    </div>
                    <p class="album-desc">{{ firstIntro }}</p>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showImagePreview } from 'vant'
import { photoApi } from '@/api/index'
import type { GetArticlePhotos } from '@/models'

const router = useRouter()
const route = useRoute()

const refreshing = ref(false)
const loading = ref(false)
const photos = ref<GetArticlePhotos | null>(null)

const aid = computed(() => String(route.query.aid || ''))
const pageTitle = computed(() => String(route.query.title || '相册'))

const onClickLeft = () => {
    router.back()
}

const fetchPhotos = async () => {
    try {
        loading.value = true
        if (!aid.value) {
            showToast('缺少相册ID')
            return
        }
        const response = await photoApi.getArticlePhotos(aid.value)
        if (response.code === 1200 && response.data) {
            photos.value = response.data
        } else {

        }
    } catch (error) {
        console.error('获取图集详情失败:', error)
    } finally {
        loading.value = false
    }
}

fetchPhotos()

const onRefresh = () => {
    refreshing.value = true
    fetchPhotos().finally(() => {
        refreshing.value = false
    })
}

const images = computed(() => photos.value?.imageDataVec || [])
const firstIntro = computed(() => images.value[0]?.intro || '')

const handlePreview = (start: number) => {
    const imgs = images.value.map(i => i.imgpath)
    if (!imgs.length) return
    showImagePreview({
        images: imgs,
        startPosition: start,
    })
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

.gallery {
    width: 100%;
    border-radius: 0;
    overflow: hidden;
    background: transparent;
    box-shadow: none;
    margin-top: 12px;
}

.gallery-swipe {
    width: 100%;
    height: 240px;
}

.gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.info-panel {
    padding: 15px 12px;
}

.album-title {
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

.album-desc {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
}
</style>
