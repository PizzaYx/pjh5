<template>
    <div class="exhibition-list-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="非遗项目" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 搜索框 -->
        <van-search v-model="searchValue" placeholder="请输入搜索关键词" shape="round" background="transparent"
            class="custom-search" @search="onSearch" />

        <!-- 项目列表 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="" @load="onLoad">
                <div class="project-grid">
                    <div class="project-item" v-for="item in list" :key="item.id" @click="handleDetail(item)">
                        <!-- 背景图 -->
                        <img :src="item.img2" :alt="item.title" class="item-bg" loading="lazy" />
                        <!-- 文字内容 -->
                        <div class="info">
                            <h3 class="title">{{ item.title }}</h3>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import api, { type ProjectItem } from '@/api/index';

const router = useRouter();

// 状态
const searchValue = ref('');
const list = ref<ProjectItem[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const pageNum = ref(1);
const pageSize = 20;

// 返回上一页
const onClickLeft = () => {
    router.back();
};

// 搜索
const onSearch = (val: string) => {
    // TODO: 后端如果支持搜索，需要传入搜索参数
    showToast(`搜索: ${val}`);
    onRefresh();
};

// 加载数据
const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
            pageNum.value = 1;
        }

        const response = await api.project.getProjectList(pageNum.value, pageSize);

        if (response.code === 200 && response.data) {
            const newData = response.data.list;
            list.value.push(...newData);

            pageNum.value++;

            // 如果返回的数据少于 pageSize，说明没有更多了
            if (newData.length < pageSize) {
                finished.value = true;
            }
        } else {
            finished.value = true;
        }
    } catch (error) {
        console.error('获取非遗项目列表失败:', error);
        finished.value = true;
    } finally {
        loading.value = false;
    }
};

// 下拉刷新
const onRefresh = () => {
    finished.value = false;
    loading.value = true;
    onLoad();
};

// 点击详情
const handleDetail = (item: ProjectItem) => {
    // showToast(`查看详情: ${item.title}`);
    router.push('/intangible-heritage-list');
};
</script>

<style scoped lang="scss">
@use '@/styles/list-page-common.scss' as common;


.exhibition-list-container {
    @include common.list-page-container;
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


.project-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // 双列
    gap: 12px;
    padding: 12px;
    justify-items: center; // 居中对齐

    .project-item {
        width: 170px;
        height: 60px;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        .item-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 1;
        }

        .info {
            position: relative;
            z-index: 2;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start; // 左对齐
            padding-left: 15px; // 左侧留出间距
            // 蒙层，防止文字看不清
            background: rgba(0, 0, 0, 0.2);

            .title {
                // 蓝湖样式
                // width: 69px; // 建议去掉固定宽度，以免字数不够或超出一行
                font-family: "Source Han Serif CN", "Songti SC", serif; // 思源宋体
                font-weight: 700;
                font-size: 18px;
                color: #FFFFFF;
                line-height: 26px;
                text-align: left;
                font-style: normal;
                text-transform: none;

                margin: 0;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
            }
        }
    }
}
</style>
