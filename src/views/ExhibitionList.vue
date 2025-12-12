<template>
    <div class="exhibition-list-container">
        <!-- 顶部导航栏 -->
        <van-nav-bar title="网上展厅" fixed placeholder :border="false" @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" class="back-icon" />
            </template>
        </van-nav-bar>

        <!-- 项目列表 -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model:loading="loading" :finished="finished" finished-text="" @load="onLoad">
                <div class="project-grid">
                    <div class="project-item" v-for="item in list" :key="item.classid" @click="handleDetail(item)">
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
import { useRouter, useRoute } from 'vue-router';
import api from '@/api/index';
import { Records } from '@/models';

const router = useRouter();
const route = useRoute();

// 状态
const list = ref<Records[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

// 从路由参数获取 classid，转换为 number
const classid = Number(route.query.classid) || 0;

// 返回上一页
const onClickLeft = () => {
    router.back();
};

// 加载数据
const onLoad = async () => {
    try {
        if (refreshing.value) {
            list.value = [];
            refreshing.value = false;
        }

        // 调用项目 API，传入 classid
        const response = await api.project.getProjectList(classid);

        if ((response.code === 1200 || response.code === 0) && response.data && response.data.records) {
            list.value = (response.data.records as any);
            finished.value = true;
        } else {
            finished.value = true;
        }
    } catch (error) {
        console.error('获取网上展厅列表失败:', error);
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
const handleDetail = (item: Records) => {
    // 根据 name 判断跳转到哪个子页面
    let path = '/exhibition-album'; // 默认相册
    
    if (item.name.includes('音乐')) {
        path = '/exhibition-music';
    } else if (item.name.includes('展览')) {
        path = '/exhibition-show';
    } else if (item.name.includes('视频')) {
        path = '/exhibition-video';
    } else if (item.name.includes('相册')) {
        path = '/exhibition-album';
    }
    
    // 跳转到子页面，传递 classid 参数
    router.push({ path, query: { classid: String(item.classid) } });
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

.project-grid {
    display: grid;
    grid-template-columns: 1fr; // 单列
    gap: 15px;
    padding: 15px 20px; // 左右留白，让内容居中
    justify-items: center; // 居中对齐

    .project-item {
        width: 330px; // 蓝湖宽度
        height: 130px; // 蓝湖高度
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
            padding-left: 20px; // 左侧间距加大

            .title {
                font-family: "Source Han Serif CN", "Songti SC", serif;
                font-weight: 700;
                font-size: 18px;
                color: #6C2701;
                line-height: 26px;
                text-align: left;
                font-style: normal;
                text-transform: none;

                margin: 0;
            }
        }
    }
}
</style>
