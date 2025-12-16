<template>
    <div class="exhibition-list-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="非遗动态" :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <div class="scroll-content">
            <!-- 搜索框 -->
            <div class="search-container">
                <van-search v-model="searchValue" placeholder="请输入搜索关键词" shape="round" background="transparent"
                    class="custom-search" @search="onSearch" />
            </div>

            <!-- 列表 -->
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <van-list v-model:loading="loading" :finished="finished" finished-text="" @load="onLoad">
                    <div class="news-list">
                        <div class="news-card" v-for="item in list" :key="item.id" @click="handleDetail(item)">
                            <div class="news-img-box">
                                <img :src="formatImg(item.imgpath1)" loading="lazy" />
                            </div>
                            <div class="news-info">
                                <p class="news-title van-multi-ellipsis--l2">{{ item.title }}</p>
                                <p class="news-date">
                                    <van-icon name="calendar-o" /> {{ formatNewsDate(item.publishtime) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import api from '@/api/index';
import { imageDealWith } from '@/utils/image';

const router = useRouter();

// 状态
const searchValue = ref('');
const list = ref<any[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const pageSize = 20;

const onClickLeft = () => router.back();

// 搜索
const onSearch = (val: string) => {
    // TODO: 后端如果支持搜索，需要传入搜索参数
    showToast(`搜索: ${val}`);
    refreshing.value = true;
    onRefresh();
};

const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
            pageNum.value = 1;
        }

        const response = await api.news.getNewsPage(pageNum.value, searchValue.value);
        if (response.code === 1200 && response.data) {
            const newData = response.data || [];
            list.value.push(...newData);
            pageNum.value++;
            if (newData.length < pageSize) finished.value = true;
        } else {
            finished.value = true;
        }
    } catch (error) {
        console.error('获取动态列表失败:', error);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

const onRefresh = () => {
    finished.value = false;
    loading.value = true;
    // 通过 refreshing 标记触发 onLoad 内的重置逻辑（清空列表并将 pageNum 置为 1）
    if (!refreshing.value) {
        refreshing.value = true;
    }
    onLoad();
};

const handleDetail = (item: any) => {
    router.push({ path: '/news-detail', query: { aid: String(item.id || ''), title: item.title || '' } });
};

const formatImg = (p?: string) => {
    return imageDealWith(p || '');
};
const formatNewsDate = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts as number);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
};
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;


.exhibition-list-container {
    @include common.list-page-container;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.scroll-content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-direction: column;
}

// 使用蓝湖样式的导航栏
@include common.navbar-title-lanhu;

// 返回按钮
@include common.back-icon;

// 搜索框样式
:deep(.custom-search) {
    background: #FFFFFF !important;
    height: 32px;
    padding: 0 0;
    margin: 0 12px;
    text-align: left;

    .van-search__content {
        background: #FFFFFF;
        border-radius: 8px; // 较小的圆角

        .van-field__control {
            background: #FFFFFF;
            text-align: left;
        }
    }
}

.search-container {
    margin-top: 12px;
}

.news-list {
    padding: 12px;
    display: grid;
    grid-template-columns: 1fr; // 单列
    gap: 12px;

    .news-card {
        width: 351px;
        height: 106px;
        background: #FFFFFF;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.2);
        border-radius: 4px 4px 4px 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;

        .news-img-box {
            width: 110px;
            height: 86px;
            flex-shrink: 0;
            margin-right: 10px;

            img {
                width: 110px;
                height: 86px;
                object-fit: cover;
                border-radius: 4px;
            }
        }

        .news-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;

            .news-title {
                font-size: 14px;
                color: #333;
                margin: 0;
                line-height: 1.4;
                font-weight: bold;
            }

            .news-date {
                font-size: 12px;
                color: #999;
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 8px;
            }
        }
    }
}
</style>
