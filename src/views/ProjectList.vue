<template>
    <div class="exhibition-list-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="非遗项目" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 项目列表 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="" @load="onLoad">
                <div class="project-grid">
                    <div class="project-item" v-for="item in list" :key="item.classid"
                        @click="handleDetail(item.classid)">
                        <!-- 背景图 -->
                        <img :src="item.imgmax" :alt="item.name" class="item-bg" loading="lazy" />
                        <!-- 文字内容 -->
                        <div class="info">
                            <h3 class="title">{{ item.name }}</h3>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import api from '@/api/index';
import { Records } from '@/models';

const route = useRoute();
const router = useRouter();

// 状态
const list = ref<Records[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const projectClassId = ref<number | null>(
    Number(route.query.classid ?? route.params.classid ?? route.query.classId ?? route.params.classId) || null,
);

// 返回上一页
const onClickLeft = () => {
    router.back();
};

// 获取 classid：仅使用路由传入的 classid，不再从接口回退获取。
// 如果没有 classid，调用方应当处理（例如提示或返回）。
const fetchProjectClassId = async () => {
    return projectClassId.value;
};

// 拉取非遗项目完整列表
const loadProjects = async () => {
    const classid = await fetchProjectClassId();
    if (!classid) {
        finished.value = true;
        return;
    }

    const response = await api.project.getProjectList(classid);
    if ((response.code === 1200 || response.code === 0 || response.code === 200) && response.data?.records) {
        list.value = response.data.records;
    }
    finished.value = true; // 接口一次性返回全部数据
};

// 加载数据
const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
            finished.value = false;
        }

        loading.value = true;
        await loadProjects();
    } catch (error) {
        console.error('获取非遗项目列表失败:', error);
        showToast('获取非遗项目失败');
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

// 点击详情，传入项目 id 并通过 query 跳转到详情页
const handleDetail = (id: string | number) => {
    router.push({ path: '/intangible-heritage-list', query: { id: String(id) } });
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
