<template>
    <div class="exhibition-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="展览" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 列表内容 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="" @load="onLoad">
                <div class="content-grid double-column">
                    <div class="content-item" v-for="item in list" :key="item.id" @click="handleDetail(item)">
                        <!-- 图片 -->
                        <img :src="item.imgpath1 || item.orgimgpath" :alt="item.title" class="item-img"
                            loading="lazy" />
                        <!-- 文字信息 -->
                        <div class="item-info">
                            <h3 class="item-title">{{ item.title || item.simpletitle }}</h3>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { articleApi } from '@/api/index'
import { PlateArticleList } from '@/models'

const router = useRouter()
const route = useRoute()

// 状态
const list = ref<PlateArticleList[]>([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)

// 从路由参数获取 classid
const classid = computed(() => Number(route.query.classid) || 0)

// 返回上一页
const onClickLeft = () => {
    router.back()
}

// 加载数据
const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = []
            refreshing.value = false
            pageNum.value = 1
        }

        const response = await articleApi.getPlateArticleList(classid.value, pageNum.value, 0)

        if (response.code === 1200 && response.data) {
            const newData = response.data || []
            list.value.push(...newData)
            pageNum.value++

            if (newData.length === 0) {
                finished.value = true
            }
        } else {
            finished.value = true

        }
    } catch (error) {
        console.error('获取展览列表失败:', error)
        finished.value = true
    } finally {
        loading.value = false
    }
}

// 下拉刷新
const onRefresh = () => {
    finished.value = false
    loading.value = true
    onLoad()
}

// 点击详情
const handleDetail = (item: PlateArticleList) => {
    const aid = String(item.id || '')
    const title = String(item.title || item.simpletitle || '展览')
    if (!aid) return
    router.push({ path: '/exhibition-show-detail', query: { aid, title } })
}
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;

.exhibition-container {
    @include common.list-page-container;
}

@include common.navbar-title-lanhu;
@include common.back-icon;

.content-grid {
    display: grid;
    gap: 15px;
    padding: 15px 20px;

    &.single-column {
        grid-template-columns: 1fr;
        justify-items: center;
    }

    &.double-column {
        grid-template-columns: repeat(2, 1fr);
        padding: 12px 12px;
        gap: 9px;
    }

    .content-item {
        width: 100%;
        background: rgba(255, 250, 240, 1);
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 193px;

        &:active {
            transform: scale(0.98);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .item-img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            display: block;
            flex-shrink: 0;
        }

        .item-info {
            padding: 8px 12px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            flex: 1;
            min-height: 0;
            overflow: hidden;

            .item-title {
                margin: 0;
                font-family: "Source Han Serif CN", "Songti SC", serif;
                font-weight: 600;
                font-size: 14px;
                color: #833408;
                line-height: 20px;
                text-align: left;
                font-style: normal;
                text-transform: none;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

        }
    }
}
</style>
